"use client";

import { useState, useMemo } from "react";
import { useAdminPrograms, useAdminUniversities, useCreateMutation, useUpdateMutation, useDeleteMutation } from "@/hooks/useData";
import { useForm, useFieldArray } from "react-hook-form";
import type { Program } from "@/types";
import { generateSlug, safeJsonParse } from "@/lib/utils";
import { PROGRAM_LEVELS, PROGRAM_MODES } from "@/constants/site";
import { Plus, Edit2, Trash2, Loader2, X, Search } from "lucide-react";
import DeleteModal from "@/components/admin/DeleteModal";

export default function AdminProgramsPage() {
  const { data: programs, isLoading } = useAdminPrograms();
  const { data: universities } = useAdminUniversities();
  const createMut = useCreateMutation<Program>("/api/admin/programs", ["admin", "programs"]);
  const updateMut = useUpdateMutation<Program>("/api/admin/programs", ["admin", "programs"]);
  const deleteMut = useDeleteMutation("/api/admin/programs", ["admin", "programs"]);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Program | null>(null);
  const [step, setStep] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [search, setSearch] = useState("");

  // FIX: Search/filter programs
  const filtered = useMemo(() => {
    if (!programs) return [];
    if (!search.trim()) return programs;
    const q = search.toLowerCase();
    return programs.filter((p) =>
      p.name.toLowerCase().includes(q) ||
      p.university?.name?.toLowerCase().includes(q) ||
      p.department?.toLowerCase().includes(q)
    );
  }, [programs, search]);

  const { register, handleSubmit, reset, control, setValue, watch } = useForm<any>({
    defaultValues: {
      fees: [{ label: "", amount: "", currency: "MYR" }],
      curriculum: [{ category: "", subjects: "" }],
      careerItems: [{ icon: "", label: "" }],
    },
  });

  const { fields: feeFields, append: addFee, remove: removeFee } = useFieldArray({ control, name: "fees" });
  const { fields: currFields, append: addCurr, remove: removeCurr } = useFieldArray({ control, name: "curriculum" });
  const { fields: careerFields, append: addCareer, remove: removeCareer } = useFieldArray({ control, name: "careerItems" });

  const openCreate = () => {
    setEditing(null);
    setStep(1);
    reset({
      name: "", slug: "", universityId: "", department: "General", level: "Bachelor", duration: "", language: "English",
      intake: "", mode: "Full-time", description: "", requirements: "",
      englishReq: "", classType: "Physical", qualification: "",
      fees: [{ label: "", amount: "", currency: "MYR" }],
      curriculum: [{ category: "", subjects: "" }],
      careerItems: [{ icon: "", label: "" }],
      featured: false, isPublic: true,
    });
    setShowForm(true);
  };

  const openEdit = (prog: Program) => {
    setEditing(prog);
    setStep(1);
    const fees = safeJsonParse(prog.fees, [{ label: "", amount: "", currency: "MYR" }]);
    const curriculumRaw = safeJsonParse(prog.curriculum, []);
    const curriculum = curriculumRaw.map((c: any) => ({ category: c.category, subjects: Array.isArray(c.subjects) ? c.subjects.join(", ") : c.subjects }));
    const careerRaw = safeJsonParse(prog.careerProspects, []);
    const careerItems = Array.isArray(careerRaw) && careerRaw.length > 0 && typeof careerRaw[0] === "object"
      ? careerRaw
      : careerRaw.map((s: string) => ({ icon: "", label: s }));
    reset({ ...prog, fees, curriculum: curriculum.length ? curriculum : [{ category: "", subjects: "" }], careerItems: careerItems.length ? careerItems : [{ icon: "", label: "" }] });
    setShowForm(true);
  };

  const onSubmit = async (data: any) => {
    if (!data.slug) data.slug = generateSlug(data.name + "-" + (data.universityId || "").slice(0, 4));
    data.fees = data.fees?.filter((f: any) => f.label && f.amount) || [];
    // Serialize curriculum
    const rawCurr = data.curriculum || [];
    data.curriculum = JSON.stringify(
      rawCurr.filter((c: any) => c.category).map((c: any) => ({
        category: c.category,
        subjects: typeof c.subjects === "string" ? c.subjects.split(",").map((s: string) => s.trim()).filter(Boolean) : c.subjects || [],
      }))
    );
    // Serialize career prospects
    const rawCareer = data.careerItems || [];
    data.careerProspects = JSON.stringify(rawCareer.filter((c: any) => c.label));
    delete data.careerItems;

    if (editing) {
      await updateMut.mutateAsync({ id: editing.id, data });
    } else {
      await createMut.mutateAsync(data);
    }
    setShowForm(false);
    reset();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteMut.mutateAsync(deleteTarget.id);
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary)]">Programs</h1>
          <p className="text-gray-500 text-sm mt-1">{programs?.length || 0} programs</p>
        </div>
        <button onClick={openCreate} className="btn-primary"><Plus size={18} /> Add Program</button>
      </div>

      {/* FIX: Search Bar */}
      <div className="card p-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search programs by name, university, or department..."
            className="input-field !pl-10"
          />
        </div>
        {search && (
          <p className="text-xs text-gray-400 mt-2">
            Showing {filtered.length} of {programs?.length || 0} programs
          </p>
        )}
      </div>

      {/* Multi-step Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mt-10 mb-10">
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-xl font-bold text-[var(--primary)]">
                  {editing ? "Edit Program" : "Add Program"}
                </h2>
                <div className="flex gap-1 mt-2">
                  {[1, 2, 3, 4].map((s) => (
                    <div key={s} className={`h-1 w-12 rounded-full ${step >= s ? "bg-[var(--accent)]" : "bg-gray-200"}`} />
                  ))}
                </div>
              </div>
              <button onClick={() => setShowForm(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Step 1: Basic Info */}
              {step === 1 && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Program Name *</label>
                      <input {...register("name")} className="input-field" placeholder="Bachelor of Computer Science" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">University *</label>
                      <select {...register("universityId")} className="input-field">
                        <option value="">Select university</option>
                        {universities?.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                      <select {...register("department")} className="input-field">
                        <option value="General">General</option>
                        <option value="Computer Science & IT">Computer Science & IT</option>
                        <option value="Business & Management">Business & Management</option>
                        <option value="Engineering & Applied Sciences">Engineering & Applied Sciences</option>
                        <option value="Health & Medicine">Health & Medicine</option>
                        <option value="Arts & Design">Arts & Design</option>
                        <option value="Social Sciences">Social Sciences</option>
                        <option value="Natural Sciences">Natural Sciences</option>
                        <option value="Education & Teaching">Education & Teaching</option>
                        <option value="Hospitality & Tourism">Hospitality & Tourism</option>
                        <option value="Law">Law</option>
                        <option value="Architecture & Built Environment">Architecture & Built Environment</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                      <select {...register("level")} className="input-field">
                        {PROGRAM_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                      <input {...register("duration")} className="input-field" placeholder="3 years" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                      <input {...register("language")} className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mode</label>
                      <select {...register("mode")} className="input-field">
                        {PROGRAM_MODES.map((m) => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Intake</label>
                      <input {...register("intake")} className="input-field" placeholder="Jan, May, Sep" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">English Requirement</label>
                      <input {...register("englishReq")} className="input-field" placeholder="IELTS 5.0" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Class Type</label>
                      <select {...register("classType")} className="input-field">
                        <option value="Physical">Physical</option>
                        <option value="Online">Online</option>
                        <option value="Hybrid">Hybrid</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
                      <input {...register("qualification")} className="input-field" placeholder="e.g. Bachelor's Degree, Foundation / A-Level" />
                    </div>
                  </div>
                  <div className="flex justify-end pt-4">
                    <button type="button" onClick={() => setStep(2)} className="btn-primary">Next →</button>
                  </div>
                </>
              )}

              {/* Step 2: Fees — FIX: separate Tuition + Other Fees */}
              {step === 2 && (
                <>
                  {/* Tuition Fees */}
                  <h3 className="font-semibold text-[var(--primary)]">Yearly Tuition Fees</h3>
                  <div className="space-y-3">
                    {feeFields.map((field, idx) => {
                      const feeType = watch(`fees.${idx}.type`);
                      if (feeType === "other") return null;
                      return (
                        <div key={field.id} className="flex gap-2 items-center">
                          <input type="hidden" {...register(`fees.${idx}.type`)} value="tuition" />
                          <input {...register(`fees.${idx}.label`)} className="input-field flex-1" placeholder="e.g. 1st Year" />
                          <input {...register(`fees.${idx}.amount`)} className="input-field w-44" placeholder="e.g. 25000"
                            onBlur={(e) => {
                              const num = e.target.value.replace(/[^0-9.]/g, "");
                              if (num) setValue(`fees.${idx}.amount`, `MYR ${Number(num).toLocaleString()}`);
                            }}
                          />
                          {feeFields.filter((_, i) => watch(`fees.${i}.type`) !== "other").length > 1 && (
                            <button type="button" onClick={() => removeFee(idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      );
                    })}
                    <button type="button" onClick={() => addFee({ label: "", amount: "", currency: "MYR", type: "tuition" })}
                      className="text-sm text-[var(--accent)] font-medium hover:underline">
                      + Add Tuition Fee Row
                    </button>
                  </div>

                  {/* Other Fees */}
                  <h3 className="font-semibold text-[var(--primary)] mt-6 pt-6 border-t">Other Fees</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {["Security Bond", "Registration Fee", "FMGS", "Visa & Insurance", "Library Deposit", "Medical Insurance", "Student ID"].map((sug) => {
                      const alreadyAdded = feeFields.some((_, i) => watch(`fees.${i}.label`) === sug && watch(`fees.${i}.type`) === "other");
                      return (
                        <button key={sug} type="button" disabled={alreadyAdded}
                          onClick={() => addFee({ label: sug, amount: "", currency: "MYR", type: "other" })}
                          className={`text-xs px-3 py-1.5 rounded-full border transition-all ${alreadyAdded ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-600 border-gray-200 hover:border-[var(--accent)] hover:text-[var(--accent)]"}`}>
                          + {sug}
                        </button>
                      );
                    })}
                  </div>
                  <div className="space-y-3">
                    {feeFields.map((field, idx) => {
                      const feeType = watch(`fees.${idx}.type`);
                      if (feeType !== "other") return null;
                      return (
                        <div key={field.id} className="flex gap-2 items-center">
                          <input type="hidden" {...register(`fees.${idx}.type`)} value="other" />
                          <input {...register(`fees.${idx}.label`)} className="input-field flex-1" placeholder="Fee name" />
                          <input {...register(`fees.${idx}.amount`)} className="input-field w-44" placeholder="e.g. 3500"
                            onBlur={(e) => {
                              const num = e.target.value.replace(/[^0-9.]/g, "");
                              if (num) setValue(`fees.${idx}.amount`, `MYR ${Number(num).toLocaleString()}`);
                            }}
                          />
                          <button type="button" onClick={() => removeFee(idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      );
                    })}
                    <button type="button" onClick={() => addFee({ label: "", amount: "", currency: "MYR", type: "other" })}
                      className="text-sm text-[var(--accent)] font-medium hover:underline">
                      + Add Other Fee Row
                    </button>
                  </div>
                  <div className="flex justify-between pt-4">
                    <button type="button" onClick={() => setStep(1)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">← Back</button>
                    <button type="button" onClick={() => setStep(3)} className="btn-primary">Next →</button>
                  </div>
                </>
              )}

              {/* Step 3: Content */}
              {step === 3 && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea {...register("description")} rows={4} className="input-field resize-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Entry Requirements</label>
                    <textarea {...register("requirements")} rows={3} className="input-field resize-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Career Prospects</label>
                    <textarea {...register("careerProspects")} rows={3} className="input-field resize-none" />
                  </div>
                  <div className="flex flex-wrap gap-6 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" {...register("featured")} className="w-4 h-4 accent-[var(--accent)]" />
                      <span className="text-sm text-gray-700">Featured</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" {...register("isPublic")} className="w-4 h-4 accent-[var(--accent)]" />
                      <span className="text-sm text-gray-700">Public</span>
                    </label>
                  </div>
                  <div className="flex justify-between pt-4 border-t">
                    <button type="button" onClick={() => setStep(2)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">← Back</button>
                    <button type="button" onClick={() => setStep(4)} className="btn-primary">Next →</button>
                  </div>
                </>
              )}

              {/* Step 4: Curriculum & Career */}
              {step === 4 && (
                <>
                  <h3 className="font-semibold text-[var(--primary)]">Curriculum Overview</h3>
                  <p className="text-xs text-gray-500 mb-2">Add subject categories and their subjects (comma-separated)</p>
                  <div className="space-y-3">
                    {currFields.map((field, idx) => (
                      <div key={field.id} className="border border-gray-200 rounded-lg p-3 space-y-2">
                        <div className="flex gap-2 items-center">
                          <input {...register(`curriculum.${idx}.category`)} className="input-field flex-1" placeholder="e.g. Business Studies" />
                          {currFields.length > 1 && (
                            <button type="button" onClick={() => removeCurr(idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
                          )}
                        </div>
                        <textarea {...register(`curriculum.${idx}.subjects`)} className="input-field resize-none text-sm" rows={2} placeholder="Subject 1, Subject 2, Subject 3" />
                      </div>
                    ))}
                    <button type="button" onClick={() => addCurr({ category: "", subjects: "" })} className="text-sm text-[var(--accent)] font-medium hover:underline">+ Add Category</button>
                  </div>

                  <h3 className="font-semibold text-[var(--primary)] pt-4">Career Opportunities</h3>
                  <p className="text-xs text-gray-500 mb-2">Add career paths with an optional emoji icon</p>
                  <div className="space-y-2">
                    {careerFields.map((field, idx) => (
                      <div key={field.id} className="flex gap-2 items-center">
                        <input {...register(`careerItems.${idx}.icon`)} className="input-field w-16" placeholder="🏛️" />
                        <input {...register(`careerItems.${idx}.label`)} className="input-field flex-1" placeholder="Government" />
                        {careerFields.length > 1 && (
                          <button type="button" onClick={() => removeCareer(idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
                        )}
                      </div>
                    ))}
                    <button type="button" onClick={() => addCareer({ icon: "", label: "" })} className="text-sm text-[var(--accent)] font-medium hover:underline">+ Add Career Path</button>
                  </div>

                  <div className="flex flex-wrap gap-6 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" {...register("featured")} className="w-4 h-4 accent-[var(--accent)]" />
                      <span className="text-sm text-gray-700">Featured</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" {...register("isPublic")} className="w-4 h-4 accent-[var(--accent)]" />
                      <span className="text-sm text-gray-700">Public</span>
                    </label>
                  </div>
                  <div className="flex justify-between pt-4 border-t">
                    <button type="button" onClick={() => setStep(3)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">← Back</button>
                    <button type="submit" disabled={createMut.isPending || updateMut.isPending} className="btn-primary">
                      {(createMut.isPending || updateMut.isPending) && <Loader2 size={16} className="animate-spin" />}
                      {editing ? "Update Program" : "Create Program"}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin text-[var(--accent)]" /></div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Program</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">University</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Department</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Level</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Duration</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered?.map((prog) => (
                  <tr key={prog.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">{prog.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{prog.university?.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{prog.department || "General"}</td>
                    <td className="px-4 py-3 text-center"><span className="badge bg-blue-100 text-blue-800">{prog.level}</span></td>
                    <td className="px-4 py-3 text-center text-sm text-gray-600">{prog.duration}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(prog)} className="p-2 hover:bg-blue-50 rounded-lg text-blue-600"><Edit2 size={16} /></button>
                        <button onClick={() => setDeleteTarget({ id: prog.id, name: prog.name })} className="p-2 hover:bg-red-50 rounded-lg text-red-600"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {deleteTarget && (
        <DeleteModal
          title="Delete Program"
          itemName={deleteTarget.name}
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
