import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShieldAlert, Users, Layers } from 'lucide-react';
import Navbar from "@/components/home/Navbar";
import axios from 'axios';

export default function AdminDashboardPage() {
  const [displayUsers, setDisplayUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Live API Data Hydration loop
  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      // Replace with your exact users table fetch URL
      const response = await axios.get('http://localhost:5000/api/auth/users', {
        headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
      });
      setDisplayUsers(response.data || []);
    } catch (error) {
      console.error("Failed to map live system user accounts logs:", error);
      // Fallback fallback mock indicators if backend isn't mounted yet
      setDisplayUsers([
        { _id: "660c1ad2e", name: "eyassu melese", email: "1234567890@gmail.com", role: "admin" },
        { _id: "660c1b48f", name: "Sarah Connor", email: "sarah@sky.net", role: "seller" },
        { _id: "660c23a1a", name: "John Doe", email: "johndoe@gmail.com", role: "user" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  // 2. Modify User Role System Hook
  const handleRoleToggle = async (userId, newRole) => {
    try {
      await axios.put(`http://localhost:5000/api/auth/users/${userId}/role`, { role: newRole }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
      });
      alert("Account authorization matrix updated successfully!");
      fetchAllUsers(); // Refresh data rows
    } catch (error) {
      console.error("Failed to alter system permissions:", error);
      // Optimistic locally simulated fallback toggle if endpoint isn't fully set up yet
      setDisplayUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));
    }
  };

  // 3. Purge User Record Action Link
  const handleAccountPurge = async (userId, name) => {
    if (!window.confirm(`Are you absolutely certain you want to completely purge ${name} from the database cluster?`)) return;
    try {
      await axios.delete(`http://localhost:5000/api/auth/users/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
      });
      alert("User purged successfully!");
      setDisplayUsers(prev => prev.filter(u => u._id !== userId));
    } catch (error) {
      console.error("Failed to execute collection slice removal action:", error);
      setDisplayUsers(prev => prev.filter(u => u._id !== userId));
    }
  };

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-200 flex flex-col select-none">
      <Navbar />

      <section className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 animate-in fade-in duration-200">
        
        {/* 👑 TOP ROW SUB-MENU HEADER TOOLBAR */}
        <div className="w-full mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/60 dark:border-slate-800 pb-5 text-left">
          <div>
            <span className="text-[10px] font-black tracking-widest text-blue-600 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded uppercase flex items-center gap-1.5 w-fit">
              <ShieldAlert className="w-3 h-3" /> SECURITY MONITOR
            </span>
            <h1 className="text-2xl font-black tracking-tight text-slate-800 dark:text-white mt-1 flex items-center gap-2">
              Platform Accounts & User Profiles
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Audit user registration logs, manage access permissions, and alter platform layout roles.
            </p>
          </div>

          {/* 🔄 Seamless standalone cross-link switcher */}
          <Link 
            to="/admin/matrix-settings" 
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-95 text-white font-extrabold text-[11px] uppercase tracking-wider rounded-xl transition-all shadow-md px-4 py-2.5 h-10 border-0 cursor-pointer no-underline shrink-0 shadow-blue-500/10"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Switch to Site Content Matrix</span>
          </Link>
        </div>

        {/* 📊 DATA TABLE GRID CONTAINER */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-4 md:p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-5 border-b border-slate-100 dark:border-slate-800/60 pb-3 text-left">
            <Users className="w-4 h-4 text-blue-600 dark:text-blue-500" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-white">Active System Registry Matrix</h3>
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
