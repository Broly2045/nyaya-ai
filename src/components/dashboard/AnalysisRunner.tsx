"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, FileSearch, AlertCircle } from "lucide-react";

export default function AnalysisRunner({ documentId, fileName: _fileName }: { documentId: string, fileName: string }) {
  const [status, setStatus] = useState("Initializing Llama 3.3 Engine...");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    const runAnalysis = async () => {
      try {
        setStatus("Extracting clauses and entities...");
        
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ documentId }),
        });

        const data = await res.json();
        
        if (!isMounted) return;

        if (!res.ok) {
          throw new Error(data.message || "Failed to analyze document.");
        }

        setStatus("Analysis Complete! Loading Dashboard...");
        
        // Slight delay for UX
        setTimeout(() => {
          if (isMounted) router.refresh();
        }, 1000);

      } catch (err) {
        if (isMounted) setError((err as Error).message);
      }
    };

    // Delay start slightly so the user sees the page mount
    const timer = setTimeout(runAnalysis, 1500);

    // Sequence fake statuses for a realistic "AI thinking" feel
    const seq1 = setTimeout(() => setStatus("Identifying liabilities and risks..."), 3500);
    const seq2 = setTimeout(() => setStatus("Correlating sections with BNS, BNSS, and CPC..."), 6000);
    const seq3 = setTimeout(() => setStatus("Generating final summary..."), 9000);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      clearTimeout(seq1);
      clearTimeout(seq2);
      clearTimeout(seq3);
    };
  }, [documentId, router]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-center animate-in fade-in duration-500">
        <div className="w-16 h-16 bg-[#D94F4F]/10 rounded-full flex items-center justify-center mb-6 border border-[#D94F4F]/30">
          <AlertCircle className="w-8 h-8 text-[#D94F4F]" />
        </div>
        <h2 className="text-2xl font-serif text-[#D94F4F] mb-3">Analysis Failed</h2>
        <p className="text-[#7A7E96] text-sm max-w-md mb-8">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-6 py-2.5 bg-transparent border border-[#E87213] text-[#E87213] rounded-lg hover:bg-[#E87213]/10 transition-colors font-medium"
        >
          Retry Analysis
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full p-16 animate-in fade-in duration-700">
      <div className="relative mb-10 w-24 h-24 flex items-center justify-center">
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-[#E87213]/20 blur-xl animate-pulse" />
        {/* Spinning border ring */}
        <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-[#E87213] animate-spin opacity-80" />
        <div className="absolute inset-1 rounded-full border-b-2 border-l-2 border-[#00B896] animate-[spin_2s_linear_infinite_reverse] opacity-50" />
        
        <FileSearch className="w-8 h-8 text-[#C8BDA4] relative z-10 animate-pulse" />
      </div>
      
      <h2 className="font-serif text-2xl md:text-3xl text-[#F5EDD8] mb-4">
        Processing AI Analysis
      </h2>
      
      <div className="flex items-center gap-3 bg-[#152142]/50 px-6 py-2 rounded-full border border-[#1C2D54]">
        <Loader2 className="w-4 h-4 text-[#E87213] animate-spin" />
        <p className="text-[#00B896] text-xs font-mono uppercase tracking-widest m-0">
          {status}
        </p>
      </div>
    </div>
  );
}
