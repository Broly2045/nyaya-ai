"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
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
    <div className="flex items-center justify-center min-h-screen relative overflow-hidden bg-[#060F24]">
      {/* Dynamic Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#E87213]/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#152142]/60 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md z-10 px-4"
      >
        <Card className="bg-[#0B162E]/80 backdrop-blur-xl border-[#152142] text-[#F5EDD8] shadow-2xl relative overflow-hidden">
          {/* Subtle accent line on top of the card */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#E87213] to-transparent opacity-50" />
          
          <CardHeader className="space-y-2 pb-6 pt-8">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <CardTitle className="text-3xl font-serif text-center text-[#E87213] tracking-tight">NyayaAI</CardTitle>
            </motion.div>
            <CardDescription className="text-center text-[#7A7E96] text-base">
              Welcome back to your unified legal workspace
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative group">
                          <Mail className="absolute left-3 top-3 h-5 w-5 text-[#7A7E96] group-focus-within:text-[#E87213] transition-colors" />
                          <Input
                            placeholder="advocate@example.com"
                            className="bg-[#152142]/50 border-[#2A3454] text-[#F5EDD8] pl-10 h-11 focus-visible:ring-[#E87213]/50 focus-visible:border-[#E87213]"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400/90 text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative group">
                          <Lock className="absolute left-3 top-3 h-5 w-5 text-[#7A7E96] group-focus-within:text-[#E87213] transition-colors" />
                          <Input
                            type="password"
                            placeholder="••••••••"
                            className="bg-[#152142]/50 border-[#2A3454] text-[#F5EDD8] pl-10 h-11 focus-visible:ring-[#E87213]/50 focus-visible:border-[#E87213]"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400/90 text-xs" />
                    </FormItem>
                  )}
                />

                {error && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="text-sm text-red-400 text-center bg-red-950/20 border border-red-900/50 py-2 rounded-md"
                  >
                    {error}
                  </motion.p>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#E87213] hover:bg-[#C8BDA4] text-[#060F24] font-semibold h-11 mt-2 shadow-[0_0_15px_rgba(232,114,19,0.3)] transition-all hover:shadow-[0_0_20px_rgba(200,189,164,0.4)]"
                >
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="w-5 h-5 border-2 border-[#060F24] border-t-transparent rounded-full"
                    />
                  ) : (
                    <>
                      Sign In <LogIn className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-6 flex flex-col items-center space-y-4">
              <div className="relative flex justify-center text-xs uppercase w-full items-center">
                <div className="flex-1 border-t border-[#2A3454]" />
                <span className="bg-transparent px-3 text-[#7A7E96] z-10">Or connect with</span>
                <div className="flex-1 border-t border-[#2A3454]" />
              </div>

              <Button
                variant="outline"
                type="button"
                className="w-full border-[#2A3454] bg-[#152142]/30 hover:bg-[#152142]/80 text-[#F5EDD8] h-11 transition-all group"
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              >
                <div className="mr-2 bg-white rounded-full p-[2px]">
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                </div>
                Google Account
                <ArrowRight className="ml-auto w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#E87213]" />
              </Button>
            </div>

            <div className="mt-8 text-center text-sm text-[#7A7E96]">
              Don't have an account?{" "}
              <Link href="/register" className="text-[#E87213] hover:text-[#F5EDD8] transition-colors font-medium border-b border-transparent hover:border-[#F5EDD8]">
                Create one now
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
