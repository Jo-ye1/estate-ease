import React, { useState, useEffect, useRef } from "react";
import { Bell, ExternalLink, Check } from "lucide-react";
import { useNotifications } from "../../context/NotificationContext";
import { useNavigate } from "react-router-dom";

export default function NotificationDropdown() {
  const notificationContext = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleOutsideClickClose = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClickClose);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClickClose);
  }, [isOpen]);

  const token = localStorage.getItem("token");
  if (!token) return null;

  if (!notificationContext) return null;

  const { notifications = [], markAsRead, triggerBulkMarkAllReadState, loading } = notificationContext;
  
  const displayNotifications = notifications.filter((n) => n && !n.isRead);
  const unreadCount = displayNotifications.length;

  const handleAlertInteraction = async (notification) => {
    if (!notification) return;
    if (!notification.isRead && markAsRead) {
      await markAsRead(notification._id);
    }
    setIsOpen(false);
    if (notification.type === "NEW_LEAD" || notification.type === "MESSAGE_RECEIVED") {
      navigate("/inbox");
    } else if (["PROPERTY_CREATED", "PROPERTY_UPDATED", "PROPERTY_APPROVED", "PROPERTY_REJECTED"].includes(notification.type)) {
      navigate("/dashboard");
    }
  };

  return (
    <div ref={dropdownRef} className="relative inline-block text-left select-none">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative p-2 text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 bg-transparent border-none outline-none cursor-pointer flex items-center justify-center rounded-full transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 bg-red-500 text-white font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center border border-white dark:border-slate-950">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 font-bold text-slate-800 dark:text-white text-xs uppercase tracking-wider bg-slate-50/50 dark:bg-slate-950/20 flex justify-between items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span>Alerts</span>
              {unreadCount > 0 && (
                <span className="bg-blue-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={async () => {
                  if (triggerBulkMarkAllReadState) await triggerBulkMarkAllReadState();
                }}
                className="text-[10px] text-blue-600 dark:text-blue-400 font-black hover:text-blue-700 dark:hover:text-blue-300 transition-colors uppercase tracking-normal bg-transparent border-none outline-none cursor-pointer flex items-center gap-0.5"
              >
                <Check size={10} />
                Read All
              </button>
            )}
          </div>

          {loading ? (
            <div className="p-6 text-center text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">
              Loading Alerts...
            </div>
          ) : displayNotifications.length === 0 ? (
            <div className="p-8 text-center text-xs font-semibold text-slate-400 tracking-wide">
              No new alerts found.
            </div>
          ) : (
            <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
              {displayNotifications.map((n) => (
                <button
                  key={n._id}
                  type="button"
                  onClick={() => handleAlertInteraction(n)}
                  className="w-full text-left p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex flex-col gap-1 cursor-pointer bg-blue-50/40 dark:bg-blue-950/10 font-bold border-l-4 border-blue-500"
                >
                  <h4 className="font-black text-xs text-slate-900 dark:text-white">{n.title}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">{n.message}</p>
                </button>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              navigate("/notifications");
            }}
            className="w-full text-center py-3 border-t border-slate-100 dark:border-slate-800 text-xs font-black text-blue-600 dark:text-blue-400 bg-slate-50/50 dark:bg-slate-950/10 hover:bg-slate-100 dark:hover:bg-slate-950 transition-colors flex items-center justify-center gap-1 cursor-pointer uppercase tracking-wider"
          >
            <ExternalLink size={12} />
            View All Notifications
          </button>
        </div>
      )}
    </div>
  );
}
