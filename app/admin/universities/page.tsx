"use client";

import { useState } from "react";
import { useAdminUniversities, useCreateMutation, useUpdateMutation, useDeleteMutation } from "@/hooks/useData";
import { useForm } from "react-hook-form";
import type { University } from "@/types";
import { generateSlug } from "@/lib/utils";
import { Plus, Edit2, Trash2, Eye, EyeOff, Star, Loader2, X, Upload } from "lucide-react";
import DeleteModal from "@/components/admin/DeleteModal";
import Image from "next/image";

export default function AdminUniversitiesPage() {
  const { data: universities, isLoading } = useAdminUniversities();
  const createMut = useCreateMutation<University>("/api/admin/universities", ["admin", "universities"]);
  const updateMut = useUpdateMutation<University>("/api/admin/universities", ["admin", "universities"]);
  const deleteMut = useDeleteMutation("/api/admin/universities", ["admin", "universities"]);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<University | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const { register, handleSubmit, reset, setValue, watch } = useForm<any>();

  const openCreate = () => {
    setEditing(null);
    reset({
      name: "", slug: "", shortName: "", description: "", country: "Malaysia", city: "",
      website: "", logo: "", banner: "", ranking: "", established: "", type: "Private",
      campusTourVideo: "", offerLetter: true, featured: false, isPublic: true,
    });
    setShowForm(true);
  };

  const openEdit = (uni: University) => {
    setEditing(uni);
    reset(uni);
    setShowForm(true);
  };

  const onSubmit = async (data: any) => {
    if (!data.slug) data.slug = generateSlug(data.name);
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

  const handleUpload = async (field: string) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (!file) return;
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "images/universities");
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const result = await res.json();
      if (result.success) setValue(field, result.data.url);
    };
    input.click();
  };

  const nameVal = watch("name");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary)]">Universities</h1>
          <p className="text-gray-500 text-sm mt-1">{universities?.length || 0} universities</p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <Plus size={18} /> Add University
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mt-10 mb-10">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-[var(--primary)]">
                {editing ? "Edit University" : "Add University"}
              </h2>
              <button onClick={() => setShowForm(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input {...register("name")} className="input-field" placeholder="University name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Short Name</label>
                  <input {...register("shortName")} className="input-field" placeholder="e.g., MMU" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                  <input {...register("slug")} className="input-field" placeholder="auto-generated" />
                  <p className="text-xs text-gray-400 mt-1">Leave blank to auto-generate</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <input {...register("country")} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input {...register("city")} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  <input {...register("website")} className="input-field" placeholder="https://" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ranking</label>
                  <input {...register("ranking")} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Established</label>
                  <input {...register("established")} className="input-field" placeholder="e.g., 1996" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select {...register("type")} className="input-field">
                    <option value="Private">Private</option>
                    <option value="Public">Public</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea {...register("description")} rows={4} className="input-field resize-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">🎬 Campus Tour Video (YouTube URL)</label>
                <input {...register("campusTourVideo")} className="input-field" placeholder="https://www.youtube.com/watch?v=..." />
                <p className="text-xs text-gray-400 mt-1">Paste a YouTube video link. Will appear as a "Campus Tour" tab on the university page.</p>
              </div>

              {/* Logo upload */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
                  <div className="flex gap-2">
                    <input {...register("logo")} className="input-field flex-1" placeholder="/images/..." />
                    <button type="button" onClick={() => handleUpload("logo")} className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200">
                      <Upload size={16} />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Banner</label>
                  <div className="flex gap-2">
                    <input {...register("banner")} className="input-field flex-1" placeholder="/images/..." />
                    <button type="button" onClick={() => handleUpload("banner")} className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200">
                      <Upload size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" {...register("offerLetter")} className="w-4 h-4 accent-[var(--accent)]" />
                  <span className="text-sm text-gray-700">Offer Letter</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" {...register("featured")} className="w-4 h-4 accent-[var(--accent)]" />
                  <span className="text-sm text-gray-700">Featured</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" {...register("isPublic")} className="w-4 h-4 accent-[var(--accent)]" />
                  <span className="text-sm text-gray-700">Public</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <button type="submit" disabled={createMut.isPending || updateMut.isPending} className="btn-primary">
                  {(createMut.isPending || updateMut.isPending) && <Loader2 size={16} className="animate-spin" />}
                  {editing ? "Update" : "Create"}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                  Cancel
                </button>
              </div>
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
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">University</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Location</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Programs</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {universities?.map((uni) => (
                  <tr key={uni.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                          {uni.logo ? (
                            <Image src={uni.logo} alt="" width={40} height={40} className="object-contain p-1" />
                          ) : (
                            <span className="text-sm font-bold text-gray-400">{uni.name[0]}</span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 text-sm">{uni.name}</p>
                          <p className="text-xs text-gray-400">{uni.shortName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{uni.city}, {uni.country}</td>
                    <td className="px-4 py-3 text-center text-sm text-gray-600">{uni._count?.programs || 0}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {uni.featured && <Star size={14} className="text-amber-500 fill-amber-500" />}
                        {uni.isPublic ? (
                          <Eye size={14} className="text-green-500" />
                        ) : (
                          <EyeOff size={14} className="text-gray-400" />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(uni)} className="p-2 hover:bg-blue-50 rounded-lg text-blue-600" title="Edit">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => setDeleteTarget({ id: uni.id, name: uni.name })} className="p-2 hover:bg-red-50 rounded-lg text-red-600" title="Delete">
                          <Trash2 size={16} />
                        </button>
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
          title="Delete University"
          itemName={deleteTarget.name}
          warning="This will also delete all associated programs."
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
