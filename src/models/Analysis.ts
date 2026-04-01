import mongoose, { Document, Schema } from "mongoose";

interface IClause {
  title: string;
  content: string;
  importance: "low" | "medium" | "high" | "critical";
  category: string;
  indianLawRef?: string;
}

export interface IAnalysisDoc extends Document {
  documentId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  documentType: string;
  summary: string;
  summaryHindi?: string;
  keyObligations: string[];
  potentialRisks: string[];
  importantClauses: IClause[];
  recommendedActions: string[];
  legalIssues: string[];
  courtHierarchy?: string;
  cnrNumber?: string;
  overallRiskLevel: "low" | "medium" | "high";
  overallRiskScore?: number;
  keyFindings?: Record<string, unknown>[];
  sections?: Record<string, unknown>[];
  limitationPeriodConcern: boolean;
  fundamentalRightsConcern: boolean;
  processingTimeMs: number;
  createdAt: Date;
}

const ClauseSchema = new Schema<IClause>({
  title: String,
  content: String,
  importance: { type: String, enum: ["low", "medium", "high", "critical"] },
  category: String,
  indianLawRef: String,
});

const AnalysisSchema = new Schema<IAnalysisDoc>(
  {
    documentId: {
      type: Schema.Types.ObjectId,
      ref: "NyayaDocument",
      required: true,
      index: true,
    },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    documentType: { type: String },
    summary: { type: String, required: true },
    summaryHindi: { type: String },
    keyObligations: [String],
    potentialRisks: [String],
    importantClauses: [ClauseSchema],
    recommendedActions: [String],
    legalIssues: [String],
    courtHierarchy: String,
    cnrNumber: String,
    overallRiskLevel: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    overallRiskScore: { type: Number },
    keyFindings: { type: Schema.Types.Mixed },
    sections: { type: Schema.Types.Mixed },
    limitationPeriodConcern: { type: Boolean, default: false },
    fundamentalRightsConcern: { type: Boolean, default: false },
    processingTimeMs: { type: Number },
  },
  { timestamps: true, strict: false } // allow extra fields from Groq analysis
);

export default mongoose.models.Analysis ||
  mongoose.model<IAnalysisDoc>("Analysis", AnalysisSchema);
