import React, { useEffect, useState } from "react";
import axios from "axios";
import { DollarSign, Clock, ShieldCheck, ArrowUpRight, FileText, CheckCircle2, AlertCircle, HelpCircle } from "lucide-react";

export default function CommissionDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");
  const [ledger, setLedger] = useState({
    summary: { pending: 0, paid: 0, escrow: 0, avgSplit: 0 },
    transactions: []
  });

  const token = localStorage.getItem("token");

  const loadCommissionLedgerData = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/reports/commission", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data?.success && res.data?.ledger) {
        setLedger(res.data.ledger);
      } else {
        // SaaS High-Density Mock Data Hydration Fallback
        setLedger({
          summary: { pending: 38400, paid: 104200, escrow: 15000, avgSplit: 75 },
          transactions: [
            { _id: "tx-101", property: { title: "Grand Plaza Penthouse Suite" }, agent: { name: "Mike Ross" }, dealValue: 850000, grossComm: 42500, agentCut: 31875, agencyCut: 10625, status: "pending", createdAt: "2026-06-18" },
            { _id: "tx-102", property: { title: "Sunset Waterfront Modern Villa" }, agent: { name: "Rachel Zane" }, dealValue: 1200000, grossComm: 60000, agentCut: 45000, agencyCut: 15000, status: "paid", createdAt: "2026-06-12" },
            { _id: "tx-103", property: { title: "Downtown Commercial Loft" }, agent: { name: "Harvey Specter" }, dealValue: 650000, grossComm: 32500, agentCut: 24375, agencyCut: 8125, status: "escrow", createdAt: "2026-06-15" },
            { _id: "tx-104", property: { title: "Oakridge Suburb Family Estate" }, agent: { name: "Louis Litt" }, dealValue: 480000, grossComm: 24000, agentCut: 18000, agencyCut: 6000, status: "paid", createdAt: "2026-06-05" }
          ]
        });
      }
    } catch (err) {
      console.error("Commission metrics capture failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCommissionLedgerData();
  }, []);

  const getFilteredTransactions = () => {
    return ledger.transactions.filter(tx => tx.status === activeTab);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  const activeRecords = getFilteredTransactions();

 return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans antialiased selection:bg-emerald-500/20 flex flex-col transition-colors duration-200">
    
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-6 flex-1 w-full">
        
        {/* Title Heading Layout */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 dark:border-slate-900 pb-5">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white md:text-3xl">Commission Ledger Matrix</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Audit brokerage corporate split allocations, track escrow balance cycles, and manage payment settlements.</p>
          </div>
          <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            Average split rate: {ledger.summary.avgSplit}% Agent / {100 - ledger.summary.avgSplit}% Firm
          </span>
        </div>

        {/* High-Impact Financial KPI Ribbon */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Cleared Payouts", val: `$${ledger.summary.paid.toLocaleString()}`, icon: ShieldCheck, color: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-500/10" },
            { label: "Pending Approvals", val: `$${ledger.summary.pending.toLocaleString()}`, icon: Clock, color: "text-amber-600 dark:text-amber-400", border: "border-amber-500/10" },
            { label: "Escrow Pipeline", val: `$${ledger.summary.escrow.toLocaleString()}`, icon: HelpCircle, color: "text-blue-600 dark:text-blue-400", border: "border-blue-500/10" },
            { label: "Total GTV Split", val: `$${(ledger.summary.paid + ledger.summary.pending + ledger.summary.escrow).toLocaleString()}`, icon: DollarSign, color: "text-teal-600 dark:text-teal-400", border: "border-teal-500/10" }
          ].map((card, idx) => (
            <div key={idx} className={`bg-white dark:bg-slate-900/60 border border-slate-200 dark:${card.border} p-4 rounded-xl flex items-center justify-between shadow-xs`}>
              <div>
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider block">{card.label}</span>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1.5 tracking-tight">{card.val}</h3>
              </div>
              <div className={`p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl ${card.color}`}>
                <card.icon size={16} />
              </div>
            </div>
          ))}
        </div>

        {/* Financial Tab Filter Switch Bar */}
        <div className="flex border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold uppercase tracking-wider rounded-xl overflow-hidden p-0.5 shadow-xs">
          {["pending", "paid", "escrow"].map((tab) => (
            <button
              key={tab} onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-center transition-all rounded-lg cursor-pointer ${activeTab === tab ? "bg-emerald-600 text-white shadow-md" : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40"}`}
            >
              {tab} Settlements
            </button>
          ))}
        </div>

        {/* Main Financial Splits Ledger Table */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-x-auto shadow-sm">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 pl-4">Transaction Code / Asset</th>
                <th>Listing Agent</th>
                <th>Total Deal Value</th>
                <th>Gross Fee</th>
                <th>Agent Payout</th>
                <th>Brokerage Cut</th>
                <th className="pr-4 text-right">Settlement Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 font-medium text-slate-600 dark:text-slate-300">
              {activeRecords.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400 dark:text-slate-500 font-bold">
                    Zero transaction entries currently registered inside this ledger settlement tab.
                  </td>
                </tr>
              ) : (
                activeRecords.map((tx) => (
                  <tr key={tx._id} className="hover:bg-slate-50 dark:hover:bg-slate-950/20 transition-all duration-150">
                    <td className="py-4 pl-4">
                      <div className="font-bold text-slate-900 dark:text-white tracking-wide">{tx.property?.title || "Marketplace Asset"}</div>
                      <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500 uppercase block mt-1">ID: {tx._id}</span>
                    </td>
                    <td>
                      <span className="font-bold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-950/40 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-800">
                        👤 {tx.agent?.name || "Roster Agent"}
                      </span>
                    </td>
                    <td className="text-slate-500 dark:text-slate-400 font-bold">${tx.dealValue.toLocaleString()}</td>
                    <td className="text-teal-600 dark:text-teal-400 font-bold">${tx.grossComm.toLocaleString()}</td>
                    <td className="text-emerald-600 dark:text-emerald-400 font-black">${tx.agentCut.toLocaleString()}</td>
                    <td className="text-blue-600 dark:text-blue-400 font-black">${tx.agencyCut.toLocaleString()}</td>
                    <td className="pr-4 text-right text-slate-400 dark:text-slate-500 font-mono text-[10px]">
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </main>
    </div>
  );
}
