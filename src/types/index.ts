export type Subscription = "free" | "pro" | "chamber";
export type DocumentStatus = "uploaded" | "extracting" | "analyzing" | "analyzed" | "failed";
export type RiskLevel = "low" | "medium" | "high";
export type ClauseImportance = "low" | "medium" | "high" | "critical";
export type Language = "en" | "hi";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  image?: string;
  role: "user" | "admin";
  subscription: Subscription;
  documentsUsed: number;
  documentsLimit: number;
  preferredLanguage: Language;
  barCouncilId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IDocument {
  _id: string;
  userId: string;
  title: string;
  originalName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  detectedType?: string;
  cnrNumber?: string;
  courtHierarchy?: string;
  status: DocumentStatus;
  analysisId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IClause {
  title: string;
  content: string;
  importance: ClauseImportance;
  category: string;
  indianLawRef?: string;
}

export interface IAnalysis {
  _id: string;
  documentId: string;
  userId: string;
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
  overallRiskLevel: RiskLevel;
  limitationPeriodConcern: boolean;
  fundamentalRightsConcern: boolean;
  processingTimeMs: number;
  createdAt: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  success: boolean;
  message: string;
  error?: string;
}
