"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Send, Loader2, CheckCircle } from "lucide-react";

const inquirySchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  university: z.string().optional(),
  program: z.string().optional(),
  intake: z.string().optional(),
  message: z.string().min(5, "Please enter a message"),
});

type InquiryFormData = z.infer<typeof inquirySchema>;

interface Props {
  universities?: { name: string }[];
}

export default function InquiryForm({ universities }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InquiryFormData>({
    resolver: zodResolver(inquirySchema),
  });

  const onSubmit = async (data: InquiryFormData) => {
    setError("");
    try {
      const res = await fetch("/api/public/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.success) {
        setSubmitted(true);
        reset();
      } else {
        setError(result.message || "Something went wrong");
      }
    } catch {
      setError("Network error. Please try again.");
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-12 px-6">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100
                      flex items-center justify-center">
          <CheckCircle size={32} className="text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-[var(--primary)] mb-2">
          Thank You!
        </h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Your inquiry has been submitted successfully. Our team will contact you within 24 hours.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="btn-primary mt-6"
        >
          Submit Another Inquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            {...register("name")}
            type="text"
            placeholder="Your full name"
            className="input-field"
          />
          {errors.name && (
            <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            {...register("email")}
            type="email"
            placeholder="your@email.com"
            className="input-field"
          />
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Phone
          </label>
          <input
            {...register("phone")}
            type="tel"
            placeholder="+880 1XXX-XXXXXX"
            className="input-field"
          />
        </div>

        {/* WhatsApp */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            WhatsApp Number
          </label>
          <input
            {...register("whatsapp")}
            type="tel"
            placeholder="+880 1XXX-XXXXXX"
            className="input-field"
          />
        </div>

        {/* University */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Preferred University
          </label>
          <select {...register("university")} className="input-field">
            <option value="">Select university</option>
            {universities?.map((uni) => (
              <option key={uni.name} value={uni.name}>
                {uni.name}
              </option>
            ))}
            <option value="Not sure">Not sure / Need guidance</option>
          </select>
        </div>

        {/* Program */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Program of Interest
          </label>
          <input
            {...register("program")}
            type="text"
            placeholder="e.g., Computer Science, Business"
            className="input-field"
          />
        </div>

        {/* Intake */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Preferred Intake
          </label>
          <select {...register("intake")} className="input-field">
            <option value="">Select intake</option>
            <option value="January 2025">January 2025</option>
            <option value="March 2025">March 2025</option>
            <option value="May 2025">May 2025</option>
            <option value="July 2025">July 2025</option>
            <option value="September 2025">September 2025</option>
            <option value="January 2026">January 2026</option>
            <option value="Not sure">Not sure / Need guidance</option>
          </select>
        </div>
      </div>

      {/* Message */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register("message")}
          rows={4}
          placeholder="Tell us about your study plans..."
          className="input-field resize-none"
        />
        {errors.message && (
          <p className="text-xs text-red-500 mt-1">{errors.message.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary w-full sm:w-auto"
      >
        {isSubmitting ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send size={18} />
            Send My Free Inquiry
          </>
        )}
      </button>
    </form>
  );
}
