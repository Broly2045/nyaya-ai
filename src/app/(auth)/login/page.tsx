"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#060F24]">
      <Card className="w-full max-w-md bg-[#0B162E] border-[#152142] text-[#F5EDD8]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-serif text-center text-[#E87213]">NyayaAI</CardTitle>
          <CardDescription className="text-center text-[#7A7E96]">
            Enter your email and password to login
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-4 flex flex-col items-center space-y-2">
            <div className="relative flex justify-center text-xs uppercase w-full">
              <span className="bg-[#0B162E] px-2 text-[#7A7E96]">Or continue with</span>
            </div>
            <Button
              variant="outline"
              type="button"
              className="w-full border-[#152142] bg-transparent hover:bg-[#152142] text-[#F5EDD8]"
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            >
              Google
            </Button>
          </div>

          <div className="mt-4 text-center text-sm text-[#7A7E96]">
            Don't have an account?{" "}
            <Link href="/register" className="text-[#E87213] hover:underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
