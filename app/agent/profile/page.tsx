"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  User, Lock, Save, Loader2, CheckCircle2, AlertCircle,
  Eye, EyeOff, Copy, Check, Phone, TrendingUp, Users, GraduationCap,
} from "lucide-react";

export default function AgentProfilePage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Password state
  const [changingPw, setChangingPw] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/agent/profile")
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.data) {
          setProfile(d.data);
          setPhone(d.data.phone || "");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const copyCode = () => {
    navigator.clipboard.writeText(profile?.agentCode || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleProfileSave = async () => {
    setSaving(true);
    await fetch("/api/agent/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
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
      const res = await fetch("/api/agent/profile", {
        method: "PUT",
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

  const stats = profile?.stats || {};

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary)]">Agent Profile</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your agent account</p>
        </div>
        {saved && (
          <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-xl text-sm font-medium">
            <CheckCircle2 size={16} /> Saved!
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Referrals", value: stats.totalReferrals ?? 0, icon: Users, color: "text-blue-500" },
          { label: "Enrolled", value: stats.enrolledCount ?? 0, icon: GraduationCap, color: "text-green-500" },
          { label: "Active", value: stats.activeCount ?? 0, icon: TrendingUp, color: "text-purple-500" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
            <s.icon size={20} className={`${s.color} mx-auto mb-2`} />
            <p className="text-2xl font-extrabold text-[var(--primary)]">{s.value}</p>
            <p className="text-xs text-gray-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Referral Code */}
      <div className="bg-gradient-to-r from-[#1B3A2F] to-[#2A5C45] rounded-2xl p-6 text-white">
        <p className="text-green-200/60 text-xs mb-2">Your Referral Code</p>
        <div className="flex items-center gap-3">
          <p className="font-mono font-bold text-2xl tracking-widest">{profile?.agentCode || "—"}</p>
          <button onClick={copyCode} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
            {copied ? <Check size={16} className="text-green-300" /> : <Copy size={16} className="text-white" />}
          </button>
        </div>
        <p className="text-green-200/50 text-xs mt-2">Share this code with students. They enter it during registration.</p>
      </div>

      {/* Account Info */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <User size={16} className="text-[var(--accent)]" /> Account Info
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
            <input value={profile?.name ?? ""} disabled className="input-field opacity-60 cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <input value={profile?.email ?? ""} disabled className="input-field opacity-60 cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
            <div className="relative">
              <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+880 1234 567890"
                className="input-field !pl-10"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Member Since</label>
            <input
              value={profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : ""}
              disabled
              className="input-field opacity-60 cursor-not-allowed"
            />
          </div>
          <button onClick={handleProfileSave} disabled={saving} className="btn-primary">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Save Profile
          </button>
        </div>
      </div>

      {/* Change Password */}
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
              <input type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} placeholder="Re-enter new password" className="input-field !pl-10" />
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
