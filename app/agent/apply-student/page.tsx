"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  UserPlus, Loader2, CheckCircle2, X, GraduationCap, Building2,
  User, Mail, Phone, Globe, FileText, BookOpen, Calendar, ClipboardList,
} from "lucide-react";

export default function AgentApplyStudentPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<any>(null);
  const [error, setError]     = useState("");

  // Universities + Programs for dropdowns
  const [universities, setUniversities] = useState<any[]>([]);
  const [programs, setPrograms]         = useState<any[]>([]);
  const [selectedUni, setSelectedUni]   = useState("");
  const [filteredPrograms, setFilteredPrograms] = useState<any[]>([]);

  // Form state
  const [form, setForm] = useState({
    studentName: "", studentEmail: "", studentPhone: "",
    universityId: "", programId: "", universityName: "", programName: "",
    intake: "", passportNo: "", nationality: "Bangladeshi", notes: "",
  });

  useEffect(() => {
    fetch("/api/admin/universities").then(r => r.json()).then(d => {
      if (d.success || d.data) setUniversities(d.data || []);
    }).catch(() => {});
    fetch("/api/admin/programs").then(r => r.json()).then(d => {
      if (d.success || d.data) setPrograms(d.data || []);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (selectedUni) {
      setFilteredPrograms(programs.filter((p: any) => p.universityId === selectedUni));
    } else {
      setFilteredPrograms(programs);
    }
  }, [selectedUni, programs]);

  const handleUniChange = (id: string) => {
    setSelectedUni(id);
    const uni = universities.find((u: any) => u.id === id);
    setForm(f => ({ ...f, universityId: id, universityName: uni?.name || "" }));
  };

  const handleProgramChange = (id: string) => {
    const prog = (selectedUni ? filteredPrograms : programs).find((p: any) => p.id === id);
    setForm(f => ({ ...f, programId: id, programName: prog?.name || "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(null);
    try {
      const res = await fetch("/api/agent/apply-student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(data);
        setForm({
          studentName: "", studentEmail: "", studentPhone: "",
          universityId: "", programId: "", universityName: "", programName: "",
          intake: "", passportNo: "", nationality: "Bangladeshi", notes: "",
        });
        setSelectedUni("");
      } else {
        setError(data.message || "Failed to submit application");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1B3A2F] to-[#2A5C45] rounded-2xl p-6 md:p-8 text-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
            <UserPlus size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Apply for a Student</h1>
            <p className="text-green-200/60 text-sm mt-0.5">
              Submit a new student application on behalf of your referred student
            </p>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <CheckCircle2 size={24} className="text-green-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-green-800 text-lg">Application Submitted Successfully! 🎉</h3>
              <p className="text-green-700 text-sm mt-1">{success.message}</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-sm text-green-600">Tracking Number:</span>
                <code className="font-mono bg-green-100 px-3 py-1 rounded-lg text-green-800 font-bold text-base">
                  {success.data?.trackingNumber}
                </code>
              </div>
              <p className="text-xs text-green-500 mt-2">Admin has been notified. Commission will be set once reviewed.</p>
              <button onClick={() => setSuccess(null)} className="mt-3 text-sm text-green-600 hover:text-green-800 underline">
                Submit another application
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <X size={18} className="text-red-500 shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
          <button onClick={() => setError("")} className="ml-auto"><X size={16} className="text-red-400" /></button>
        </div>
      )}

      {!success && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Student Info Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center gap-2 px-6 py-4 border-b bg-gray-50/50">
              <User size={18} className="text-[var(--accent)]" />
              <h2 className="font-bold text-[var(--primary)]">Student Information</h2>
            </div>
            <div className="p-6 grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input required value={form.studentName}
                    onChange={e => setForm(f => ({ ...f, studentName: e.target.value }))}
                    placeholder="e.g. Mohammad Rahman"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 focus:border-[var(--accent)]" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input required type="email" value={form.studentEmail}
                    onChange={e => setForm(f => ({ ...f, studentEmail: e.target.value }))}
                    placeholder="student@email.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 focus:border-[var(--accent)]" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone (WhatsApp)</label>
                <div className="relative">
                  <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input value={form.studentPhone}
                    onChange={e => setForm(f => ({ ...f, studentPhone: e.target.value }))}
                    placeholder="+880 1XXXXXXXXX"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 focus:border-[var(--accent)]" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Passport No.</label>
                <div className="relative">
                  <FileText size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input value={form.passportNo}
                    onChange={e => setForm(f => ({ ...f, passportNo: e.target.value }))}
                    placeholder="e.g. AB1234567"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 focus:border-[var(--accent)]" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nationality</label>
                <div className="relative">
                  <Globe size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input value={form.nationality}
                    onChange={e => setForm(f => ({ ...f, nationality: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 focus:border-[var(--accent)]" />
                </div>
              </div>
            </div>
          </div>

          {/* Program Selection Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center gap-2 px-6 py-4 border-b bg-gray-50/50">
              <GraduationCap size={18} className="text-[var(--accent)]" />
              <h2 className="font-bold text-[var(--primary)]">Program Selection</h2>
            </div>
            <div className="p-6 grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">University</label>
                <div className="relative">
                  <Building2 size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select value={selectedUni} onChange={e => handleUniChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 focus:border-[var(--accent)] appearance-none bg-white">
                    <option value="">Select University</option>
                    {universities.map((u: any) => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Program / Course</label>
                <div className="relative">
                  <BookOpen size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select value={form.programId} onChange={e => handleProgramChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 focus:border-[var(--accent)] appearance-none bg-white">
                    <option value="">Select Program</option>
                    {(selectedUni ? filteredPrograms : programs).map((p: any) => (
                      <option key={p.id} value={p.id}>{p.name} ({p.level})</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Intake</label>
                <div className="relative">
                  <Calendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input value={form.intake}
                    onChange={e => setForm(f => ({ ...f, intake: e.target.value }))}
                    placeholder="e.g. September 2026"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 focus:border-[var(--accent)]" />
                </div>
              </div>
            </div>
          </div>

          {/* Notes Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center gap-2 px-6 py-4 border-b bg-gray-50/50">
              <ClipboardList size={18} className="text-[var(--accent)]" />
              <h2 className="font-bold text-[var(--primary)]">Additional Notes</h2>
            </div>
            <div className="p-6">
              <textarea value={form.notes}
                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                rows={3} placeholder="Any additional information about the student..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 focus:border-[var(--accent)] resize-none" />
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-[#1B3A2F] to-[#2A5C45] text-white font-semibold rounded-2xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-green-900/20 disabled:opacity-50">
            {loading ? (
              <><Loader2 size={18} className="animate-spin" /> Submitting Application...</>
            ) : (
              <><UserPlus size={18} /> Submit Student Application</>
            )}
          </button>

          <p className="text-xs text-gray-400 text-center">
            Admin will be notified via email and dashboard. Commission will be set upon review.
          </p>
        </form>
      )}
    </div>
  );
}
