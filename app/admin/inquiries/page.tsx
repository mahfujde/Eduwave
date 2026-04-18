"use client";

import { useState } from "react";
import { useAdminInquiries, useUpdateMutation, useDeleteMutation } from "@/hooks/useData";
import { getWhatsAppUrl, formatDate } from "@/lib/utils";
import { INQUIRY_STATUSES } from "@/constants/site";
import type { Inquiry } from "@/types";
import { Loader2, Eye, Trash2, MessageCircle, Download, X, Save } from "lucide-react";
import DeleteModal from "@/components/admin/DeleteModal";

export default function AdminInquiriesPage() {
  const { data: inquiries, isLoading } = useAdminInquiries();
  const updateMut = useUpdateMutation<Inquiry>("/api/admin/inquiries", ["admin", "inquiries"]);
  const deleteMut = useDeleteMutation("/api/admin/inquiries", ["admin", "inquiries"]);

  const [viewing, setViewing] = useState<Inquiry | null>(null);
  const [notes, setNotes] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const filtered = inquiries?.filter((i) => !statusFilter || i.status === statusFilter) || [];

  const openView = (inq: Inquiry) => {
    setViewing(inq);
    setNotes(inq.notes || "");
  };

  const updateStatus = async (id: string, status: string) => {
    await updateMut.mutateAsync({ id, data: { status } });
  };

  const saveNotes = async () => {
    if (!viewing) return;
    await updateMut.mutateAsync({ id: viewing.id, data: { notes } });
    setViewing({ ...viewing, notes });
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteMut.mutateAsync(deleteTarget.id);
    if (viewing?.id === deleteTarget.id) setViewing(null);
    setDeleteTarget(null);
  };

  const exportCSV = () => {
    if (!inquiries) return;
    const headers = ["Name", "Email", "Phone", "WhatsApp", "University", "Program", "Message", "Status", "Date"];
    const rows = inquiries.map((i) => [
      i.name, i.email, i.phone || "", i.whatsapp || "", i.university || "",
      i.program || "", (i.message || "").replace(/,/g, ";"), i.status,
      new Date(i.createdAt).toLocaleDateString(),
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `eduwave-inquiries-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary)]">Inquiries</h1>
          <p className="text-gray-500 text-sm mt-1">
            {inquiries?.length || 0} total • {inquiries?.filter((i) => i.status === "new").length || 0} new
          </p>
        </div>
        <div className="flex gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field !w-40 !py-2"
          >
            <option value="">All Status</option>
            {INQUIRY_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <button onClick={exportCSV} className="btn-secondary !py-2 text-sm">
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* Detail modal */}
      {viewing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mt-10 mb-10">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-[var(--primary)]">Inquiry Details</h2>
              <button onClick={() => setViewing(null)} className="p-1 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-xs text-gray-500">Name</p><p className="font-medium">{viewing.name}</p></div>
                <div><p className="text-xs text-gray-500">Email</p><a href={`mailto:${viewing.email}`} className="text-[var(--accent)]">{viewing.email}</a></div>
                {viewing.phone && <div><p className="text-xs text-gray-500">Phone</p><p>{viewing.phone}</p></div>}
                {viewing.whatsapp && <div><p className="text-xs text-gray-500">WhatsApp</p><p>{viewing.whatsapp}</p></div>}
                {viewing.university && <div><p className="text-xs text-gray-500">University</p><p>{viewing.university}</p></div>}
                {viewing.program && <div><p className="text-xs text-gray-500">Program</p><p>{viewing.program}</p></div>}
              </div>

              {viewing.message && (
                <div><p className="text-xs text-gray-500 mb-1">Message</p><p className="text-sm bg-gray-50 p-3 rounded-lg">{viewing.message}</p></div>
              )}

              <div>
                <p className="text-xs text-gray-500 mb-1">Status</p>
                <div className="flex gap-2 flex-wrap">
                  {INQUIRY_STATUSES.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => { updateStatus(viewing.id, s.value); setViewing({ ...viewing, status: s.value }); }}
                      className={`badge cursor-pointer ${viewing.status === s.value ? s.color : "bg-gray-100 text-gray-500"}`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">Internal Notes</p>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="input-field resize-none" placeholder="Add notes..." />
                <button onClick={saveNotes} className="btn-primary mt-2 text-sm !py-1.5"><Save size={14} /> Save Notes</button>
              </div>

              {/* WhatsApp quick link */}
              {(viewing.whatsapp || viewing.phone) && (
                <a
                  href={getWhatsAppUrl(viewing.whatsapp || viewing.phone || "", `Hi ${viewing.name}, this is Eduwave Educational Consultancy.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 bg-green-50 rounded-lg text-green-700 font-medium hover:bg-green-100 transition-colors"
                >
                  <MessageCircle size={18} /> Chat on WhatsApp
                </a>
              )}
            </div>
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
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Email</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">University</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((inq) => (
                  <tr key={inq.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">{inq.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{inq.email}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{inq.university || "—"}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`badge text-xs ${INQUIRY_STATUSES.find((s) => s.value === inq.status)?.color || "bg-gray-100"}`}>
                        {inq.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-xs text-gray-500">{formatDate(inq.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openView(inq)} className="p-2 hover:bg-blue-50 rounded-lg text-blue-600"><Eye size={16} /></button>
                        {(inq.whatsapp || inq.phone) && (
                          <a href={getWhatsAppUrl(inq.whatsapp || inq.phone || "")} target="_blank" rel="noopener noreferrer"
                             className="p-2 hover:bg-green-50 rounded-lg text-green-600"><MessageCircle size={16} /></a>
                        )}
                        <button onClick={() => setDeleteTarget({ id: inq.id, name: inq.name })} className="p-2 hover:bg-red-50 rounded-lg text-red-600"><Trash2 size={16} /></button>
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
          title="Delete Inquiry"
          itemName={deleteTarget.name}
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
