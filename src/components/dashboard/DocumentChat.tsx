"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Sparkles } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function DocumentChat({ documentId }: { documentId: string }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Namaste! I've fully analyzed this document. Ask me any questions about liabilities, risks, or specific clauses in English or Hindi!"
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const sendMessage = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setInput("");
    
    const newMessages: Message[] = [...messages, { role: "user", content: userMsg }];
    setMessages(newMessages);
    setIsTyping(true);

    // Add empty assistant message for streaming
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId,
          messages: newMessages.slice(1), 
        }),
      });

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let assistantResponse = "";

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");
          
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const dataStr = line.replace("data: ", "").trim();
              if (dataStr === "[DONE]") {
                done = true;
                break;
              }
              try {
                const parsed = JSON.parse(dataStr);
                if (parsed.text) {
                  assistantResponse += parsed.text;
                  setMessages((prev) => {
                    const updated = [...prev];
                    updated[updated.length - 1].content = assistantResponse;
                    return updated;
                  });
                }
              } catch (e) {
                console.error("Error parsing SSE JSON", e);
              }
            }
          }
        }
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].content = "⚠️ Sorry, there was an error processing your request. Please try again.";
        return updated;
      });
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0B162E] w-full">
      {/* Header */}
      <div className="px-5 py-3 border-b border-[#152142] flex items-center justify-between bg-[#060F24]/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00B896] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00B896]"></span>
          </div>
          <span className="text-xs text-[#C8BDA4] font-mono uppercase tracking-widest font-semibold flex items-center gap-2">
            Nyaya LPU Engine
            {isTyping && <Sparkles className="w-3 h-3 text-[#E87213] animate-pulse" />}
          </span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-5 md:p-6 overflow-y-auto flex flex-col gap-6 scroll-smooth scrollbar-thin scrollbar-thumb-[#152142] scrollbar-track-transparent">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 md:gap-4 w-full ${msg.role === "user" ? "flex-row-reverse" : "flex-row"} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            {/* Avatar */}
            {msg.role === "assistant" ? (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00B896]/20 to-[#00B896]/5 border border-[#00B896]/30 flex items-center justify-center flex-shrink-0 shadow-[0_0_10px_rgba(0,184,150,0.15)]">
                <Sparkles className="w-4 h-4 text-[#00B896]" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E87213]/20 to-[#E87213]/5 border border-[#E87213]/30 flex items-center justify-center flex-shrink-0 font-mono text-[0.6rem] font-bold text-[#E87213]">
                USR
              </div>
            )}
            
            {/* Bubble */}
            <div className={`
              max-w-[85%] md:max-w-[75%] p-4 text-[0.9rem] leading-relaxed whitespace-pre-wrap shadow-sm
              ${msg.role === "user" 
                ? "bg-gradient-to-br from-[#E87213]/15 to-[#E87213]/5 border border-[#E87213]/20 rounded-2xl rounded-tr-sm text-[#F5EDD8]" 
                : "bg-[#060F24]/80 border border-[#152142] rounded-2xl rounded-tl-sm text-[#C8BDA4]"}
            `}>
              {msg.content || (isTyping && idx === messages.length - 1 ? (
                <div className="flex gap-1 items-center h-4">
                  <span className="w-1.5 h-1.5 bg-[#7A7E96] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-[#7A7E96] rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-[#7A7E96] rounded-full animate-bounce"></span>
                </div>
              ) : "")}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} className="h-2" />
      </div>

      {/* Input Area */}
      <div className="p-4 md:p-5 border-t border-[#152142] bg-[#060F24]/80 backdrop-blur-md">
        <form 
          onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
          className="flex bg-[#0B162E] border border-[#1C2D54] p-1.5 rounded-xl transition-all focus-within:border-[#E87213]/50 focus-within:ring-1 focus-within:ring-[#E87213]/50 shadow-inner"
        >
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about clauses, liabilities, or implications..." 
            className="flex-1 bg-transparent border-none text-[#F5EDD8] placeholder-[#7A7E96] px-4 py-2 outline-none text-[0.9rem] ring-0 focus:ring-0 w-full"
            disabled={isTyping}
          />
          <button 
            type="submit"
            disabled={isTyping || !input.trim()}
            className={`
              w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-300 flex-shrink-0
              ${isTyping || !input.trim() 
                ? "bg-[#152142] text-[#7A7E96] cursor-not-allowed opacity-50" 
                : "bg-gradient-to-br from-[#E87213] to-[#D4820A] shadow-[0_0_15px_rgba(232,114,19,0.3)] hover:shadow-[0_0_20px_rgba(232,114,19,0.5)] text-white hover:scale-105 active:scale-95"}
            `}
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </form>
        <div className="text-[0.65rem] text-[#7A7E96] text-center mt-3 font-medium flex items-center justify-center gap-1">
          <Sparkles className="w-2.5 h-2.5 opacity-70" /> AI can make mistakes. Verify important legal arguments.
        </div>
      </div>
    </div>
  );
}
