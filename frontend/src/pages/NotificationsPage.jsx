import Navbar from "@/components/home/Navbar";
import { useNotifications } from "@/context/NotificationContext";
import { useNavigate } from "react-router-dom";

export default function NotificationsPage() {
  const {
    notifications,
    loading,
    markAsRead,
  } = useNotifications();
  const navigate = useNavigate();

  const handleNotificationClick = async (notification) => {
    await markAsRead(notification._id);

    if (
      notification.type === "NEW_LEAD" ||
      notification.type === "MESSAGE_RECEIVED"
    ) {
      navigate("/inbox");
    }

    if (
      notification.type === "PROPERTY_CREATED" ||
      notification.type === "PROPERTY_UPDATED"
    ) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-black mb-8 text-white">
          Notifications
        </h1>

        {loading ? (
          <div className="text-slate-400">Loading...</div>
        ) : (
          <div className="bg-[#111827] border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                No notifications found.
              </div>
            ) : (
              notifications.map((notification) => (
                <button
                  key={notification._id}
                  onClick={() =>
                    handleNotificationClick(notification)
                  }
                  className={`w-full text-left p-5 border-b border-slate-800/60 transition-colors hover:bg-slate-800/40 ${
                    !notification.isRead
                      ? "bg-blue-950/20"
                      : "bg-[#111827]"
                  }`}
                >
                  <h3 className={`font-bold ${!notification.isRead ? "text-blue-400" : "text-slate-200"}`}>
                    {notification.title}
                  </h3>

                  <p className="text-slate-400 mt-1 text-sm">
                    {notification.message}
                  </p>

                  <span className="text-xs text-slate-500 mt-2 block">
                    {new Date(
                      notification.createdAt
                    ).toLocaleString()}
                  </span>
                </button>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}
