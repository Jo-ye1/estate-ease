import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Navbar from "@/components/home/Navbar";
import { CreditCard, Calendar, CheckCircle, Receipt, ArrowRight } from "lucide-react";

export default function BillingPage() {
  const [billingData, setBillingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBilling = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const urlParams = new URLSearchParams(window.location.search);
        const sessionId = urlParams.get("session_id");
        const planName = urlParams.get("planName");
        const amount = urlParams.get("amount");

        if (sessionId && planName && amount) {
          await fetch("http://localhost:5000/api/billing/webhook/success", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ planName, amount }),
          });
          
          window.history.replaceState({}, document.title, window.location.pathname);
        }

        const response = await fetch("http://localhost:5000/api/billing/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch billing data");
        }

        const data = await response.json();
        setBillingData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBilling();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString || dateString === "...") return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <Navbar />
        <div className="flex justify-center items-center h-[calc(100vh-80px)]">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 p-6 rounded-2xl inline-block max-w-md">
            <h3 className="font-black text-red-800 dark:text-red-400 text-lg">Billing Interface Error</h3>
            <p className="text-sm text-red-600 dark:text-red-500 mt-2">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const subscription = billingData?.subscription;
  const invoices = billingData?.billing || [];

  const currentPlanName = typeof subscription?.plan === 'object' 
    ? (subscription?.plan?.name || "Free") 
    : (subscription?.plan || "Free");

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">
            Billing & Subscriptions
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review your SaaS account subscription level, upcoming invoices, and historical ledger.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Active Plan
                  </p>
                  <h2 className="text-2xl font-black mt-1 text-slate-900 dark:text-white">
                    {currentPlanName} Membership
                  </h2>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  subscription?.status?.toLowerCase() === "active" 
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/30"
                    : "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border border-amber-200 dark:border-amber-900/30"
                }`}>
                  {subscription?.status || "active"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                    <CreditCard size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Monthly Rate</p>
                    <p className="text-sm font-black text-slate-800 dark:text-slate-200">
                      ${typeof subscription?.plan === 'object' 
                        ? (subscription?.plan?.price || 0) 
                        : (invoices[0]?.amount || 0)} / month
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
                    <Calendar size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Renews On</p>
                    <p className="text-sm font-black text-slate-800 dark:text-slate-200">
                      {formatDate(subscription?.expiresAt || subscription?.nextBillingDate)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800/60 flex justify-end">
              <button 
                onClick={() => navigate("/pricing")}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
              >
                Manage Plan Options
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Tier Allocation
              </p>
              <h3 className="text-lg font-black mt-1 text-slate-900 dark:text-white">
                Workspace Capacity
              </h3>
              
              <ul className="mt-4 space-y-3">
                <li className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                  <CheckCircle size={14} className="text-blue-500" />
                  {currentPlanName === "Enterprise" ? "Unlimited Property Uploads" : "Tier Standard Limits Active"}
                </li>
                <li className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                  <CheckCircle size={14} className="text-blue-500" />
                  Advanced Real-Time Metrics
                </li>
                <li className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                  <CheckCircle size={14} className="text-blue-500" />
                  Priority Workspace Support
                </li>
              </ul>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-800/40 text-[11px] font-medium text-slate-400 mt-4">
              Enterprise features are globally enabled via backend seeder sync layer operations.
            </div>
          </div>
        </div>

        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
            <Receipt size={16} className="text-slate-400" />
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
              Invoice Ledger History
            </h2>
          </div>

          {invoices.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="bg-slate-50/70 dark:bg-slate-950/40 border-b border-slate-100 dark:border-slate-800 font-bold text-slate-400 text-xs uppercase tracking-wider">
                    <th className="p-4">Billing Date</th>
                    <th className="p-4">Amount Invoiced</th>
                    <th className="p-4 text-right">Status Badge</th>
                  </tr>
                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {invoices.map((invoice, index) => (
                    <tr key={invoice._id || index} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors font-medium">
                      <td className="p-4 text-xs font-bold text-slate-700 dark:text-slate-300">
                        {formatDate(invoice.billingDate)}
                      </td>
                      <td className="p-4 text-xs font-black text-slate-900 dark:text-white">
                        ${invoice.amount} USD
                      </td>
                      <td className="p-4 text-right">
                        <span className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider ${
                          invoice.status === "paid"
                            ? "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
                            : "bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400"
                        }`}>
                          {invoice.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
              No subscription payment history available on this account thread.
            </div>
          )}
        </section>
        </main>
    </div>
  );
}
