"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Loader2, Lock, Mail, AlertCircle } from "lucide-react";

const schema = z.object({
  email:    z.string().email("Valid email required"),
  password: z.string().min(1, "Password required"),
});
type FormData = z.infer<typeof schema>;

function LoginForm() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [error, setError] = useState("");
  const callbackUrl = searchParams.get("callbackUrl") ?? "";

  // Redirect already-logged-in users
  useEffect(() => {
    if (status !== "authenticated") return;
    const role = (session.user as any)?.role ?? "";
    if (["SUPER_ADMIN","ADMIN","EDITOR"].includes(role)) router.push("/admin/dashboard");
    else if (role === "AGENT") router.push("/agent/dashboard");
    else router.push(callbackUrl || "/portal/dashboard");
  }, [status, session, router, callbackUrl]);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setError("");
    const result = await signIn("credentials", { ...data, redirect: false });
    if (result?.error) setError("Invalid email or password. Please try again.");
  };

  if (status === "loading") return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 size={32} className="animate-spin text-[var(--accent)]"/>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0F1B3F] to-[#1A2B5F] p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
          <p className="text-blue-200 mt-2">Sign in to your Eduwave account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {error && (
            <div className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              <AlertCircle size={16}/> {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                <input {...register("email")} type="email" placeholder="your@email.com" className="input-field !pl-10"/>
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                <input {...register("password")} type="password" placeholder="••••••••" className="input-field !pl-10"/>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
              <div className="text-right mt-1">
                <Link href="/forgot-password" className="text-xs text-[var(--accent)] hover:underline">
                  Forgot password?
                </Link>
              </div>
            </div>

            <button type="submit" disabled={isSubmitting} className="btn-primary w-full justify-center">
              {isSubmitting ? <><Loader2 size={16} className="animate-spin"/> Signing in...</> : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center space-y-3">
            <p className="text-sm text-gray-500">
              New student?{" "}
              <Link href="/register" className="text-[var(--accent)] hover:underline font-medium">Create account</Link>
            </p>
            <p className="text-sm text-gray-500">
              Want to become an agent?{" "}
              <Link href="/agent-apply" className="text-[var(--accent)] hover:underline font-medium">Apply here</Link>
            </p>
            <p className="text-xs text-gray-400 border-t pt-3">
              Admin?{" "}
              <Link href="/admin/login" className="text-gray-500 hover:underline">Admin login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return <Suspense><LoginForm/></Suspense>;
}
