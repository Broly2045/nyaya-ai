import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import NyayaDocument from "@/models/Document";
import Analysis from "@/models/Analysis";
import mongoose from "mongoose";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const documentId = resolvedParams.id;

    if (!mongoose.Types.ObjectId.isValid(documentId)) {
      return NextResponse.json({ success: false, message: "Invalid document ID" }, { status: 400 });
    }

    await connectToDatabase();

    // Verify ownership
    const document = await NyayaDocument.findOne({
      _id: documentId,
      userId: session.user.id,
    });

    if (!document) {
      return NextResponse.json({ success: false, message: "Document not found" }, { status: 404 });
    }

    // Delete associated analysis if any
    await Analysis.deleteOne({ documentId });

    // Delete the document
    await NyayaDocument.deleteOne({ _id: documentId });

    // Optional: We could also delete the file from Cloudinary here 
    // using cloudinary.uploader.destroy(document.publicId) to save space.

    return NextResponse.json({ success: true, message: "Document deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/documents/[id] error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
