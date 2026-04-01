import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import NyayaDocument from "@/models/Document";
import User from "@/models/User";
import { FileText, Search, Clock, ShieldAlert, FolderOpen } from "lucide-react";
import Link from "next/link";
import mongoose from "mongoose";
import DocumentUploadDropzone from "@/components/dashboard/DocumentUploadDropzone";
import DeleteDocumentButton from "@/components/dashboard/DeleteDocumentButton";

export default async function DocumentsPage() {
  const session = await auth();
  await connectToDatabase();

  const userId = session?.user?.id;
  const query = mongoose.Types.ObjectId.isValid(userId as string) 
    ? { _id: userId } 
    : { email: session?.user?.email };

  const dbUser = await User.findOne(query).select("documentsUsed documentsLimit");
  
  const realUserId = dbUser?._id.toString();
  const documents = await NyayaDocument.find({ userId: realUserId }).sort({ createdAt: -1 }).lean();

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl text-[#F5EDD8] tracking-tight mb-2">
            My Documents
          </h1>
          <p className="text-[#7A7E96] font-medium text-sm">
            Upload, analyze, and manage your legal documents.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 bg-[#0B162E] border border-[#152142] px-4 py-2 rounded-full text-sm">
          <span className="text-[#7A7E96]">Monthly Usage:</span>
          <span className="font-semibold px-2 py-0.5 rounded bg-[#E87213]/10 text-[#E87213] border border-[#E87213]/20">
            {dbUser?.documentsUsed || 0} / {dbUser?.documentsLimit === Infinity ? "∞" : dbUser?.documentsLimit || 3}
          </span>
        </div>
      </div>

      {/* Upload Dropzone */}
      <div className="mb-8 relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-[#E87213]/20 via-[#00B896]/20 to-[#E87213]/20 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
        <DocumentUploadDropzone />
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 flex items-center bg-[#0B162E]/80 backdrop-blur-md border border-[#152142] rounded-lg px-4 focus-within:border-[#E87213]/50 focus-within:ring-1 focus-within:ring-[#E87213]/50 transition-all">
          <Search className="w-5 h-5 text-[#7A7E96]" />
          <input
            type="text"
            placeholder="Search filenames, case numbers, or clauses..."
            className="w-full bg-transparent border-none text-[#F5EDD8] placeholder-[#7A7E96] focus:ring-0 p-3 text-sm outline-none"
          />
        </div>
      </div>

      {/* Document Grid */}
      {documents.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 text-center bg-[#0B162E]/50 border border-dashed border-[#152142] rounded-xl">
          <FolderOpen className="w-16 h-16 text-[#152142] mb-4" />
          <h3 className="text-xl font-serif text-[#F5EDD8] mb-2">Your Vault is Empty</h3>
          <p className="text-[#7A7E96] text-sm max-w-sm">
            You haven&apos;t uploaded any documents yet. Drop a PDF or DOCX file above to begin your structural analysis.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pb-8">
          {documents.map((doc: { _id: { toString: () => string }; status: string; title?: string; fileName?: string; createdAt: string | number | Date }) => (
            <Link href={`/documents/${doc._id}`} key={doc._id.toString()}>
              <div className="group bg-[#0B162E]/80 backdrop-blur-sm border border-[#152142] p-5 rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-[#E87213]/5 hover:border-[#1C2D54] hover:-translate-y-1 relative overflow-hidden h-full flex flex-col">
                
                {/* Subtle top gradient line */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#E87213]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="flex justify-between items-start mb-4">
                  <div className="p-2.5 bg-[#152142]/50 rounded-lg group-hover:bg-[#E87213]/10 transition-colors">
                    <FileText className="w-6 h-6 text-[#C8BDA4] group-hover:text-[#E87213] transition-colors" />
                  </div>
                  <div className="flex items-center gap-2 z-10">
                    <span className={`text-[0.65rem] px-2 py-1 rounded font-mono uppercase tracking-wider border ${
                      doc.status === "completed" || doc.status === "analyzed"
                        ? "bg-[#00B896]/10 text-[#00B896] border-[#00B896]/20"
                        : "bg-[#E87213]/10 text-[#E87213] border-[#E87213]/20"
                    }`}>
                      {doc.status}
                    </span>
                    <DeleteDocumentButton documentId={doc._id.toString()} />
                  </div>
                </div>
                
                <h3 className="font-serif text-lg text-[#F5EDD8] mb-3 leading-snug line-clamp-2 pb-1 flex-1 group-hover:text-white transition-colors">
                  {doc.title || doc.fileName || "Untitled Document"}
                </h3>
                
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[#7A7E96] text-[0.7rem] font-mono mt-auto pt-4 border-t border-[#152142]/50">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(doc.createdAt).toLocaleDateString()}
                  </span>
                  {(doc.status === "completed" || doc.status === "analyzed") && (
                     <span className="flex items-center gap-1.5 text-[#D4820A] bg-[#D4820A]/10 px-2 py-0.5 rounded">
                       <ShieldAlert className="w-3.5 h-3.5" />
                       Analysis Ready
                     </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
