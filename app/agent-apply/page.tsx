"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { CheckCircle2, Loader2, AlertCircle, Handshake } from "lucide-react";

export default function AgentApplyPage() {
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState("");
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<any>();

  const onSubmit = async (data: any) => {
    setError("");
    const res  = await fetch("/api/agent/apply", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    const json = await res.json();
    if (json.success) setSuccess(true);
    else setError(json.message ?? "Submission failed.");
  };

  if (success) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0F1B3F] to-[#1A2B5F] p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-lg w-full text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={40} className="text-green-500"/>
        </div>
        <h2 className="text-2xl font-bold text-[var(--primary)] mb-3">Application Submitted!</h2>
        <p className="text-gray-500">Thank you for applying to become an Eduwave agent. Our team will review your application and contact you within 2–3 business days.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F1B3F] to-[#1A2B5F] py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full text-white/80 text-sm mb-5">
            <Handshake size={16}/> Partner with Eduwave
          </div>
          <h1 className="text-4xl font-bold text-white">Become an Eduwave Agent</h1>
          <p className="text-blue-200 mt-3 text-lg">Help students achieve their study abroad dreams and earn with every successful enrollment.</p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[["Unique Referral Code","Track all your referred students"],["Commission Earnings","Earn for every enrollment"],["24/7 Support","Full back-office support"]].map(([t,d]) => (
            <div key={t} className="bg-white/10 backdrop-blur border border-white/10 rounded-xl p-4 text-white text-center">
              <p className="font-semibold text-sm">{t}</p>
              <p className="text-white/60 text-xs mt-1">{d}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-bold text-[var(--primary)] mb-6">Agent Application Form</h2>
          {error && <div className="flex items-center gap-2 p-3 mb-5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm"><AlertCircle size={16}/>{error}</div>}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                <input {...register("name", { required: true })} className="input-field"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address *</label>
                <input {...register("email", { required: true })} type="email" className="input-field"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone / WhatsApp</label>
                <input {...register("phone")} className="input-field"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Company / Agency</label>
                <input {...register("company")} className="input-field"/>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Region / Country you operate in</label>
              <input {...register("region")} placeholder="e.g. Dhaka, Bangladesh" className="input-field"/>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Relevant Experience</label>
              <textarea {...register("experience")} rows={3} className="input-field resize-none"
                placeholder="Tell us about your experience in education consulting or student placement..."/>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Why do you want to partner with Eduwave?</label>
              <textarea {...register("motivation")} rows={3} className="input-field resize-none"/>
            </div>

            <button type="submit" disabled={isSubmitting} className="btn-primary w-full justify-center">
              {isSubmitting && <Loader2 size={16} className="animate-spin"/>}
              Submit Application
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
