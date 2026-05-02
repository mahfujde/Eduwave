"use client";

import { useState, useEffect, useRef } from "react";
import { Image as ImageIcon, Upload, Trash2, Copy, Check, Loader2, FileText, Film, FolderOpen } from "lucide-react";
import DeleteModal from "@/components/admin/DeleteModal";
import { useToast } from "@/hooks/useToast";

const FOLDERS = ["general", "universities", "programs", "blog", "testimonials", "cms"];

function formatBytes(bytes?: number | null) {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AdminMediaPage() {
  const [files, setFiles]     = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const toast = useToast();
  const [folder, setFolder]   = useState("general");
  const [filter, setFilter]   = useState("all");
  const [copied, setCopied]   = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchFiles = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/media");
    const d   = await res.json();
    if (d.success) setFiles(d.data);
    setLoading(false);
  };
  useEffect(() => { fetchFiles(); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = Array.from(e.target.files ?? []);
    if (!fileList.length) return;
    setUploading(true);
    for (const file of fileList) {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", folder);
      await fetch("/api/admin/media", { method: "POST", body: fd });
    }
    await fetchFiles();
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  const copyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(window.location.origin + url);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const deleteFile = async () => {
    if (!deleteTarget) return;
    await fetch(`/api/admin/media?id=${deleteTarget.id}`, { method: "DELETE" });
    fetchFiles();
    setDeleteTarget(null);
  };

  const filtered = filter === "all" ? files : files.filter(f => f.type === filter || f.folder === filter);

  const FileIcon = ({ type }: { type: string }) => {
    if (type === "image")    return <ImageIcon size={20} className="text-blue-500" />;
    if (type === "video")    return <Film size={20} className="text-purple-500" />;
    return <FileText size={20} className="text-orange-500" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary)]">Media Library</h1>
          <p className="text-gray-500 text-sm mt-1">{files.length} files stored</p>
        </div>
        <button onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="btn-primary">
          {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
          Upload Files
        </button>
        <input ref={inputRef} type="file" multiple accept="image/*,video/*,.pdf,.doc,.docx" className="hidden" onChange={handleUpload} />
      </div>

      {/* Upload controls */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <FolderOpen size={16} className="text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Upload to folder:</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {FOLDERS.map(f => (
              <button key={f} onClick={() => setFolder(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
                  ${folder === f ? "bg-[var(--primary)] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                {f}
              </button>
            ))}
          </div>
          {/* Drag drop zone */}
          <div
            className="flex-1 min-w-48 border-2 border-dashed border-gray-200 rounded-xl p-4 text-center cursor-pointer hover:border-[var(--accent)] hover:bg-[var(--accent)]/5 transition-all"
            onClick={() => inputRef.current?.click()}
            onDragOver={e => e.preventDefault()}
            onDrop={e => {
              e.preventDefault();
              const dt = e.dataTransfer.files;
              if (dt && inputRef.current) {
                // trigger change manually
                const mockEvent = { target: { files: dt } } as any;
                handleUpload(mockEvent);
              }
            }}
          >
            {uploading
              ? <p className="text-sm text-[var(--accent)] flex items-center justify-center gap-2"><Loader2 size={14} className="animate-spin" /> Uploading…</p>
              : <p className="text-sm text-gray-400">Drag & drop files here or <span className="text-[var(--accent)] font-medium">browse</span></p>}
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {["all","image","video","document"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors
              ${filter === f ? "bg-[var(--primary)] text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin text-[var(--accent)]" /></div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center border border-dashed border-gray-200">
          <ImageIcon size={48} className="mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 font-medium">No files yet</p>
          <p className="text-gray-400 text-sm mt-1">Upload your first file using the button above</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filtered.map((file: any) => (
            <div key={file.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-all">
              {/* Preview */}
              <div className="aspect-square bg-gray-50 flex items-center justify-center overflow-hidden relative">
                {file.type === "image" ? (
                  <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                ) : (
                  <FileIcon type={file.type} />
                )}
                {/* Overlay actions */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button onClick={() => copyUrl(file.url, file.id)}
                    className="p-2 bg-white rounded-lg hover:bg-gray-100" title="Copy URL">
                    {copied === file.id ? <Check size={14} className="text-green-600" /> : <Copy size={14} className="text-gray-700" />}
                  </button>
                  <button onClick={() => setDeleteTarget({ id: file.id, name: file.name })}
                    className="p-2 bg-white rounded-lg hover:bg-red-50" title="Delete">
                    <Trash2 size={14} className="text-red-500" />
                  </button>
                </div>
              </div>
              {/* Info */}
              <div className="p-2.5">
                <p className="text-xs font-medium text-gray-700 truncate">{file.name}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[10px] text-gray-400">{formatBytes(file.size)}</span>
                  <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">{file.folder}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {deleteTarget && (
        <DeleteModal
          title="Delete File"
          itemName={deleteTarget.name}
          warning="This file will be permanently removed."
          onConfirm={deleteFile}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
