"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { GraduationCap, ArrowRight, ArrowLeft, CheckCircle2, Loader2, AlertCircle, Building2 } from "lucide-react";

const STEPS = ["University & Program", "Personal Details", "Review & Submit"];

const INTAKES = [
  "January 2026", "March 2026", "May 2026", "July 2026", "September 2026",
  "January 2027", "March 2027", "May 2027", "July 2027", "September 2027",
];

export default function ApplyPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [universities, setUnis] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [selectedUni, setSelectedUni] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");

  const { register, handleSubmit, watch, getValues, setValue, formState: { errors } } = useForm<any>();

  useEffect(() => {
    fetch("/api/public/universities").then((r) => r.json()).then((d) => setUnis(d.data ?? []));
  }, []);

  useEffect(() => {
    if (!selectedUni) return;
    fetch(`/api/public/programs?universityId=${selectedUni}`)
      .then((r) => r.json())
      .then((d) => setPrograms(d.data ?? []));
  }, [selectedUni]);

  // Resolve names for review step
  const selectedUniversity = universities.find((u) => u.id === getValues("universityId"));
  const selectedProgram = programs.find((p) => p.id === getValues("programId"));

  const validateStep = () => {
    if (step === 0) {
      if (!getValues("universityId")) {
        setError("Please select a university");
        return false;
      }
      if (!getValues("programId")) {
        setError("Please select a program");
        return false;
      }
    }
    setError("");
    return true;
  };

  const onSubmit = async (data: any) => {
    if (step < STEPS.length - 1) {
      if (!validateStep()) return;
      setStep((s) => s + 1);
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/student/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          universityName: selectedUniversity?.name || null,
          programName: selectedProgram?.name || null,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setTrackingNumber(json.data.trackingNumber);
        setStep(STEPS.length); // success state
      } else {
        setError(json.message ?? "Something went wrong.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // ── Success State ──
  if (trackingNumber)
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={40} className="text-green-500" />
        </div>
        <h1 className="text-2xl font-bold text-[var(--primary)] mb-2">Application Submitted!</h1>
        <p className="text-gray-500 mb-6">Your tracking number is:</p>
        <div className="bg-[var(--primary)] text-white text-2xl font-mono font-bold py-4 px-8 rounded-2xl inline-block mb-8 tracking-widest">
          {trackingNumber}
        </div>
        <p className="text-gray-500 text-sm mb-6">
          Save this number. You can use it to track your application at <strong>/track</strong> without logging in.
        </p>
        <button onClick={() => router.push("/portal/applications")} className="btn-primary">
          View My Applications <ArrowRight size={16} />
        </button>
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[var(--primary)]">Submit Application</h1>
        <p className="text-gray-500 text-sm mt-1">Apply to study at a Malaysian university through Eduwave</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {STEPS.map((s, i) => (
          <div key={i} className="flex items-center gap-2 flex-1">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold shrink-0
              ${i < step ? "bg-green-500 text-white" : i === step ? "bg-[var(--accent)] text-white" : "bg-gray-200 text-gray-400"}`}
            >
              {i < step ? <CheckCircle2 size={14} /> : i + 1}
            </div>
            <span className={`text-xs font-medium ${i === step ? "text-[var(--primary)]" : "text-gray-400"}`}>{s}</span>
            {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 ${i < step ? "bg-green-300" : "bg-gray-200"}`} />}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-5">
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {/* Step 0 — University & Program */}
        {step === 0 && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Select University *</label>
              <select
                {...register("universityId")}
                className="input-field"
                onChange={(e) => {
                  setValue("universityId", e.target.value);
                  setSelectedUni(e.target.value);
                  setPrograms([]);
                  setValue("programId", "");
                }}
              >
                <option value="">-- Choose a university --</option>
                {universities.map((u: any) => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Select Program *</label>
              <select {...register("programId")} className="input-field" disabled={!selectedUni}>
                <option value="">-- Choose a program --</option>
                {programs.map((p: any) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.level})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Preferred Intake</label>
              <select {...register("intake")} className="input-field">
                <option value="">-- Select intake --</option>
                {INTAKES.map((i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
            </div>

            {/* Show selected university info */}
            {selectedUniversity && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <Building2 size={20} className="text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-900 text-sm">{selectedUniversity.name}</p>
                    <p className="text-xs text-blue-600">{selectedUniversity.city}, {selectedUniversity.country} · {selectedUniversity.type}</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Step 1 — Personal */}
        {step === 1 && (
          <>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-700">
              ℹ️ Your profile information will be used for this application. You can update your full profile in{" "}
              <strong>My Profile</strong>.
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Additional Notes (optional)</label>
              <textarea
                {...register("notes")}
                rows={4}
                className="input-field resize-none"
                placeholder="Any additional information or questions for the Eduwave team..."
              />
            </div>
          </>
        )}

        {/* Step 2 — Review */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800">Review your application</h3>
            <div className="bg-gray-50 rounded-xl p-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">University</span>
                <span className="font-medium text-gray-800">{selectedUniversity?.name || "Not selected"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Program</span>
                <span className="font-medium text-gray-800">{selectedProgram?.name || "Not selected"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Level</span>
                <span className="font-medium text-gray-800">{selectedProgram?.level || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Intake</span>
                <span className="font-medium text-gray-800">{getValues("intake") || "Not specified"}</span>
              </div>
              {getValues("notes") && (
                <div className="pt-3 border-t border-gray-200">
                  <span className="text-gray-500 block mb-1">Additional Notes</span>
                  <span className="text-gray-700">{getValues("notes")}</span>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-400">
              By submitting, you agree that the information provided is accurate. Eduwave will contact you within 1-2
              business days.
            </p>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          {step > 0 && (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium"
            >
              <ArrowLeft size={15} /> Back
            </button>
          )}
          <button type="submit" disabled={submitting} className="btn-primary flex-1 justify-center">
            {submitting && <Loader2 size={16} className="animate-spin" />}
            {step < STEPS.length - 1 ? (
              <>
                Next <ArrowRight size={15} />
              </>
            ) : (
              "Submit Application"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
