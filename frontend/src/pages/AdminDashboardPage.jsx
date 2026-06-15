import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShieldAlert, Users, Layers } from "lucide-react";
import Navbar from "@/components/home/Navbar";
import axios from "axios";

export default function AdminDashboardPage() {
  const [displayUsers, setDisplayUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchAllUsers = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "http://localhost:5000/api/analytics/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDisplayUsers(response?.data?.recentUsers || []);
    } catch (error) {
      console.error("Failed to fetch admin dashboard users:", error);
      setDisplayUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const handleRoleToggle = async (userId, newRole) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/users/${userId}/role`,
        { role: newRole },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchAllUsers();
    } catch (error) {
      console.error("Failed updating role:", error);
    }
  };

  const handleAccountPurge = async (userId, name) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${name}?`
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/admin/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDisplayUsers((prev) =>
        prev.filter((user) => user._id !== userId)
      );
    } catch (error) {
      console.error("Failed deleting user:", error);
    }
  };

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-950 min-h-screen flex flex-col">
      <Navbar />

      <section className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8">
        <div className="w-full mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
          <div>
            <span className="text-[10px] font-black tracking-widest text-blue-600 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded uppercase flex items-center gap-1.5 w-fit">
              <ShieldAlert className="w-3 h-3" />
              SECURITY MONITOR
            </span>

            <h1 className="text-2xl font-black tracking-tight text-slate-800 dark:text-white mt-1">
              Platform Accounts & User Profiles
            </h1>

            <p className="text-xs text-slate-400 mt-0.5">
              Manage users and roles across the platform.
            </p>
          </div>

          <Link
            to="/admin/matrix-settings"
            className="flex items-center gap-2 bg-blue-600 text-white font-bold text-xs rounded-xl px-4 py-2"
          >
            <Layers className="w-4 h-4" />
            Matrix Settings
          </Link>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 md:p-6">
          <div className="flex items-center gap-2 mb-5 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Users className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-white">
              User Registry
            </h3>
          </div>

          {loading ? (
            <p className="text-sm text-slate-500">Loading users...</p>
          ) : (
            <div className="w-full overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800">
              <table className="w-full text-left border-collapse text-xs md:text-sm min-w-[700px]">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800">
                    <th className="py-3 pl-4">ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th className="text-right pr-4">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {displayUsers.map((account) => (
                    <tr
                      key={account._id}
                      className="border-b border-slate-100 dark:border-slate-800"
                    >
                      <td className="py-4 pl-4 font-mono text-xs">
                        {account._id}
                      </td>

                      <td>{account.name}</td>

                      <td>{account.email}</td>

 <td className="py-4">
  {account.role === "super_admin" ? (
    <span className="px-2.5 py-1 bg-purple-500/10 dark:bg-purple-500/20 border border-purple-200 dark:border-purple-800/60 text-purple-600 dark:text-purple-400 text-[10px] font-black rounded-md uppercase tracking-wider">
      Super Admin
    </span>
  ) : (
    <select
      value={account.role || "user"}
      onChange={(e) =>
        handleRoleToggle(account._id, e.target.value)
      }
      className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-xl text-slate-800 dark:text-slate-200 text-xs font-medium outline-none focus:border-blue-500 transition-colors"
    >
      <option value="user" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">User</option>
      <option value="seller" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">Seller</option>
      <option value="admin" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">Admin</option>
    </select>
  )}
</td>


<td className="py-4 text-right pr-4">
  {account.role !== "super_admin" ? (
    <button
      type="button"
      onClick={() =>
        handleAccountPurge(account._id, account.name)
      }
      className="inline-flex items-center justify-center h-8 px-4 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-[11px] font-bold uppercase tracking-wider shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer outline-none"
    >
      Delete
    </button>
  ) : (
    <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 tracking-wide bg-slate-100/60 dark:bg-slate-800/40 px-3 py-1 rounded-full">
      System Protected
    </span>
  )}
</td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}