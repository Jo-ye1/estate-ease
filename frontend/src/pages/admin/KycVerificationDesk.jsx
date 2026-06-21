import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/home/Navbar";
import { ShieldCheck, FileText, CheckCircle, XCircle } from "lucide-react";

export default function KycVerificationDesk() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({ id: "", reason: "" });
  const token = localStorage.getItem("token");

  const loadPendingKycData = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/admin/kyc/pending", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data?.success) {
        setSubmissions(res.data.submissions || []);
      }
    } catch (err) {
      console.error("Failed loading compliance log metrics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPendingKycData();
  }, []);

  const handleProcessKyc = async (id, statusValue) => {
    if (statusValue === "rejected" && !reviewForm.reason.trim()) {
      alert("Please specify a justification reason parameter for document rejection.");
      return;
    }
    try {
      setLoading(true);
      await axios.put(`http://localhost:5000/api/admin/kyc/review/${id}`, {
        status: statusValue,
        reason: reviewForm.reason
      }, { headers: { Authorization: `Bearer ${token}` } });
      
      alert(`Submission ticket evaluation marked ${statusValue} successfully!`);
      setReviewForm({ id: "", reason: "" });
      loadPendingKycData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed finalizing license review transaction.");
      setLoading(false);
    }
  };

  if (loading && submissions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans antialiased transition-colors duration-200">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">KYC Verification Desk</h1>
          <p className="text-xs text-slate-500 mt-1">Audit submitted corporate documentation parameters, validate regulatory licenses, and manage authorization levels.</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 md:p-6 shadow-3xs">
          <div className="flex items-center gap-2 mb-5 border-b border-slate-100 dark:border-slate-800 pb-3">
            <ShieldCheck className="w-4 h-4 text-purple-600" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-white">Pending License Registry Queue</h3>
          </div>

          <div className="w-full overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800">
            <table className="w-full text-left border-collapse text-xs md:text-sm min-w-[700px]">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase text-[10px] tracking-wide">
                  <th className="py-3 pl-4">Applicant Profile</th>
                  <th>Document Type</th>
                  <th>License Number Reference</th>
                  <th>Attachment Link</th>
                  <th className="text-right pr-4">Evaluation Control Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                {submissions.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-xs text-slate-400 font-medium">All corporate compliance queues cleared. Zero pending verification tickets outstanding.</td>
                  </tr>
                ) : (
                  submissions.map((ticket) => (
                    <tr key={ticket._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors">
                      <td className="py-4 pl-4">
                        <div className="font-bold text-slate-900 dark:text-white">{ticket.targetUser?.name || "Corporate User"}</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">{ticket.targetUser?.email}</div>
                      </td>
                      <td className="uppercase font-mono text-[10px] font-semibold text-slate-500">{ticket.documentType?.replace("_", " ")}</td>
                      <td className="font-mono font-bold text-slate-900 dark:text-white">{ticket.licenseNumber}</td>
                      <td>
                        <a href={`http://localhost:5000${ticket.documentUrl}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-blue-500 hover:underline">
                          <FileText size={12} /> View Document
                        </a>
                      </td>
                      <td className="py-4 text-right pr-4">
                        {reviewForm.id === ticket._id ? (
                          <div className="flex items-center gap-2 justify-end">
                            <input
                              type="text" placeholder="Specify failure reason..." value={reviewForm.reason} onChange={e => setReviewForm({ ...reviewForm, reason: e.target.value })}
                              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-1 text-xs outline-none focus:border-red-500 text-slate-800 dark:text-slate-100 w-44"
                            />
                            <button onClick={() => handleProcessKyc(ticket._id, "rejected")} className="p-1 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"><XCircle size={16} /></button>
                            <button onClick={() => setReviewForm({ id: "", reason: "" })} className="p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer text-[10px] font-bold uppercase">Cancel</button>
                          </div>
                        ) : (
                          <div className="flex gap-2 justify-end">
                            <button onClick={() => handleProcessKyc(ticket._id, "approved")} className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[11px] uppercase tracking-wide rounded-lg shadow-sm transition-all cursor-pointer">
                              <CheckCircle size={10} /> Approve
                            </button>
                            <button onClick={() => setReviewForm({ id: ticket._id, reason: "" })} className="inline-flex items-center gap-1 px-3 py-1 bg-rose-500 hover:bg-rose-600 text-white font-bold text-[11px] uppercase tracking-wide rounded-lg shadow-sm transition-all cursor-pointer">
                              <XCircle size={10} /> Reject
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
