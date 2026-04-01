"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Minimal implementation for now - the guide did not provide a POST /api/register route
    // but typically we'd hit that here.
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (res.ok) {
        router.push("/login"); // redirect to login on success
      } else {
        const data = await res.json();
        setError(data.error ? `${data.message}: ${data.error}` : data.message || "Registration failed");
      }
    } catch (err) {
      setError("An error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#060F24]">
      <Card className="w-full max-w-md bg-[#0B162E] border-[#152142] text-[#F5EDD8]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-serif text-center text-[#E87213]">Create an account</CardTitle>
          <CardDescription className="text-center text-[#7A7E96]">
            Enter your details to create your NyayaAI account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-[#152142] border-[#2A3454] text-[#F5EDD8]"
              />
            </div>
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="advocate@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-[#152142] border-[#2A3454] text-[#F5EDD8]"
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-[#152142] border-[#2A3454] text-[#F5EDD8]"
              />
            </div>
            {error && <p className="text-sm text-red-500 text-center">{error}</p>}
            <Button type="submit" className="w-full bg-[#E87213] hover:bg-[#C8BDA4] text-[#060F24]" disabled={loading}>
              {loading ? "Creating account..." : "Sign Up"}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-[#7A7E96]">
            Already have an account?{" "}
            <Link href="/login" className="text-[#E87213] hover:underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
