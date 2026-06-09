import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext"; // FIXED: Uses the path alias instead of relative navigation paths
import axios from "axios";

export default function ProfilePage() {
  const { user, login } = useAuth();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [status, setStatus] = useState({ type: "", text: "" });

  useEffect(() => {
    if (user) {
      setName(user.name || "");
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setStatus({ type: "", text: "" });

    if (password && password !== confirmPassword) {
      return setStatus({ type: "error", text: "Passwords do not match" });
    }

    try {
      setIsUpdating(true);
      const token = localStorage.getItem("token");
      
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.put(
        "http://localhost:5000/api/auth/profile",
        { name, ...(password && { password }) },
        config
      );

      if (login) {
        login(response.data);
      }

      setStatus({ type: "success", text: "Account profile updated successfully!" });
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      setStatus({
        type: "error",
        text: error.response?.data?.message || "Failed to update profile settings",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center mx-auto text-3xl">
            👤
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mt-4">
            Account Settings
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Update your personal identity profile details securely
          </p>
        </div>

        {status.text && (
          <div
            className={`p-4 mb-6 rounded-xl text-sm font-medium border text-center ${
              status.type === "success"
                ? "bg-green-500/10 border-green-500/30 text-green-500"
                : "bg-red-500/10 border-red-500/30 text-red-500"
            }`}
          >
            {status.text}
          </div>
        )}

        <form onSubmit={handleUpdateProfile} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 bg-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Email Address <span className="text-xs font-normal text-slate-400 dark:text-slate-500">(Read-Only)</span>
            </label>
            <input
              type="email"
              readOnly
              value={user?.email || ""}
              className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 rounded-xl cursor-not-allowed text-slate-500 dark:text-slate-400 font-medium"
            />
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Change Password
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">
              Leave these fields blank to keep your current password
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 bg-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white transition-all"
                  placeholder="Min 6 characters"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 bg-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white transition-all"
                  placeholder="Repeat new password"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isUpdating}
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all duration-200"
          >
            {isUpdating ? "Saving Changes..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
