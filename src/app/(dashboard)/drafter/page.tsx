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
    } catch (err: any) {
      toast.error(err.message || "Something went wrong.");
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
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-[#E87213]/10 flex items-center justify-center border border-[#E87213]/30">
          <PenTool className="w-6 h-6 text-[#E87213]" />
        </div>
        <div>
          <h1 className="text-3xl font-bold font-serif text-[#F5EDD8]">AI Legal Drafter</h1>
          <p className="text-[#7A7E96]">Enter case facts to generate beautifully structured Indian legal documents.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Panel */}
        <div className="lg:col-span-5 h-full">
          <Card className="bg-[#0B162E]/50 border-[#152142] text-[#F5EDD8] h-full shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Sparkles className="w-4 h-4 mr-2 text-[#E87213]" />
                Case Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={generateDraft} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm text-[#7A7E96] font-medium">Document Type</label>
                  <Input 
                    value={form.documentType}
                    onChange={(e) => setForm({...form, documentType: e.target.value})}
                    placeholder="e.g. Bail Application, Writ Petition, Legal Notice"
                    className="bg-[#152142]/50 border-[#2A3454] text-[#F5EDD8]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm text-[#7A7E96] font-medium">Jurisdiction / Court Name</label>
                  <Input 
                    value={form.jurisdiction}
                    onChange={(e) => setForm({...form, jurisdiction: e.target.value})}
                    placeholder="e.g. In The Hon'ble High Court of Delhi"
                    className="bg-[#152142]/50 border-[#2A3454] text-[#F5EDD8]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm text-[#7A7E96] font-medium">Parties Involved</label>
                  <textarea 
                    value={form.partyDetails}
                    onChange={(e) => setForm({...form, partyDetails: e.target.value})}
                    placeholder="Ramesh Kumar ... Petitioner \n VS \n State of Delhi ... Respondent"
                    className="w-full h-24 p-3 bg-[#152142]/50 border border-[#2A3454] rounded-md text-[#F5EDD8] placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#E87213]/50 text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm text-[#7A7E96] font-medium">Core Case Facts</label>
                  <textarea 
                    value={form.facts}
                    onChange={(e) => setForm({...form, facts: e.target.value})}
                    placeholder="Provide a detailed timeline of events, dates, charges, and why the relief should be granted..."
                    className="w-full h-48 p-3 bg-[#152142]/50 border border-[#2A3454] rounded-md text-[#F5EDD8] placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#E87213]/50 text-sm"
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={loading || !form.facts.trim()} 
                  className="w-full bg-[#E87213] hover:bg-[#C8BDA4] text-[#060F24] font-semibold"
                >
                  {loading ? (
                     <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Drafting...</>
                  ) : (
                     <><PenTool className="w-4 h-4 mr-2" /> Generate Legal Draft</>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Output Panel */}
        <div className="lg:col-span-7 h-full flex flex-col">
          <Card className="bg-[#white] border-[#152142] text-[#060F24] flex-1 min-h-[600px] shadow-2xl relative overflow-hidden flex flex-col">
            <div className="bg-[#f0ece1] border-b border-[#ddd] p-3 flex justify-between items-center z-10">
              <span className="text-sm font-semibold uppercase tracking-wider text-[#555] font-sans">
                Draft Preview
              </span>
              <div className="space-x-2">
                 <Button variant="outline" size="sm" onClick={copyToClipboard} className="h-8 bg-white border-[#ccc] text-[#333] hover:bg-[#eae8df]">
                   <Copy className="w-3.5 h-3.5 mr-1" /> Copy
                 </Button>
                 <Button variant="outline" size="sm" onClick={downloadAsTxt} className="h-8 bg-white border-[#ccc] text-[#333] hover:bg-[#eae8df]">
                   <Download className="w-3.5 h-3.5 mr-1" /> Download .txt
                 </Button>
              </div>
            </div>
            
            <div className="flex-1 overflow-auto p-8 relative">
               {!draft && !loading ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                     <div className="w-16 h-16 rounded-full bg-[#f0ece1] flex items-center justify-center mb-4">
                        <PenTool className="w-8 h-8 text-[#aaa]" />
                     </div>
                     <p className="text-[#888] max-w-sm">
                       Fill out the case facts on the left and click "Generate" to see the AI formulate a court-ready document in seconds.
                     </p>
                  </div>
               ) : (
                  <div 
                    className="font-serif text-[0.95rem] leading-[1.8] text-[#111] max-w-[800px] mx-auto whitespace-pre-wrap pb-16"
                  >
                    {draft}
                  </div>
               )}
            </div>
            
            {/* Elegant legal paper edge styling */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-red-200 pointer-events-none" />
            <div className="absolute left-8 top-0 bottom-0 w-px bg-red-200 pointer-events-none" />
          </Card>
        </div>
      </div>
    </div>
  );
}
