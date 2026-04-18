"use client";

import { useState } from "react";
import { useAdminBlog, useCreateMutation, useUpdateMutation, useDeleteMutation } from "@/hooks/useData";
import { useForm } from "react-hook-form";
import type { BlogPost } from "@/types";
import { generateSlug, formatDate } from "@/lib/utils";
import { Plus, Edit2, Trash2, Loader2, X, Upload, Eye, EyeOff } from "lucide-react";
import DeleteModal from "@/components/admin/DeleteModal";

export default function AdminBlogPage() {
  const { data: posts, isLoading } = useAdminBlog();
  const createMut = useCreateMutation<BlogPost>("/api/admin/blog", ["admin", "blog"]);
  const updateMut = useUpdateMutation<BlogPost>("/api/admin/blog", ["admin", "blog"]);
  const deleteMut = useDeleteMutation("/api/admin/blog", ["admin", "blog"]);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const { register, handleSubmit, reset, setValue } = useForm<any>();

  const openCreate = () => {
    setEditing(null);
    reset({
      title: "", slug: "", excerpt: "", content: "", coverImage: "", tags: "",
      author: "Eduwave Team", isPublished: false, metaTitle: "", metaDesc: "",
    });
    setShowForm(true);
  };

  const openEdit = (post: BlogPost) => {
    setEditing(post);
    reset(post);
    setShowForm(true);
  };

  const onSubmit = async (data: any) => {
    if (!data.slug) data.slug = generateSlug(data.title);
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
      formData.append("folder", "images/blog");
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const result = await res.json();
      if (result.success) setValue("coverImage", result.data.url);
    };
    input.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary)]">Blog Posts</h1>
          <p className="text-gray-500 text-sm mt-1">{posts?.length || 0} posts</p>
        </div>
        <button onClick={openCreate} className="btn-primary"><Plus size={18} /> New Post</button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl mt-10 mb-10">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-[var(--primary)]">{editing ? "Edit Post" : "New Post"}</h2>
              <button onClick={() => setShowForm(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                  <input {...register("title")} className="input-field" placeholder="Blog post title" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                  <input {...register("slug")} className="input-field" placeholder="auto-generated" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                  <input {...register("author")} className="input-field" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>
                <div className="flex gap-2">
                  <input {...register("coverImage")} className="input-field flex-1" placeholder="/images/blog/..." />
                  <button type="button" onClick={handleUpload} className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"><Upload size={16} /></button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
                <textarea {...register("excerpt")} rows={2} className="input-field resize-none" placeholder="Short summary..." />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content (HTML/Markdown)</label>
                <textarea {...register("content")} rows={12} className="input-field resize-none font-mono text-sm" placeholder="Write your blog post content..." />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
                  <input {...register("tags")} className="input-field" placeholder="study abroad, malaysia" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SEO Title</label>
                  <input {...register("metaTitle")} className="input-field" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SEO Description</label>
                <textarea {...register("metaDesc")} rows={2} className="input-field resize-none" />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" {...register("isPublished")} className="w-4 h-4 accent-[var(--accent)]" />
                <span className="text-sm text-gray-700 font-medium">Publish immediately</span>
              </label>

              <div className="flex gap-3 pt-4 border-t">
                <button type="submit" disabled={createMut.isPending || updateMut.isPending} className="btn-primary">
                  {(createMut.isPending || updateMut.isPending) && <Loader2 size={16} className="animate-spin" />}
                  {editing ? "Update Post" : "Create Post"}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Posts Table */}
      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin text-[var(--accent)]" /></div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Title</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Author</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {posts?.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">{post.title}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{post.author}</td>
                    <td className="px-4 py-3 text-center">
                      {post.isPublished ? (
                        <span className="badge bg-green-100 text-green-800"><Eye size={12} className="mr-1" /> Published</span>
                      ) : (
                        <span className="badge bg-gray-100 text-gray-600"><EyeOff size={12} className="mr-1" /> Draft</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center text-xs text-gray-500">{formatDate(post.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(post)} className="p-2 hover:bg-blue-50 rounded-lg text-blue-600"><Edit2 size={16} /></button>
                        <button onClick={() => setDeleteTarget({ id: post.id, name: post.title })} className="p-2 hover:bg-red-50 rounded-lg text-red-600"><Trash2 size={16} /></button>
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
          title="Delete Blog Post"
          itemName={deleteTarget.name}
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
