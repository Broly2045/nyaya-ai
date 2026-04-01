import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import NyayaDocument from "@/models/Document";
import Analysis from "@/models/Analysis";
import { analyzeDocument } from "@/lib/groq";
import redis from "@/lib/redis";
import { checkRateLimit } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // Rate limit: 20 analyses per hour
    const rl = await checkRateLimit(session.user.id, "analyze", 20, 3600);
    if (!rl.allowed) {
      return NextResponse.json(
        { success: false, message: "Analysis rate limit reached. Please wait." },
        { status: 429 }
      );
    }

    const { documentId } = await req.json();
    if (!documentId) {
      return NextResponse.json({ success: false, message: "documentId required" }, { status: 400 });
    }

    await connectToDatabase();

    // Check cache first (saves Groq API calls)
    const cacheKey = `analysis:${documentId}`;
    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        return NextResponse.json({
          success: true,
          message: "OK (cached)",
          data: JSON.parse(cached),
        });
      }
    } catch {
      // Redis unavailable — continue without cache
    }

    const document = await NyayaDocument.findOne({
      _id: documentId,
      userId: session.user.id,
    }).select("+textContent"); // Include textContent for analysis

    if (!document) {
      return NextResponse.json({ success: false, message: "Document not found" }, { status: 404 });
    }

    let textToAnalyze = document.textContent;

    if (!textToAnalyze || textToAnalyze.includes("unavailable") || textToAnalyze.includes("pending")) {
      console.log("Text content missing or pending. Discovering from Cloudinary URL...", document.fileUrl);
      try {
        const response = await fetch(document.fileUrl, {
          headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/100.0" }
        });
        if (!response.ok) {
          throw new Error(`Cloudinary fetch failed: ${response.status} ${response.statusText}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        if (document.fileType === "pdf" || document.fileUrl.toLowerCase().endsWith(".pdf")) {
          const PDFParser = require("pdf2json");
          const pdfParser = new PDFParser(null, 1);
          
          textToAnalyze = await new Promise<string>((resolve, reject) => {
            pdfParser.on("pdfParser_dataError", (errData: any) => reject(errData.parserError));
            pdfParser.on("pdfParser_dataReady", () => resolve(decodeURIComponent(pdfParser.getRawTextContent())));
            pdfParser.parseBuffer(buffer);
          });
        } else {
          textToAnalyze = buffer.toString("utf-8");
        }

        if (textToAnalyze && textToAnalyze.trim().length > 0) {
          // Save back to DB so we don't have to extract again
          await NyayaDocument.findByIdAndUpdate(documentId, { textContent: textToAnalyze });
        } else {
          throw new Error("Extracted text is empty");
        }
      } catch (err: any) {
        console.error("JIT Text Extraction failed:", err);
        return NextResponse.json(
          { success: false, message: "Could not extract text from document for analysis." },
          { status: 400 }
        );
      }
    }

    // Mark as analyzing
    await NyayaDocument.findByIdAndUpdate(documentId, { status: "analyzing" });

    const startTime = Date.now();

    // Call Groq
    const analysisData = await analyzeDocument(
      textToAnalyze,
      document.detectedType ?? "Unknown"
    );

    const processingTimeMs = Date.now() - startTime;

    // Save analysis
    const analysis = await Analysis.create({
      documentId,
      userId: session.user.id,
      processingTimeMs,
      ...analysisData,
    });

    // Update document with analysis reference and detected type
    await NyayaDocument.findByIdAndUpdate(documentId, {
      status: "analyzed",
      analysisId: analysis._id,
      detectedType: analysisData.documentType,
      cnrNumber: analysisData.cnrNumber ?? null,
      courtHierarchy: analysisData.courtHierarchy ?? null,
    });

    // Cache for 48 hours
    try {
      await redis.setex(cacheKey, 172800, JSON.stringify(analysis));
    } catch {
      // Redis unavailable — skip caching
    }

    return NextResponse.json({ success: true, message: "Analysis complete", data: analysis });
  } catch (error) {
    console.error("Analysis error:", error);

    // Mark document as failed
    try {
      const { documentId } = await req.json().catch(() => ({}));
      if (documentId) {
        await NyayaDocument.findByIdAndUpdate(documentId, { status: "failed" });
      }
    } catch {}

    return NextResponse.json({ success: false, message: "Analysis failed" }, { status: 500 });
  }
}
