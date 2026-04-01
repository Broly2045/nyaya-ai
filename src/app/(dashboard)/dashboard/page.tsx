import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import NyayaDocument from "@/models/Document";
import Analysis from "@/models/Analysis";
import User from "@/models/User";
import { FileText, ArrowRight, ShieldAlert, Sparkles, FolderOpen, Loader2, Plus, CreditCard } from "lucide-react";
import Link from "next/link";

import DeleteDocumentButton from "@/components/dashboard/DeleteDocumentButton";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default async function DashboardPage() {
  const session = await auth();
  await connectToDatabase();

  const [documentCount, analysisCount, user] = await Promise.all([
    NyayaDocument.countDocuments({ userId: session?.user?.id }),
    Analysis.countDocuments({ userId: session?.user?.id }),
    User.findById(session?.user?.id).select("subscription documentsUsed documentsLimit"),
  ]);

  const recentDocs = await NyayaDocument.find({ userId: session?.user?.id })
    .sort({ createdAt: -1 })
    .limit(4)
    .lean();

  const greeting = getGreeting();
  const firstName = session?.user?.name?.split(" ")[0] || "User";
  
  // Usage calculation
  const limit = user?.documentsLimit === Infinity ? 0 : (user?.documentsLimit ?? 3);
  const used = user?.documentsUsed ?? 0;
  const usagePercentage = limit > 0 ? Math.min((used / limit) * 100, 100) : 0;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#152142]">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl text-[#F5EDD8] tracking-tight">
            {greeting}, {firstName}
          </h1>
          <p className="text-[#7A7E96] mt-2 font-medium">Here&apos;s your legal workspace overview.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/pricing" className="px-4 py-2 rounded-lg bg-[#152142]/80 hover:bg-[#1C2D54] text-[#C8BDA4] font-medium text-sm transition-colors border border-[#1C2D54] flex items-center gap-2">
            <CreditCard className="w-4 h-4" /> Manage Plan
          </Link>
          <Link href="/documents" className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#E87213] to-[#D4820A] hover:opacity-90 text-white font-medium text-sm transition-all shadow-[0_0_15px_rgba(232,114,19,0.3)] hover:shadow-[0_0_20px_rgba(232,114,19,0.5)] flex items-center gap-2 border border-[#E87213]">
            <Plus className="w-4 h-4" /> New Analysis
          </Link>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard label="Total Documents" value={documentCount} icon={<FolderOpen className="w-5 h-5 text-[#C8BDA4]" />} />
        <StatCard label="Analyses Run" value={analysisCount} icon={<Sparkles className="w-5 h-5 text-[#C8BDA4]" />} />
        
        {/* Special Usage StatCard with Progress Bar */}
        <div className="relative overflow-hidden bg-[#0B162E]/80 backdrop-blur-md border border-[#152142] p-6 rounded-xl transition-all duration-300 hover:border-[#1C2D54] hover:shadow-lg hover:shadow-[#E87213]/5 group">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-[#E87213]/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex justify-between items-start mb-4">
            <p className="text-xs text-[#7A7E96] tracking-widest uppercase font-mono z-10">Usage This Month</p>
            <div className="p-2 bg-[#152142]/50 rounded-lg z-10">
              <Loader2 className="w-5 h-5 text-[#C8BDA4]" />
            </div>
          </div>
          <div className="z-10 relative">
            <p className="font-serif text-3xl md:text-4xl text-[#F5EDD8] group-hover:text-white transition-colors">
              {used} <span className="text-xl text-[#7A7E96] font-sans">/ {limit === 0 ? "∞" : limit}</span>
            </p>
            {limit > 0 && (
              <div className="mt-4 w-full bg-[#152142] h-1.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${usagePercentage > 80 ? 'bg-[#D94F4F]' : 'bg-[#E87213]'}`}
                  style={{ width: `${usagePercentage}%` }}
                />
              </div>
            )}
          </div>
        </div>

        <StatCard 
          label="Current Plan" 
          value={user?.subscription === "free" ? "Muft" : user?.subscription === "pro" ? "Advocate Pro" : "Chamber"} 
          icon={<ShieldAlert className="w-5 h-5 text-[#C8BDA4]" />}
        />
      </div>

      {/* Recent documents */}
      <div className="pt-4">
        <div className="flex justify-between items-center mb-6 border-b border-[#152142] pb-2">
          <h2 className="font-serif text-xl text-[#F5EDD8] flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#E87213]" /> Recent Documents
          </h2>
          <Link href="/documents" className="text-xs font-semibold text-[#E87213] uppercase tracking-wider hover:text-white transition-colors flex items-center gap-1 group">
            View All Vault <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {recentDocs.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center bg-[#0B162E]/50 border border-dashed border-[#152142] rounded-xl relative overflow-hidden group hover:border-[#E87213]/40 transition-colors">
            <div className="absolute inset-0 bg-gradient-to-b from-[#E87213]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <FolderOpen className="w-12 h-12 text-[#152142] mb-4 group-hover:text-[#E87213]/50 transition-colors" />
            <h3 className="text-lg font-serif text-[#F5EDD8] mb-2 relative z-10">No documents yet</h3>
            <p className="text-[#7A7E96] text-sm mb-6 max-w-sm relative z-10">Securely upload and analyze your first legal document to uncover risks and extractions automatically.</p>
            <Link href="/documents" className="relative z-10 bg-[#E87213] text-white px-6 py-2 rounded font-medium hover:bg-[#D4820A] transition-colors shadow-lg shadow-[#E87213]/20 flex items-center gap-2">
              <Plus className="w-4 h-4" /> Upload Document
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {recentDocs.map((doc: { _id: { toString: () => string }; status: string; title?: string; fileName?: string; createdAt: string | number | Date }) => (
              <Link href={`/documents/${doc._id}`} key={doc._id.toString()}>
                <div className="group bg-[#0B162E]/80 backdrop-blur-sm border border-[#152142] p-5 rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-[#E87213]/5 hover:border-[#1C2D54] hover:-translate-y-1 relative overflow-hidden h-full flex flex-col">
                  
                  {/* Subtle top gradient line */}
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#E87213]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-[#152142]/50 rounded-lg group-hover:bg-[#E87213]/10 transition-colors">
                      <FileText className="w-5 h-5 text-[#C8BDA4] group-hover:text-[#E87213] transition-colors" />
                    </div>
                    <div className="flex items-center gap-2 z-10">
                      <span className={`text-[0.65rem] px-2 py-1 rounded font-mono uppercase tracking-wider border ${
                        doc.status === "completed" || doc.status === "analyzed"
                          ? "bg-[#00B896]/10 text-[#00B896] border-[#00B896]/20"
                          : "bg-[#E87213]/10 text-[#E87213] border-[#E87213]/20"
                      }`}>
                        {doc.status}
                      </span>
                    </div>
                  </div>
                  
                  <h4 className="font-serif text-lg text-[#F5EDD8] mb-3 leading-snug line-clamp-2 flex-1 group-hover:text-white transition-colors">
                    {doc.title || doc.fileName || "Untitled Document"}
                  </h4>
                  
                  <div className="flex justify-between items-center text-[#7A7E96] text-xs font-mono mt-auto pt-3 border-t border-[#152142]/50">
                    <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                    <DeleteDocumentButton documentId={doc._id.toString()} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden bg-[#0B162E]/80 backdrop-blur-md border border-[#152142] p-6 rounded-xl transition-all duration-300 hover:border-[#1C2D54] hover:shadow-lg hover:shadow-[#E87213]/5 group">
      {/* Background glow effect on hover */}
      <div className="absolute -right-8 -top-8 w-32 h-32 bg-[#E87213]/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="flex justify-between items-start mb-4">
        <p className="text-xs text-[#7A7E96] tracking-widest uppercase font-mono z-10">{label}</p>
        <div className="p-2 bg-[#152142]/50 rounded-lg z-10">
          {icon}
        </div>
      </div>
      <p className="font-serif text-3xl md:text-4xl text-[#F5EDD8] group-hover:text-white transition-colors z-10 relative">
        {value}
      </p>
    </div>
  );
}
