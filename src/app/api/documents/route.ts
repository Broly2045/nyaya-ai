import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import NyayaDocument from "@/models/Document";
import User from "@/models/User";
import { uploadLegalDocument } from "@/lib/cloudinary";
import { checkRateLimit } from "@/lib/rateLimit";
import { ApiResponse, IDocument } from "@/types";

// GET /api/documents — fetch user's documents
export async function GET(
  req: NextRequest
): Promise<NextResponse<ApiResponse<IDocument[]>>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const documents = await NyayaDocument.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .select("-textContent") // Don't send full text
      .lean();

    return NextResponse.json({
      success: true,
      message: "OK",
      data: documents as unknown as IDocument[],
    });
  } catch (error) {
    console.error("GET /api/documents error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

// POST /api/documents — upload new document
export async function POST(
  req: NextRequest
): Promise<NextResponse<ApiResponse<IDocument>>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Rate limit: max 10 uploads per hour
    const rl = await checkRateLimit(session.user.id, "upload", 10, 3600);
    if (!rl.allowed) {
      return NextResponse.json(
        { success: false, message: `Rate limit exceeded. Try again in ${rl.resetIn}s` },
        { status: 429 }
      );
    }

    await connectToDatabase();

    // Check subscription limit
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const isUnlimited = user.subscription !== "free";
    if (!isUnlimited && user.documentsUsed >= user.documentsLimit) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Monthly document limit reached. Upgrade to Advocate Pro for unlimited analysis.",
        },
        { status: 403 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: "Only PDF, DOC, DOCX, and TXT files allowed" },
        { status: 400 }
      );
    }

    // Max 20MB
    const MAX_SIZE = 20 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, message: "File size must be under 20MB" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const { url, publicId } = await uploadLegalDocument(
      buffer,
      file.name,
      session.user.id
    );

    // Detect file type
    const getFileType = (name: string, mimeType: string) => {
      if (mimeType === "application/pdf" || name.endsWith(".pdf")) return "pdf";
      if (name.endsWith(".docx") || mimeType.includes("wordprocessingml")) return "docx";
      if (name.endsWith(".doc") || mimeType === "application/msword") return "doc";
      return "txt";
    };

    const fileType = getFileType(file.name, file.type);

    let textContent = "";
    try {
      if (fileType === "pdf") {
        const PDFParser = require("pdf2json");
        const pdfParser = new PDFParser(null, 1);
        
        textContent = await new Promise<string>((resolve, reject) => {
          pdfParser.on("pdfParser_dataError", (errData: any) => reject(errData.parserError));
          pdfParser.on("pdfParser_dataReady", () => resolve(decodeURIComponent(pdfParser.getRawTextContent())));
          pdfParser.parseBuffer(buffer);
        });
      } else if (fileType === "txt") {
        textContent = buffer.toString("utf-8");
      }
    } catch (err) {
      console.warn("Text extraction failed:", err);
    }

    const document = await NyayaDocument.create({
      userId: session.user.id,
      title: title?.trim() || file.name,
      originalName: file.name,
      fileUrl: url,
      publicId,
      fileType,
      fileSize: file.size,
      textContent: textContent || "Text extraction pending or unavailable for this format.",
      status: "uploaded",
    });

    // Increment usage counter
    await User.findByIdAndUpdate(session.user.id, {
      $inc: { documentsUsed: 1 },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Document uploaded successfully",
        data: document as unknown as IDocument,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/documents error:", error);
    return NextResponse.json(
      { success: false, message: "Upload failed" },
      { status: 500 }
    );
  }
}
