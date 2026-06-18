import { useState } from "react";
import { Bell } from "lucide-react";
import { useNotifications } from "@/context/NotificationContext";

export default function NotificationDropdown() {
  const notificationContext = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  if (!notificationContext) return null;

  const { notifications = [], markAsRead, loading } = notificationContext;
  const safeNotifications = Array.isArray(notifications) ? notifications : [];
  const unreadCount = safeNotifications.filter((n) => n && !n.isRead).length;

  return (
    <div className="relative inline-block text-left select-none">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative p-2 text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 bg-transparent border-0 outline-none cursor-pointer flex items-center justify-center rounded-full transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 bg-red-500 text-white font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center border border-white dark:border-slate-950">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-96 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="p-4 border-b font-bold text-slate-800 dark:text-white">
            Notifications
          </div>

          {loading ? (
            <div className="p-6 text-center text-sm text-slate-400">
              Loading...
            </div>
          ) : safeNotifications.length === 0 ? (
            <div className="p-6 text-center text-sm text-slate-400">
              No notifications
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
              {safeNotifications.map((n) => {
                // 🚀 Final guard against malformed, null, or undefined array items
                if (!n) return null;

                return (
                  <button
                    key={n._id}
                    onClick={() => markAsRead && markAsRead(n._id)}
                    className={`w-full text-left p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                      !n.isRead ? "bg-blue-50 dark:bg-blue-950/20" : ""
                    }`}
                  >
                    <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200">
                      {n.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {n.message}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
