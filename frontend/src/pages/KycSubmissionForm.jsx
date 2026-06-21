import React, { useState } from "react";
import axios from "axios";
import { ShieldCheck, UploadCloud, FileText, AlertCircle, CheckCircle, XCircle, Clock } from "lucide-react";

export default function KycSubmissionForm({ currentStatus, rejectionReason, onRefresh }) {
  const [form, setForm] = useState({ documentType: "corporate_license", licenseNumber: "", documentUrl: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = localStorage.getItem("token");

  const status = currentStatus ? String(currentStatus).toLowerCase().trim() : "unverified";

  const handleDocumentUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsSubmitting(true);
      const res = await axios.post("http://localhost:5000/api/properties/upload-doc", formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });
      if (res.data?.fileUrl || res.data?.url) {
        setForm({ ...form, documentUrl: res.data.fileUrl || res.data.url });
        alert("Verification document asset uploaded successfully!");
      }
    } catch (err) {
      alert("Document upload failed. Ensure server directory permissions are open.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitKyc = async (e) => {
    e.preventDefault();
    if (!form.licenseNumber.trim() || !form.documentUrl) {
      alert("Please complete all verification fields and upload your license file.");
      return;
    }

    try {
      setIsSubmitting(true);
      await axios.post("http://localhost:5000/api/admin/kyc/submit-profile", form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("KYC Credentials dispatched to admin registry desk! Evaluation status set to pending review.");
      if (typeof onRefresh === "function") onRefresh();
    } catch (err) {
      alert(err.response?.data?.message || "Failed dispatching verification token details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#0b1329] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-md max-w-xl text-xs text-slate-800 dark:text-slate-100 font-sans space-y-5 text-left transition-all">
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800/80 pb-3">
        <ShieldCheck className="text-purple-500" size={20} />
        <div>
          <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-900 dark:text-white">Profile Trust Verification Gate</h3>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Submit or track your regulatory documents to clear platform restrictions.</p>
        </div>
      </div>

      {/* ⏳ STATE 1: PENDING CONTROL CARD */}
      {status === "pending" && (
        <div className="p-4 rounded-xl border bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400 space-y-1">
          <div className="flex items-center gap-2 font-black uppercase tracking-wide text-[10px]">
            <Clock size={14} /> Documents Pending Review
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
            Your verification documents have been received and are currently queued for administrative audit. Form inputs are temporarily locked during this check.
          </p>
        </div>
      )}

      {/* 🟢 STATE 2: APPROVED SUCCESS CARD */}
      {status === "approved" && (
        <div className="p-4 rounded-xl border bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400 space-y-1">
          <div className="flex items-center gap-2 font-black uppercase tracking-wide text-[10px]">
            <CheckCircle size={14} /> Verification Approved
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
            Congratulations! Your real estate license and profile credentials have passed validation checks. A verification trust badge has been assigned to your account.
          </p>
        </div>
      )}

      {/* 🔴 STATE 3: REJECTED CARD */}
      {status === "rejected" && (
        <div className="p-4 rounded-xl border bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400 space-y-1">
          <div className="flex items-center gap-2 font-black uppercase tracking-wide text-[10px]">
            <XCircle size={14} /> Submission Refused / Action Required
          </div>
          <p className="text-[11px] font-medium text-slate-800 dark:text-slate-200">
            Reason: <span className="italic font-normal text-slate-500 dark:text-slate-400">{rejectionReason || "Uploaded file text criteria un-readable."}</span>
          </p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
            Please adjust your parameters, attach a clear digital certification file copy, and re-transmit below.
          </p>
        </div>
      )}

      {/* 📄 SUBMISSION FORM BLOCK: Rendered if unverified OR rejected */}
      {(status === "unverified" || status === "rejected") && (
        <form onSubmit={handleSubmitKyc} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 dark:text-slate-400 mb-1.5">Document Classification</label>
              <select 
                value={form.documentType} 
                onChange={e => setForm({ ...form, documentType: e.target.value })} 
                className="w-full bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl px-3 h-11 text-xs font-semibold focus:outline-none focus:border-blue-500 text-slate-700 dark:text-slate-300 outline-none cursor-pointer"
              >
                <option value="corporate_license" className="bg-white text-slate-800 dark:bg-[#0b1329] dark:text-slate-300">Corporate Brokerage License</option>
                <option value="agent_credentials" className="bg-white text-slate-800 dark:bg-[#0b1329] dark:text-slate-300">Agent Identification Badge</option>
                <option value="passport_id" className="bg-white text-slate-800 dark:bg-[#0b1329] dark:text-slate-300">Government Passport / ID</option>
                <option value="tax_filing" className="bg-white text-slate-800 dark:bg-[#0b1329] dark:text-slate-300">Tax Assessment Registration</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 dark:text-slate-400 mb-1.5">License Registry Number</label>
              <input 
                type="text" 
                placeholder="e.g. LIC-98742-USA" 
                value={form.licenseNumber} 
                onChange={e => setForm({ ...form, licenseNumber: e.target.value })} 
                className="w-full bg-slate-50 dark:bg-[#0b1329] border border-slate-200 dark:border-slate-800 rounded-xl px-3 h-11 text-xs font-semibold focus:outline-none focus:border-blue-500 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 outline-none" 
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 dark:text-slate-400 mb-1.5">Attach Digital Certification File (PDF, PNG)</label>
            <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 rounded-2xl p-6 text-center hover:bg-slate-100/50 dark:hover:bg-slate-950/40 transition-all relative group cursor-pointer">
              <input type="file" onChange={handleDocumentUpload} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" accept=".pdf,.png,.jpg,.jpeg" />
              <UploadCloud className="mx-auto text-slate-400 dark:text-slate-500 group-hover:text-blue-500 transition-colors mb-2" size={24} />
              <span className="font-extrabold text-slate-600 dark:text-slate-300 block text-xs">
                {form.documentUrl ? "🎉 Document Linked Successfully!" : "Drag & drop file or click workspace window"}
              </span>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Maximum boundary limit: 10MB transmission size.</p>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting || !form.documentUrl} 
            className="w-full h-11 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-100 dark:disabled:bg-slate-800/60 disabled:text-slate-400 dark:disabled:text-slate-500 font-extrabold text-white uppercase tracking-wider rounded-xl shadow-md transition-all border-0 cursor-pointer flex items-center justify-center gap-2"
          >
            <FileText size={14} />
            <span>{isSubmitting ? "Processing payload..." : "Transmit Documentation to Compliance Desk"}</span>
          </button>
        </form>
      )}
    </div>
  );
}
