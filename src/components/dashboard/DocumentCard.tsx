import Link from "next/link";
import { FileText, AlertTriangle, CheckCircle, Clock } from "lucide-react";

interface DocumentCardProps {
  _id: string;
  title: string;
  detectedType?: string;
  status: string;
  createdAt: string;
}

export default function DocumentCard({ doc }: { doc: DocumentCardProps }) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "analyzed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "failed":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500 animate-pulse" />;
    }
  };

  return (
    <Link
      href={`/documents/${doc._id}`}
      className="block bg-[#0B162E] border border-[#152142] rounded-lg p-5 hover:border-[#E87213] transition-colors"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-[#152142] rounded-md">
            <FileText className="w-5 h-5 text-[#C8BDA4]" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-[#F5EDD8]">{doc.title}</h3>
            <p className="text-xs text-[#7A7E96] mt-1">
              {doc.detectedType || "Unknown Type"}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end space-y-2">
          {getStatusIcon(doc.status)}
          <span className="text-[10px] text-[#7A7E96] uppercase tracking-wider">
            {new Date(doc.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </Link>
  );
}
