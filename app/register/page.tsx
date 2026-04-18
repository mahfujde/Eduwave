"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Loader2, User, Mail, Lock, Phone, CheckCircle2, AlertCircle } from "lucide-react";

const schema = z.object({
  name:      z.string().min(2, "Full name required"),
  email:     z.string().email("Valid email required"),
  password:  z.string().min(8, "Password must be at least 8 characters"),
  agentCode: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState("");

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setError("");
    const res  = await fetch("/api/student/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (json.success) {
      setSuccess(true);
    } else {
      setError(json.message ?? "Registration failed.");
    }
  };

  if (success) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0F1B3F] to-[#1A2B5F] p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 size={32} className="text-green-500"/>
        </div>
        <h2 className="text-2xl font-bold text-[var(--primary)] mb-2">Account Created!</h2>
        <p className="text-gray-500 mb-6">Your student account has been created. Log in to start your application.</p>
        <Link href="/login" className="btn-primary w-full justify-center">Sign In Now</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0F1B3F] to-[#1A2B5F] p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Create Student Account</h1>
          <p className="text-blue-200 mt-2">Start your study abroad journey with Eduwave</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {error && (
            <div className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              <AlertCircle size={16}/> {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                <input {...register("name")} placeholder="Your full name" className="input-field !pl-10"/>
              </div>
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
            </div>

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
                <input {...register("password")} type="password" placeholder="Min. 8 characters" className="input-field !pl-10"/>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Agent Referral Code <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input {...register("agentCode")} placeholder="e.g. AGT-DEMO01" className="input-field"/>
            </div>

            <button type="submit" disabled={isSubmitting} className="btn-primary w-full justify-center mt-2">
              {isSubmitting && <Loader2 size={16} className="animate-spin"/>}
              Create Account
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account?{" "}
            <Link href="/login" className="text-[var(--accent)] hover:underline font-medium">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
