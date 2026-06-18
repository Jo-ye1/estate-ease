import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import api from "@/lib/api";
//import { socket } from "@/lib/socket";

const SystemNotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  // Loaded with state safety to support execution during component unmounts
  const loadNotifications = async (isMounted = true) => {
    const token = localStorage.getItem("token");

    if (!token) {
      if (isMounted) setNotifications([]);
      return;
    }

    try {
      const { data } = await api.get("/notifications");

      if (isMounted) {
        setNotifications(
          Array.isArray(data)
            ? data
            : data?.notifications || []
        );
      }
    } catch (error) {
      console.error("Failed to load notifications:", error);
      if (isMounted) setNotifications([]);
    }
  };

  useEffect(() => {
    let mounted = true;

    const boot = async () => {
      try {
        if (!localStorage.getItem("token")) return;

        if (mounted) {
          setLoading(true);
          await loadNotifications(mounted);
        }
      } catch (error) {
        console.error("Notification boot error:", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    boot();
    // 🚫 TEMPORARILY DISABLED SOCKETS TO PREVENT CRASHES FROM MALFORMED PAYLOADS
    /*
    const handleNotification = () => {
      loadNotifications(mounted);
    };

    socket.on("new_notification", handleNotification);
    */

    return () => {
      mounted = false;
      // socket.off("new_notification", handleNotification);
    };
  }, []);

  const markAsRead = async (notificationId) => {
    if (!notificationId) return;

    try {
      await api.put(`/notifications/${notificationId}/read`);

      setNotifications((prev) => {
        const safePrev = Array.isArray(prev) ? prev : [];
        return safePrev.map((n) => {
          // Guard against null/undefined or missing _id items inside previous state array
          if (!n || !n._id) return n;
          
          return n._id === notificationId 
            ? { ...n, isRead: true } 
            : n;
        });
      });
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  return (
    <SystemNotificationContext.Provider
      value={{
        notifications,
        loading,
        loadNotifications: () => loadNotifications(true),
        markAsRead,
      }}
    >
      {children}
    </SystemNotificationContext.Provider>
  );
};


export const useNotifications = () => useContext(SystemNotificationContext);
