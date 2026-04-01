import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import NyayaDocument from "@/models/Document";
import Analysis from "@/models/Analysis";
import { redirect } from "next/navigation";
import { ArrowLeft, FileText, CheckCircle, AlertTriangle, XCircle, ShieldCheck } from "lucide-react";
import Link from "next/link";
import mongoose from "mongoose";
import AnalysisRunner from "@/components/dashboard/AnalysisRunner";
import DocumentChat from "@/components/dashboard/DocumentChat";

export default async function DocumentAnalysisPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const resolvedParams = await params;
  const docId = resolvedParams.id;
  if (!mongoose.Types.ObjectId.isValid(docId)) {
    redirect("/dashboard");
  }

  await connectToDatabase();

  const doc = await NyayaDocument.findById(docId).lean();
  if (!doc) redirect("/dashboard");

  const analysis = await Analysis.findOne({ documentId: docId }).lean();

  return (
    <div className="max-w-7xl mx-auto flex flex-col min-h-[calc(100vh-2rem)] pb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Link href="/documents" className="p-2 rounded-full hover:bg-[#152142] text-[#7A7E96] hover:text-[#F5EDD8] transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-serif text-2xl md:text-3xl text-[#F5EDD8] m-0 flex items-center gap-3">
              <FileText className="w-6 h-6 text-[#C8BDA4]" />
              {doc.fileName || "Uploaded Document"}
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <ShieldCheck className="w-4 h-4 text-[#00B896]" />
              <p className="text-[#7A7E96] text-xs font-mono uppercase tracking-widest m-0">
                Analyzed with Llama 3.3
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-px bg-[#152142] border border-[#152142] rounded-xl overflow-hidden shadow-2xl flex-1">
        
        {/* Top Panel: Analysis View */}
        <div className="bg-[#060F24] p-6 lg:p-10 flex-1">
          {!analysis ? (
            <div className="h-full flex items-center justify-center">
              <AnalysisRunner documentId={docId} fileName={doc.fileName || "Document"} />
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              {/* Report Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 border-b border-[#152142] pb-6 gap-6">
                <div>
                  <h2 className="font-serif text-2xl text-[#F5EDD8] mb-3">Legal Analysis Report</h2>
                  <div className="flex gap-2">
                    <span className="text-[0.65rem] px-2.5 py-1 rounded bg-[#00B896]/10 text-[#00B896] border border-[#00B896]/30 font-mono uppercase tracking-wider shadow-[0_0_10px_rgba(0,184,150,0.1)]">High Priority</span>
                    <span className="text-[0.65rem] px-2.5 py-1 rounded bg-[#D4820A]/10 text-[#D4820A] border border-[#D4820A]/30 font-mono uppercase tracking-wider shadow-[0_0_10px_rgba(212,130,10,0.1)]">Requires Review</span>
                  </div>
                </div>
                
                <div className="text-right bg-[#0B162E] p-4 rounded-xl border border-[#152142]">
                  <div className={`text-4xl md:text-5xl font-serif leading-none mb-1 ${analysis.overallRiskScore > 70 ? "text-[#D94F4F]" : analysis.overallRiskScore > 40 ? "text-[#D4820A]" : "text-[#00B896]"}`}>
                    {analysis.overallRiskScore || 0}
                  </div>
                  <div className="text-[0.65rem] text-[#7A7E96] font-mono uppercase tracking-widest">Risk Score</div>
                </div>
              </div>

              {/* Key Findings */}
              <h3 className="text-xs text-[#7A7E96] font-mono uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-4 h-[1px] bg-[#E87213]"></span> Key Findings
              </h3>
              
              <div className="flex flex-col gap-4 mb-10">
                {(analysis.keyFindings || []).map((finding: { severity: string; text: string }, idx: number) => (
                  <div key={idx} className={`flex gap-4 items-start bg-[#0B162E]/60 backdrop-blur-sm p-5 md:p-6 rounded-lg border-l-4 transition-transform hover:-translate-y-0.5 ${
                    finding.severity === "high" ? "border-l-[#D94F4F] shadow-sm shadow-[#D94F4F]/5" : 
                    finding.severity === "medium" ? "border-l-[#D4820A] shadow-sm shadow-[#D4820A]/5" : 
                    "border-l-[#00B896] shadow-sm shadow-[#00B896]/5"
                  }`}>
                    <div className="mt-0.5 flex-shrink-0">
                      {finding.severity === "high" ? <XCircle className="w-5 h-5 text-[#D94F4F]" /> : 
                       finding.severity === "medium" ? <AlertTriangle className="w-5 h-5 text-[#D4820A]" /> : 
                       <CheckCircle className="w-5 h-5 text-[#00B896]" />}
                    </div>
                    <div>
                      <div className="text-[0.65rem] uppercase font-mono text-[#7A7E96] mb-1.5 tracking-wider font-semibold">
                        <span className={finding.severity === "high" ? "text-[#D94F4F]/80" : finding.severity === "medium" ? "text-[#D4820A]/80" : "text-[#00B896]/80"}>
                          {finding.severity}
                        </span> SEVERITY
                      </div>
                      <p className="text-[0.95rem] text-[#F5EDD8] leading-relaxed m-0 opacity-90">
                        {finding.text}
                      </p>
                    </div>
                  </div>
                ))}
                {!(analysis.keyFindings?.length) && (
                  <div className="text-center p-8 bg-[#0B162E]/30 rounded-lg border border-dashed border-[#152142]">
                    <p className="text-[#7A7E96] text-sm font-medium">No specific findings extracted.</p>
                  </div>
                )}
              </div>

              {/* Clause Extractions */}
              <h3 className="text-xs text-[#7A7E96] font-mono uppercase tracking-widest mb-6 flex items-center gap-2">
                <span className="w-4 h-[1px] bg-[#E87213]"></span> Clause Extractions
              </h3>
              
              <div className="space-y-6">
                {(analysis.sections || []).map((sec: { sectionId?: string; title?: string; text?: string; content?: string }, idx: number) => (
                  <div key={idx} className="pl-5 border-l-2 border-[#1C2D54] hover:border-[#E87213] transition-colors relative">
                    <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-[#1C2D54]"></div>
                    <h4 className="font-serif text-[1.1rem] text-[#C8BDA4] mb-2">{sec.sectionId || sec.title || "Section"}</h4>
                    <p className="text-[0.9rem] text-[#7A7E96] leading-relaxed m-0 italic">&quot;{sec.text || sec.content}&quot;</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Panel: AI Chat Window */}
        <div className="h-[500px] border-t-2 border-[#1C2D54] bg-[#0B162E]">
          {!analysis ? (
             <div className="flex flex-col h-full items-center justify-center text-[#7A7E96] text-sm animate-pulse">
               Waiting for analysis to complete...
             </div>
          ) : (
             <DocumentChat documentId={docId} />
          )}
        </div>
      </div>
    </div>
  );
}
