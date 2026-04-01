"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function PricingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (plan: "pro" | "chamber") => {
    setLoading(plan);
    try {
      const res = await fetch("/api/payments/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      if (res.ok) {
        toast.success(`Successfully upgraded to ${plan.toUpperCase()}!`);
        router.push("/dashboard");
        router.refresh();
      } else {
        const data = await res.json();
        toast.error(data.message || "Upgrade failed");
      }
    } catch (err) {
      toast.error("An error occurred while upgrading.");
    } finally {
      setLoading(null);
    }
  };

  const plans = [
    {
      id: "pro",
      name: "Advocate Pro",
      price: "₹799/mo",
      description: "For individual advocates doing regular case analysis.",
      features: [
        "Unlimited Document Analysis",
        "Fastest Groq API Response Times",
        "Full AI Chat & Search",
        "Save Case Context"
      ],
      color: "border-[#E87213]"
    },
    {
      id: "chamber",
      name: "Chamber Team",
      price: "₹2499/mo",
      description: "For small law firms and chambers of up to 10 advocates.",
      features: [
        "Include 10 Advocate Seats",
        "Unlimited Everything",
        "Priority Support",
        "Centralized Billing"
      ],
      color: "border-[#152142]"
    }
  ];

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-serif text-[#F5EDD8] mb-4">Upgrade Your NyayaAI Experience</h1>
        <p className="text-[#7A7E96] max-w-2xl mx-auto">
          Get unlimited document analysis and full AI insights. 
          (This is a demonstration environment — upgrades simulate instantly without payment).
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {plans.map((p) => (
          <Card key={p.id} className={`bg-[#0B162E] text-[#F5EDD8] ${p.color} border-2 hover:border-[#E87213] transition-colors`}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center text-xl">
                {p.name}
                {p.id === "pro" && <Sparkles className="w-5 h-5 text-[#E87213]" />}
              </CardTitle>
              <CardDescription className="text-[#C8BDA4]">{p.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-6 text-[#F5EDD8]">{p.price}</div>
              <ul className="space-y-3">
                {p.features.map((f, i) => (
                  <li key={i} className="flex items-center space-x-3 text-sm text-[#7A7E96]">
                    <Check className="w-4 h-4 text-green-500 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => handleSubscribe(p.id as "pro" | "chamber")}
                disabled={loading !== null}
                className="w-full bg-[#152142] hover:bg-[#E87213] text-[#F5EDD8] transition-colors"
              >
                {loading === p.id ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Upgrading...</>
                ) : (
                    "Simulate Upgrade"
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
