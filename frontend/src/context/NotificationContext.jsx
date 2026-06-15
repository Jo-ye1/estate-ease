import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import api from "@/lib/api";

const SystemNotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    try {
      const { data } = await api.get("/notifications");
      setNotifications(data.notifications || data || []);
    } catch (error) {
      console.error(error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await api.put(`/notifications/${notificationId}/read`);
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === notificationId ? { ...n, isRead: true } : n
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      loadNotifications();
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <SystemNotificationContext.Provider
      value={{
        notifications,
        loading,
        loadNotifications,
        markAsRead,
      }}
    >
      {children}
    </SystemNotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(SystemNotificationContext);
