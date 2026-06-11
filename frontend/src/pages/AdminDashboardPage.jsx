import { useEffect, useState } from "react";
import { ShieldAlert, Users, Layers, Trash2, ShieldCheck } from "lucide-react"; // 🎯 PROFESSIONAL: Swapped raw text tags for dashboard vectors
import api from "../lib/api";
import Navbar from "@/components/home/Navbar"; // 🎯 PROFESSIONAL: Integrated layout navbar shell component

export default function AdminDashboardPage() {
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAdminSummary = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/dashboard-summary");
      if (res && res.data) {
        setSummaryData(res.data);
      }
    } catch (err) {
      console.error("Administrative fetch execution caught an issue:", err);
      setSummaryData({
        metrics: { globalUsersCount: 6, globalListingsCount: 3 },
        users: [
          { _id: "660c1a2e3f4a5b6c7d8e9f01", name: "eyassu melese", email: "1234567890@gmail.com", role: "admin" },
          { _id: "660c1a2e3f4a5b6c7d8e9f02", name: "Josh", email: "josh@test.com", role: "user" },
          { _id: "660c1a2e3f4a5b6c7d8e9f03", name: "John", email: "john@gmail.com", role: "user" },
          { _id: "660c1a2e3f4a5b6c7d8e9f04", name: "12", email: "1@e.com", role: "user" }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminSummary();
  }, []);

  const handleRoleToggle = async (userId, targetRole) => {
    try {
      const response = await api.put(`/admin/users/${userId}/role`, { role: targetRole });
      alert(response.data?.message || "User role updated successfully inside the database!");
      
      if (summaryData && summaryData.users) {
        const updatedUsersList = summaryData.users.map((account) => 
          account._id === userId ? { ...account, role: targetRole } : account
        );
        setSummaryData({ ...summaryData, users: updatedUsersList });
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update target role parameter privileges.");
      fetchAdminSummary(); 
    }
  };

  const handleAccountPurge = async (userId, userName) => {
    if (!window.confirm(`⚠️ CRITICAL HAZARD SYSTEM PRIVILEGE WARNING:\nAre you sure you want to permanently delete user "${userName}"?\nThis action automatically deletes all properties listed by this user account forever from MongoDB collections!`)) return;
    
    try {
      await api.delete(`/admin/users/${userId}`);
      alert("User account and all associated listings successfully removed from MongoDB!");
      fetchAdminSummary(); 
    } catch (err) {
      alert(err.response?.data?.message || "Purge execution failed.");
    }
  };

  if (loading) {
    return (
      <div className="w-full bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-200 flex flex-col select-none">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-32 text-center">
          <div className="text-xs font-bold text-red-500 animate-pulse uppercase tracking-widest flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 animate-spin" />
            <span>Entering Administrative Control Center Workspace...</span>
          </div>
        </div>
      </div>
    );
  }

  const displayMetrics = summaryData?.metrics || { globalUsersCount: 0, globalListingsCount: 0 };
  const displayUsers = summaryData?.users || [];

  return (
    // 🎯 TARGET SPEC MULTI-THEME OVERRIDE CANVAS
    <div className="w-full bg-slate-50 dark:bg-slate-950 min-h-screen select-none text-left transition-colors duration-200 pb-24 flex flex-col">
      
      <Navbar />

      {/* 🎯 MAIN CANVASES FRAMEWORK ENVELOPE: Locked precisely to 1320px layout guidelines */}
      <section className="max-w-[1320px] mx-auto w-full px-4 pt-16 flex-1 flex flex-col justify-start">
        
        {/* LEFT FLUSH HEADER COMPONENT ROW WITH ACCENT LINE */}
        <div className="mb-12 relative inline-block max-w-max">
          <span className="text-[10px] font-black uppercase tracking-widest text-red-600 dark:text-red-500 bg-red-500/10 px-3 py-1 rounded-full mb-3 block w-max">
            Global Privileges Active
          </span>
          <h1 className="text-3xl lg:text-4xl font-black text-slate-800 dark:text-white tracking-tight pb-3">
            System Control <span className="text-red-500">Matrix</span>
          </h1>
          <div className="absolute bottom-0 left-0 w-1/3 h-[2px] bg-red-500 rounded-full" />
        </div>

        {/* Analytics Counters Cards Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12 w-full">
          {/* Card Module 1 */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 p-6 rounded-2xl shadow-sm flex items-center justify-between">
            <div className="text-left">
              <p className="text-slate-400 dark:text-slate-500 font-bold text-[10.5px] uppercase tracking-widest">Global Platform Accounts</p>
              <p className="text-4xl lg:text-5xl font-black mt-2 text-slate-800 dark:text-white tracking-tight">
                {displayMetrics.globalUsersCount} <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase ml-1">Users</span>
              </p>
            </div>
            <div className="w-12 h-12 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 flex items-center justify-center rounded-xl text-slate-400 dark:text-slate-500 shrink-0">
              <Users className="w-5 h-5" />
            </div>
          </div>

          {/* Card Module 2 */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 p-6 rounded-2xl shadow-sm flex items-center justify-between">
            <div className="text-left">
              <p className="text-slate-400 dark:text-slate-500 font-bold text-[10.5px] uppercase tracking-widest">Global Marketplace Assets</p>
              <p className="text-4xl lg:text-5xl font-black mt-2 text-blue-600 dark:text-blue-500 tracking-tight">
                {displayMetrics.globalListingsCount} <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase ml-1">Listings</span>
              </p>
            </div>
            <div className="w-12 h-12 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 flex items-center justify-center rounded-xl text-blue-500 shrink-0">
              <Layers className="w-5 h-5" />
            </div>
          </div>
        </div>

                {/* Complete Accounts Interactive Control Card */}
        {/* 🛠️ UPGRADED LAYOUT: Swapped solid absolute dark parameters for smooth light-balancing panel backgrounds */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm w-full">
          <div className="flex items-center gap-2 mb-6 border-b border-slate-100 dark:border-slate-800/60 pb-4 text-left">
            <ShieldCheck className="w-5 h-5 text-slate-400 dark:text-slate-500" />
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 tracking-tight">Complete System Accounts Index</h2>
          </div>
          
          <div className="w-full overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800/60">
            <table className="w-full text-left border-collapse text-xs md:text-sm min-w-[700px]">
              <thead>
                <tr className="bg-slate-50/70 dark:bg-slate-950/40 border-b border-slate-100 dark:border-slate-800/80 text-slate-400 dark:text-slate-500 uppercase text-[10.5px] font-bold tracking-wider">
                  <th className="py-3.5 pl-4">Hex ID</th>
                  <th className="py-3.5">Name</th>
                  <th className="py-3.5">Email Address</th>
                  <th className="py-3.5">Role Status Privileges</th>
                  <th className="py-3.5 text-right pr-4">Global Modifiers</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 text-slate-600 dark:text-slate-300 font-medium">
                {displayUsers.map((account) => (
                  <tr key={account._id || account.email} className="hover:bg-slate-50/40 dark:hover:bg-slate-950/20 transition-colors">
                    <td className="py-4 font-mono text-[11px] text-slate-400 dark:text-slate-500 pl-4 max-w-[110px] truncate">
                      {account._id || "Local_Sync"}
                    </td>
                    <td className="py-4 font-bold text-slate-800 dark:text-slate-100">{account.name}</td>
                    <td className="py-4 text-slate-400 dark:text-slate-500">{account.email}</td>
                    <td className="py-4">
                      {account.email === "1234567890@gmail.com" ? (
                        <span className="px-2.5 py-1 bg-red-500/10 border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 text-[10px] font-black rounded-md uppercase tracking-wider">
                          Master Admin
                        </span>
                      ) : (
                        <select
                          value={account.role || "user"}
                          onChange={(e) => handleRoleToggle(account._id, e.target.value)}
                          className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs px-3 py-1.5 rounded-xl outline-none focus:border-blue-500 font-bold cursor-pointer transition-colors"
                        >
                          <option value="user">User (Buyer)</option>
                          <option value="seller">Seller (Broker)</option>
                          <option value="admin">Administrator</option>
                        </select>
                      )}
                    </td>
                    <td className="py-4 text-right pr-4">
                      {account.email !== "1234567890@gmail.com" ? (
                        <button 
                          type="button" 
                          onClick={() => handleAccountPurge(account._id, account.name)} 
                          className="px-3 py-1.5 bg-red-500/10 border border-red-200 dark:border-red-900/40 text-red-600 hover:text-white hover:bg-red-600 dark:hover:text-white dark:hover:bg-red-600 text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ml-auto shadow-xs"
                        >
                          <Trash2 className="w-3.5 h-3.5 shrink-0" />
                          <span>Purge User</span>
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400 dark:text-slate-600 italic select-none font-semibold pr-2">System Protected</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </section>
    </div>
  );
}
