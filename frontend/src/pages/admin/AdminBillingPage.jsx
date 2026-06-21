import React, { useState, useEffect } from "react";
import Navbar from "@/components/home/Navbar";
import axios from "axios";
import { Landmark, Receipt, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminBillingPage() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllInvoices = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        
        const res = await axios.get("http://localhost:5000/api/subscriptions/admin/all", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const allSubsData = res.data?.subscriptions || res.data || [];
        setInvoices(allSubsData);
      } catch (err) {
        console.error("Admin billing load error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllInvoices();
  }, []);

  const totalGrossSaaSEarnings = invoices.reduce((acc, current) => {
    const planPrice = current?.plan?.price || current?.price || 0;
    return acc + Number(planPrice);
  }, 0);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#070d19] flex flex-col">
        <Navbar />
        <div className="flex-1 flex justify-center items-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070d19] text-slate-800 dark:text-slate-100 font-sans antialiased transition-colors duration-200">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs uppercase tracking-widest">
              <Landmark size={14} /> Finance Hub
            </div>
            <h1 className="text-3xl font-black mt-1 tracking-tight text-slate-900 dark:text-white">Platform Revenue Matrix</h1>
            <p className="text-sm text-slate-500 mt-1">Review unified company gross income streams and process invoice audits.</p>
          </div>
          
          <button
            onClick={() => navigate("/admin/subscriptions")}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-colors shadow-xs shrink-0 self-start sm:self-center"
          >
            Manage Subscriptions Ledger
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <p className="text-xs uppercase text-slate-400 font-black tracking-wider">Gross Platform Intake Revenue</p>
            <h3 className="text-4xl font-black mt-2 text-emerald-600 dark:text-emerald-400">${totalGrossSaaSEarnings} USD</h3>
          </div>
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <p className="text-xs uppercase text-slate-400 font-black tracking-wider">Processed Settled Invoices</p>
            <h3 className="text-4xl font-black mt-2 text-slate-900 dark:text-white">{invoices.length} Paid Runs</h3>
          </div>
        </div>

        <section className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-md overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
            <Receipt size={16} className="text-slate-400" />
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-400">Platform Transaction Audit Ledger</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-[#090f1c] border-b border-slate-200 dark:border-slate-800 font-bold text-slate-400 uppercase tracking-wider">
                  <th className="p-4">Subscriber User</th>
                  <th className="p-4">Assigned Plan</th>
                  <th className="p-4">Settled Amount</th>
                  <th className="p-4 text-right">Status Badge</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {invoices.map((inv, idx) => {
                  const planPrice = inv?.plan?.price || inv?.price || 0;
                  const planTitle = inv?.plan?.name || "Premium";
                  const clientName = inv?.user?.name || "Subscriber Account";

                  return (
                    <tr key={inv._id || idx} className="hover:bg-slate-50/50 dark:hover:bg-[#0c1322] transition-colors font-medium">
                      <td className="p-4 text-slate-700 dark:text-slate-300">
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{clientName}</p>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{inv?.user?.email || "No Email Passed"}</p>
                          <p className="text-[9px] text-slate-400 dark:text-slate-600 mt-1 font-semibold">Processed: {formatDate(inv?.startedAt || inv?.createdAt)}</p>
                        </div>
                      </td>
                      <td className="p-4 text-xs font-bold text-blue-500 dark:text-blue-400 uppercase tracking-wider">
                        {planTitle} Plan
                      </td>
                      <td className="p-4 font-black text-slate-900 dark:text-white">${planPrice} USD</td>
                      <td className="p-4 text-right">
                        <span className="inline-block px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider text-[10px]">
                          {inv.status || "active"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
