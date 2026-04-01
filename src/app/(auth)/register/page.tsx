"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { User, Mail, Lock, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push("/login?registered=true");
      } else {
        const resData = await res.json();
        setError(resData.error ? `${resData.message}: ${resData.error}` : resData.message || "Registration failed");
      }
    } catch (err) {
      setError("An error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen relative overflow-hidden bg-[#060F24]">
      {/* Dynamic Background Gradients */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#E87213]/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#152142]/60 blur-[120px] pointer-events-none" />

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
              <CardTitle className="text-3xl font-serif text-center text-[#E87213] tracking-tight">Create an account</CardTitle>
            </motion.div>
            <CardDescription className="text-center text-[#7A7E96] text-base">
              Enter your details to create your NyayaAI account
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative group">
                          <User className="absolute left-3 top-3 h-5 w-5 text-[#7A7E96] group-focus-within:text-[#E87213] transition-colors" />
                          <Input
                            placeholder="Full Name"
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
                      Sign Up <UserPlus className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-8 text-center text-sm text-[#7A7E96]">
              Already have an account?{" "}
              <Link href="/login" className="text-[#E87213] hover:text-[#F5EDD8] transition-colors font-medium border-b border-transparent hover:border-[#F5EDD8]">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
