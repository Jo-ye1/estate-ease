import Navbar from "@/components/home/Navbar";
import { useNotifications } from "@/context/NotificationContext";

export default function NotificationsPage() {
  const {
    notifications,
    loading,
    markAsRead,
  } = useNotifications();

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-black mb-8">
          Notifications
        </h1>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="bg-white rounded-2xl shadow overflow-hidden">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                No notifications found.
              </div>
            ) : (
              notifications.map((notification) => (
                <button
                  key={notification._id}
                  onClick={() =>
                    markAsRead(notification._id)
                  }
                  className={`w-full text-left p-5 border-b ${
                    !notification.isRead
                      ? "bg-blue-50"
                      : "bg-white"
                  }`}
                >
                  <h3 className="font-bold">
                    {notification.title}
                  </h3>

                  <p className="text-slate-500 mt-1">
                    {notification.message}
                  </p>

                  <span className="text-xs text-slate-400 mt-2 block">
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