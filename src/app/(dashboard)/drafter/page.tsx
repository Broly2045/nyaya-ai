"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PenTool, Copy, Download, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function LegalDrafterPage() {
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState("");
  
  const [form, setForm] = useState({
    documentType: "Bail Application",
    jurisdiction: "Hon'ble High Court of Delhi",
    partyDetails: "John Doe (Applicant) vs State (Respondent)",
    facts: ""
  });

  const generateDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.facts.trim()) {
      toast.error("Please provide case facts to generate a draft.");
      return;
    }

    setLoading(true);
    setDraft("");

    try {
      const response = await fetch("/api/drafter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("Failed to generate draft");
      }

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const dataStr = line.slice(6);
            if (dataStr === "[DONE]") break;

            try {
              const data = JSON.parse(dataStr);
              if (data.text) {
                setDraft((prev) => prev + data.text);
              }
            } catch (err) {}
          }
        }
      }
    } catch (err) {
      toast.error((err as Error)?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(draft);
    toast.success("Draft copied to clipboard!");
  };

  const downloadAsTxt = () => {
    const element = document.createElement("a");
    const file = new Blob([draft], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${form.documentType.replace(/\s+/g, '_')}_Draft.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#E87213]/20 to-[#E87213]/5 flex items-center justify-center border border-[#E87213]/30 shadow-[0_0_20px_rgba(232,114,19,0.1)]">
          <PenTool className="w-7 h-7 text-[#E87213]" />
        </div>
        <div>
          <h1 className="text-3xl font-bold font-serif text-[#F5EDD8] tracking-wide">AI Legal Drafter</h1>
          <p className="text-[#7A7E96] mt-1 text-sm">Enter case facts to auto-generate court-ready Indian legal documents.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 h-[calc(100vh-140px)] min-h-[800px]">
        {/* Left Panel - The Intake Form */}
        <div className="xl:col-span-4 h-full">
          <Card className="bg-[#0B162E]/60 backdrop-blur-xl border-[#152142] text-[#F5EDD8] h-full shadow-2xl flex flex-col overflow-hidden">
            <CardHeader className="border-b border-[#152142]/50 bg-[#0B162E]/40 pb-4">
              <CardTitle className="text-lg flex items-center font-serif tracking-wide text-[#F5EDD8]">
                <Sparkles className="w-4 h-4 mr-2 text-[#E87213]" />
                Case Intake
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              <form onSubmit={generateDraft} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[0.8rem] uppercase tracking-wider text-[#7A7E96] font-semibold">Document Type</label>
                  <Input 
                    value={form.documentType}
                    onChange={(e) => setForm({...form, documentType: e.target.value})}
                    placeholder="e.g. Bail Application, Writ Petition"
                    className="bg-[#060F24]/50 border-[#1C2D54] text-[#F5EDD8] h-11 focus:border-[#E87213]/50 focus:ring-1 focus:ring-[#E87213]/50 transition-all placeholder:text-[#4A4E69]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[0.8rem] uppercase tracking-wider text-[#7A7E96] font-semibold">Jurisdiction / Court</label>
                  <Input 
                    value={form.jurisdiction}
                    onChange={(e) => setForm({...form, jurisdiction: e.target.value})}
                    placeholder="e.g. Hon'ble High Court of Delhi"
                    className="bg-[#060F24]/50 border-[#1C2D54] text-[#F5EDD8] h-11 focus:border-[#E87213]/50 focus:ring-1 focus:ring-[#E87213]/50 transition-all placeholder:text-[#4A4E69]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[0.8rem] uppercase tracking-wider text-[#7A7E96] font-semibold">Parties Involved</label>
                  <textarea 
                    value={form.partyDetails}
                    onChange={(e) => setForm({...form, partyDetails: e.target.value})}
                    placeholder="Ramesh Kumar ... Petitioner &#10; VS &#10; State of Delhi ... Respondent"
                    className="w-full min-h-[100px] p-3 bg-[#060F24]/50 border border-[#1C2D54] rounded-md text-[#F5EDD8] placeholder:text-[#4A4E69] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#E87213]/50 focus-visible:border-[#E87213]/50 text-sm transition-all resize-none custom-scrollbar"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[0.8rem] uppercase tracking-wider text-[#7A7E96] font-semibold flex items-center justify-between">
                    <span>Core Case Facts</span>
                    <span className="text-xs text-[#E87213]/70 normal-case font-normal italic">Be highly detailed</span>
                  </label>
                  <textarea 
                    value={form.facts}
                    onChange={(e) => setForm({...form, facts: e.target.value})}
                    placeholder="Provide a chronological timeline of events, dates, charges levied, and explicitly state why the court should grant the relief requested..."
                    className="w-full min-h-[220px] h-full p-4 bg-[#060F24]/50 border border-[#1C2D54] rounded-md text-[#F5EDD8] placeholder:text-[#4A4E69] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#E87213]/50 focus-visible:border-[#E87213]/50 text-sm transition-all resize-y custom-scrollbar leading-relaxed"
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={loading || !form.facts.trim()} 
                  className="w-full h-12 bg-gradient-to-r from-[#E87213] to-[#D0610A] hover:from-[#F08020] hover:to-[#E87213] text-white font-semibold transition-all shadow-[0_0_15px_rgba(232,114,19,0.3)] hover:shadow-[0_0_25px_rgba(232,114,19,0.5)] border-none"
                >
                  {loading ? (
                     <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Drafting Document...</>
                  ) : (
                     <><PenTool className="w-4 h-4 mr-2" /> Generate Legal Draft</>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - The Canvas Container */}
        <div className="xl:col-span-8 h-full flex justify-center items-start overflow-y-auto custom-scrollbar px-2 pb-10">
          
          {/* Floating Workspace Controls */}
          <div className="fixed top-8 right-10 flex space-x-2 z-50">
             <Button variant="outline" size="sm" onClick={copyToClipboard} className="h-10 bg-[#0B162E]/80 backdrop-blur-md border-[#152142] text-[#F5EDD8] hover:bg-[#152142] hover:text-[#E87213] transition-colors rounded-full px-5 shadow-2xl">
               <Copy className="w-4 h-4 mr-2" /> Copy text
             </Button>
             <Button variant="outline" size="sm" onClick={downloadAsTxt} className="h-10 bg-[#0B162E]/80 backdrop-blur-md border-[#152142] text-[#F5EDD8] hover:bg-[#152142] hover:text-[#E87213] transition-colors rounded-full px-5 shadow-2xl">
               <Download className="w-4 h-4 mr-2" /> Download .txt
             </Button>
          </div>

          {/* The Actual "Paper" Canvas */}
          <div className="relative w-full max-w-[850px] min-h-[1056px] bg-[#FDFCF8] rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.5)] mt-4 p-12 sm:p-20 transition-all duration-500 overflow-hidden transform-gpu">
            
            {/* Legal paper margin lines (Indian standard style) */}
            <div className="absolute left-10 top-0 bottom-0 w-px bg-red-600/20 shadow-[1px_0_0_rgba(220,38,38,0.05)] pointer-events-none" />
            <div className="absolute left-12 top-0 bottom-0 w-px bg-red-600/20 shadow-[1px_0_0_rgba(220,38,38,0.05)] pointer-events-none" />
            
            {/* Empty State */}
            {!draft && !loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12 backdrop-blur-[1px]">
                 <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-6 shadow-inner">
                    <PenTool className="w-8 h-8 text-slate-300" />
                 </div>
                 <h3 className="text-2xl font-serif text-slate-700 mb-2">Blank Canvas</h3>
                 <p className="text-slate-400 max-w-sm leading-relaxed">
                   Fill out the case facts on the intake form and click &quot;Generate&quot;. NyayaAI will formulate a court-ready document right here.
                 </p>
              </div>
            )}

            {/* Generated Text Container */}
            {(draft || loading) && (
              <div className="font-serif text-[1rem] leading-[2] text-slate-900 whitespace-pre-wrap ml-6 relative z-10 selection:bg-orange-200">
                {draft}
                
                {/* Typing cursor/indicator */}
                {loading && (
                  <span className="inline-block w-2.5 h-4 ml-1 bg-[#E87213] animate-pulse rounded-sm align-middle" />
                )}
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}
