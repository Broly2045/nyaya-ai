import mongoose, { Document, Schema } from "mongoose";

export interface IDocumentDoc extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  originalName: string;
  fileUrl: string;
  publicId: string;
  fileType: "pdf" | "docx" | "txt" | "doc";
  fileSize: number;
  textContent?: string;
  detectedType?: string; // FIR, BailApplication, Contract, etc.
  cnrNumber?: string;
  courtHierarchy?: string;
  status: "uploaded" | "extracting" | "analyzing" | "analyzed" | "failed";
  analysisId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const DETECTED_TYPES = [
  "FIR",
  "BailApplication",
  "LegalNotice",
  "WritPetition",
  "PIL",
  "Contract",
  "Vakalatnama",
  "Affidavit",
  "RentAgreement",
  "ChargeSheet",
  "Judgment",
  "Other",
];

const DocumentSchema = new Schema<IDocumentDoc>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    originalName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    publicId: { type: String, required: true },
    fileType: { type: String, enum: ["pdf", "docx", "txt", "doc"] },
    fileSize: { type: Number },
    textContent: { type: String, select: false }, // Don't return by default
    detectedType: { type: String, enum: DETECTED_TYPES },
    cnrNumber: { type: String },
    courtHierarchy: { type: String },
    status: {
      type: String,
      enum: ["uploaded", "extracting", "analyzing", "analyzed", "failed"],
      default: "uploaded",
    },
    analysisId: { type: Schema.Types.ObjectId, ref: "Analysis" },
  },
  { timestamps: true }
);

DocumentSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.NyayaDocument ||
  mongoose.model<IDocumentDoc>("NyayaDocument", DocumentSchema);
