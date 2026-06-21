import Navbar from "@/components/home/Navbar";
import { useNotifications } from "@/context/NotificationContext";
import { useNavigate } from "react-router-dom";
import { Bell, CheckCircle2, Inbox, Clock } from "lucide-react";

export default function NotificationsPage() {
  const notificationContext = useNotifications();
  const navigate = useNavigate();

  if (!notificationContext) return null;

  const { notifications = [], markAsRead, triggerBulkMarkAllReadState, loading } = notificationContext;
  const safeNotifications = Array.isArray(notifications) ? notifications : [];
  
  const unreadCount = safeNotifications.filter((n) => n && !n.isRead).length;

  const handleNotificationClick = async (notification) => {
    if (!notification) return;

    if (!notification.isRead && markAsRead) {
      await markAsRead(notification._id);
    }

    if (
      notification.type === "NEW_LEAD" ||
      notification.type === "MESSAGE_RECEIVED"
    ) {
      navigate("/inbox");
    } else if (["PROPERTY_CREATED", "PROPERTY_UPDATED", "PROPERTY_APPROVED", "PROPERTY_REJECTED"].includes(notification.type)) {
      navigate("/dashboard");
    }
  };

  const formatExactDateTime = (dateString) => {
    if (!dateString) return "N/A";
    const dateObj = new Date(dateString);
    return `${dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} • ${dateObj.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true })}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070d19] text-slate-800 dark:text-slate-100 font-sans antialiased transition-colors duration-200">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
              <Bell size={20} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Notifications Center</h1>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Review active system alerts, billing confirmations, and incoming inquiries.</p>
            </div>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={triggerBulkMarkAllReadState}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-black uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
            >
              <CheckCircle2 size={14} className="text-emerald-500" />
              Mark All As Read
            </button>
          )}
        </div>

        {loading && safeNotifications.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : safeNotifications.length === 0 ? (
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 p-16 rounded-3xl text-center text-slate-400 dark:text-slate-500 flex flex-col items-center justify-center gap-3 shadow-sm mx-auto w-full">
            <Inbox size={40} className="text-slate-300 dark:text-slate-700" />
            <span className="text-xs font-black uppercase tracking-wider">Your notification tray is empty</span>
          </div>
        ) : (
          <div className="space-y-3">
            {safeNotifications.map((notif) => {
              if (!notif) return null;

              return (
                <div
                  key={notif._id}
                  onClick={() => handleNotificationClick(notif)}
                  /* 🟢 ADJUSTED OPACITY: Increases read container opacity from 60 to 75 for better readability */
                  className={`border rounded-2xl p-5 flex justify-between gap-6 transition-all shadow-md group cursor-pointer ${
                    !notif.isRead 
                      ? "border-blue-500/60 bg-blue-50/20 dark:bg-blue-950/20 hover:bg-blue-50/40 dark:hover:bg-blue-950/30" 
                      : "border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0f172a]/60 opacity-75 hover:opacity-100"
                  }`}
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2.5">
                      {!notif.isRead ? (
                        <span className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.7)] shrink-0" />
                      ) : (
                        <span className="w-2.5 h-2.5 bg-slate-400 dark:bg-slate-600 rounded-full shrink-0" />
                      )}
                      <h3 className={`text-sm tracking-wide transition-colors ${
                        !notif.isRead 
                          ? "font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400" 
                          : "font-bold text-slate-600 dark:text-slate-300 group-hover:text-slate-800 dark:group-hover:text-slate-100"
                      }`}>
                        {notif.title}
                      </h3>
                    </div>
                    {/* 🟢 ENHANCED CONTRAST: Swapped out low-alpha text colors for higher contrast grays */}
                    <p className={`text-xs mt-1 leading-relaxed ${!notif.isRead ? "text-slate-700 dark:text-slate-200 font-medium" : "text-slate-500 dark:text-slate-400"}`}>{notif.message}</p>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mt-2">
                      <Clock size={10} />
                      <span>{formatExactDateTime(notif.createdAt || notif.updatedAt)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
