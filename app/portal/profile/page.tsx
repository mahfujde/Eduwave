"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { Save, Loader2, CheckCircle2, User, Globe, BookOpen, Lock, AlertCircle, Eye, EyeOff } from "lucide-react";

export default function StudentProfilePage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const { register, handleSubmit, reset } = useForm<any>();

  // Password change state
  const [changingPw, setChangingPw] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");

  useEffect(() => {
    fetch("/api/student/profile")
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.data) reset(d.data);
      })
      .finally(() => setLoading(false));
  }, [reset]);

  const onSubmit = async (data: any) => {
    setSaving(true);
    const allowedFields = [
      "dateOfBirth", "nationality", "passportNo", "passportExpiry",
      "address", "emergencyContact", "lastQualification",
      "lastInstitution", "gpa", "englishScore",
    ];
    const filtered: any = {};
    allowedFields.forEach((f) => { if (data[f] !== undefined) filtered[f] = data[f]; });

    await fetch("/api/student/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(filtered),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError("");
    setPwSuccess(false);

    if (!currentPw || !newPw) {
      setPwError("Please fill in all fields");
      return;
    }
    if (newPw.length < 8) {
      setPwError("New password must be at least 8 characters");
      return;
    }
    if (newPw !== confirmPw) {
      setPwError("New passwords do not match");
      return;
    }

    setChangingPw(true);
    try {
      const res = await fetch("/api/student/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw }),
      });
      const json = await res.json();
      if (json.success) {
        setPwSuccess(true);
        setCurrentPw("");
        setNewPw("");
        setConfirmPw("");
        setTimeout(() => setPwSuccess(false), 5000);
      } else {
        setPwError(json.message ?? "Failed to change password");
      }
    } catch {
      setPwError("Network error. Please try again.");
    }
    setChangingPw(false);
  };

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary)]">My Profile</h1>
          <p className="text-gray-500 text-sm mt-1">Keep your profile up to date for accurate applications</p>
        </div>
        {saved && (
          <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-xl text-sm font-medium">
            <CheckCircle2 size={16} /> Saved!
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Account info */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <User size={16} className="text-[var(--accent)]" /> Account Info
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <input value={session?.user?.name ?? ""} disabled className="input-field opacity-60 cursor-not-allowed" />
              <p className="text-xs text-gray-400 mt-1">Name linked to your account. Contact support to change.</p>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input value={session?.user?.email ?? ""} disabled className="input-field opacity-60 cursor-not-allowed" />
            </div>
          </div>
        </div>

        {/* Personal info */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Globe size={16} className="text-[var(--accent)]" /> Personal Information
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Date of Birth</label>
              <input {...register("dateOfBirth")} type="date" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nationality</label>
              <input {...register("nationality")} className="input-field" placeholder="e.g. Bangladeshi" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Passport Number</label>
              <input {...register("passportNo")} className="input-field" placeholder="e.g. AA1234567" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Passport Expiry Date</label>
              <input {...register("passportExpiry")} type="date" className="input-field" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Home Address</label>
              <textarea {...register("address")} rows={2} className="input-field resize-none" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Emergency Contact</label>
              <input {...register("emergencyContact")} className="input-field" placeholder="Name & phone number" />
            </div>
          </div>
        </div>

        {/* Academic info */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <BookOpen size={16} className="text-[var(--accent)]" /> Academic Background
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Qualification</label>
              <select {...register("lastQualification")} className="input-field">
                <option value="">-- Select --</option>
                {["O Level / SSC", "A Level / HSC", "Diploma", "Bachelor's Degree", "Master's Degree"].map((q) => (
                  <option key={q} value={q}>
                    {q}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">GPA / Grade</label>
              <input {...register("gpa")} className="input-field" placeholder="e.g. 4.5/5.0 or 80%" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Institution</label>
              <input {...register("lastInstitution")} className="input-field" placeholder="Name of school / college / university" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">English Test Score</label>
              <input {...register("englishScore")} className="input-field" placeholder="e.g. IELTS 6.0 / TOEFL 80" />
            </div>
          </div>
        </div>

        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Save Profile
        </button>
      </form>

      {/* Change Password Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Lock size={16} className="text-[var(--accent)]" /> Change Password
        </h2>

        {pwSuccess && (
          <div className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm">
            <CheckCircle2 size={16} /> Password changed successfully!
          </div>
        )}
        {pwError && (
          <div className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
            <AlertCircle size={16} /> {pwError}
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPw}
                onChange={(e) => setCurrentPw(e.target.value)}
                placeholder="Enter current password"
                className="input-field !pl-10 !pr-10"
              />
              <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showNew ? "text" : "password"}
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                placeholder="Min. 8 characters"
                className="input-field !pl-10 !pr-10"
              />
              <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm New Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                placeholder="Re-enter new password"
                className="input-field !pl-10"
              />
            </div>
          </div>

          <button type="submit" disabled={changingPw} className="btn-primary">
            {changingPw ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
}
