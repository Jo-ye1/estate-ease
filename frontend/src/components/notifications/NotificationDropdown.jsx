import { useState } from "react";
import { Bell } from "lucide-react";
import { useNotifications } from "@/context/NotificationContext";

export default function NotificationDropdown() {
  const { notifications, markAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const safeNotifications = Array.isArray(notifications) ? notifications : [];
  const unreadCount = safeNotifications.filter((n) => n && !n.isRead).length;

  return (
    <div className="relative inline-block text-left select-none">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 bg-transparent border-0 outline-none cursor-pointer flex items-center justify-center rounded-full transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 bg-red-500 text-white font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center border border-white dark:border-slate-950 animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40 bg-transparent cursor-default" 
            onClick={() => setIsOpen(false)} 
          />
          
          <div className="absolute right-0 mt-3 w-96 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-xl z-50 overflow-hidden">
            <div className="p-4 border-b font-bold text-slate-800 dark:text-white flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/20">
              <span>Notifications</span>
              {unreadCount > 0 && (
                <span className="text-[10px] font-bold bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">
                  {unreadCount} New
                </span>
              )}
            </div>

            <div className="max-h-96 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/40">
              {safeNotifications.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 dark:text-slate-500 font-medium italic">
                  No notifications yet
                </div>
              ) : (
                safeNotifications.map((n) => (
                  <button
                    key={n?._id}
                    type="button"
                    onClick={() => {
                      if (n?._id) markAsRead(n._id);
                    }}
                    className={`w-full text-left p-4 transition-colors flex flex-col gap-0.5 border-0 cursor-pointer ${
                      n && !n.isRead 
                        ? "bg-blue-50/40 dark:bg-blue-950/10 hover:bg-blue-50/60 dark:hover:bg-blue-950/20" 
                        : "bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/30"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 w-full">
                      <h4 className="font-bold text-xs text-slate-800 dark:text-white tracking-tight leading-snug">
                        {n?.title || "System Alert"}
                      </h4>
                      {n && !n.isRead && (
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-normal mt-0.5">
                      {n?.message}
                    </p>
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
