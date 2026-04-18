"use client";

import { useState } from "react";
import { useAdminTestimonials, useCreateMutation, useUpdateMutation, useDeleteMutation } from "@/hooks/useData";
import { useForm } from "react-hook-form";
import type { Testimonial } from "@/types";
import Image from "next/image";
import { Plus, Edit2, Trash2, Loader2, X, Upload, Star, GripVertical } from "lucide-react";
import DeleteModal from "@/components/admin/DeleteModal";

export default function AdminTestimonialsPage() {
  const { data: testimonials, isLoading } = useAdminTestimonials();
  const createMut = useCreateMutation<Testimonial>("/api/admin/testimonials", ["admin", "testimonials"]);
  const updateMut = useUpdateMutation<Testimonial>("/api/admin/testimonials", ["admin", "testimonials"]);
  const deleteMut = useDeleteMutation("/api/admin/testimonials", ["admin", "testimonials"]);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const { register, handleSubmit, reset, setValue, watch } = useForm<any>();

  const openCreate = () => {
    setEditing(null);
    reset({ name: "", photo: "", university: "", program: "", country: "Bangladesh", quote: "", rating: 5, featured: true, isPublic: true, sortOrder: 0 });
    setShowForm(true);
  };

  const openEdit = (t: Testimonial) => {
    setEditing(t);
    reset(t);
    setShowForm(true);
  };

  const onSubmit = async (data: any) => {
    data.rating = Number(data.rating);
    data.sortOrder = Number(data.sortOrder) || 0;
    if (editing) {
      await updateMut.mutateAsync({ id: editing.id, data });
    } else {
      await createMut.mutateAsync(data);
    }
    setShowForm(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteMut.mutateAsync(deleteTarget.id);
    setDeleteTarget(null);
  };

  const handleUpload = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (!file) return;
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "images/testimonials");
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const result = await res.json();
      if (result.success) setValue("photo", result.data.url);
    };
    input.click();
  };

  const moveOrder = async (id: string, currentOrder: number, direction: "up" | "down") => {
    const newOrder = direction === "up" ? currentOrder - 1 : currentOrder + 1;
    await updateMut.mutateAsync({ id, data: { sortOrder: newOrder } });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary)]">Testimonials</h1>
          <p className="text-gray-500 text-sm mt-1">{testimonials?.length || 0} testimonials</p>
        </div>
        <button onClick={openCreate} className="btn-primary"><Plus size={18} /> Add Testimonial</button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mt-10 mb-10">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-[var(--primary)]">{editing ? "Edit" : "Add"} Testimonial</h2>
              <button onClick={() => setShowForm(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input {...register("name")} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">University</label>
                  <input {...register("university")} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Program</label>
                  <input {...register("program")} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <input {...register("country")} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                  <select {...register("rating")} className="input-field">
                    {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} ★</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
                <div className="flex gap-2">
                  <input {...register("photo")} className="input-field flex-1" placeholder="/images/testimonials/..." />
                  <button type="button" onClick={handleUpload} className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"><Upload size={16} /></button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Testimonial Quote *</label>
                <textarea {...register("quote")} rows={4} className="input-field resize-none" />
              </div>

              <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" {...register("featured")} className="w-4 h-4 accent-[var(--accent)]" />
                  <span className="text-sm text-gray-700">Featured</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" {...register("isPublic")} className="w-4 h-4 accent-[var(--accent)]" />
                  <span className="text-sm text-gray-700">Public</span>
                </label>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-700">Order:</label>
                  <input {...register("sortOrder")} type="number" className="input-field !w-20 !py-1" />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <button type="submit" disabled={createMut.isPending || updateMut.isPending} className="btn-primary">
                  {(createMut.isPending || updateMut.isPending) && <Loader2 size={16} className="animate-spin" />}
                  {editing ? "Update" : "Create"}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grid */}
      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin text-[var(--accent)]" /></div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials?.map((t) => (
            <div key={t.id} className="card p-5 relative group">
              <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(t)} className="p-1.5 bg-blue-50 rounded-lg text-blue-600 hover:bg-blue-100"><Edit2 size={14} /></button>
                <button onClick={() => setDeleteTarget({ id: t.id, name: t.name })} className="p-1.5 bg-red-50 rounded-lg text-red-600 hover:bg-red-100"><Trash2 size={14} /></button>
              </div>

              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 shrink-0">
                  {t.photo ? <Image src={t.photo} alt="" width={40} height={40} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-[var(--primary)] flex items-center justify-center text-white font-bold">{t.name[0]}</div>}
                </div>
                <div>
                  <p className="font-medium text-sm text-gray-800">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.university}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 line-clamp-3 italic">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center justify-between mt-3 pt-3 border-t">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={12} className={i < t.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"} />)}
                </div>
                <span className="text-xs text-gray-400">#{t.sortOrder}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {deleteTarget && (
        <DeleteModal
          title="Delete Testimonial"
          itemName={deleteTarget.name}
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
