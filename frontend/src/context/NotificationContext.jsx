import { createContext, useContext, useEffect, useState } from "react";
import api from "@/lib/api";
import { socket } from "@/lib/socket";

const SystemNotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sessionTrigger, setSessionTrigger] = useState(0);

  const loadNotifications = async (isMounted = true) => {
    const token = localStorage.getItem("token");
    if (!token) {
      if (isMounted) setNotifications([]);
      return;
    }

    try {
      const { data } = await api.get("/notifications");
      if (isMounted) {
        setNotifications(Array.isArray(data) ? data : data?.notifications || []);
      }
    } catch (error) {
      console.error("Failed to load notifications:", error);
      if (isMounted) setNotifications([]);
    }
  };

  useEffect(() => {
    let mounted = true;

    const boot = async () => {
      if (!localStorage.getItem("token")) {
        if (mounted) setNotifications([]);
        return;
      }
      if (mounted) {
        setLoading(true);
        await loadNotifications(mounted);
        setLoading(false);
      }
    };

    boot();

    const handleIncomingLiveNotification = () => {
      if (mounted) loadNotifications(mounted);
    };

    if (socket) {
      socket.on("newNotification", handleIncomingLiveNotification);
    }

    // Dynamic browser listener captures token mutations across active windows instantly
    const handleStorageChange = () => {
      if (mounted) boot();
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      mounted = false;
      window.removeEventListener("storage", handleStorageChange);
      if (socket) {
        socket.off("newNotification", handleIncomingLiveNotification);
      }
    };
  }, [sessionTrigger]);

  const markAsRead = async (notificationId) => {
    if (!notificationId) return;
    try {
      await api.patch(`/notifications/${notificationId}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n?._id === notificationId ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const triggerBulkMarkAllReadState = async () => {
    try {
      await api.put("/notifications/read-all");
      setNotifications((prev) => prev.map((n) => (n ? { ...n, isRead: true } : n)));
    } catch (error) {
      console.error("Bulk mark read state sync failed:", error);
    }
  };

  return (
    <SystemNotificationContext.Provider
      value={{
        notifications,
        loading,
        loadNotifications: () => {
          setSessionTrigger((p) => p + 1);
          loadNotifications(true);
        },
        markAsRead,
        triggerBulkMarkAllReadState,
      }}
    >
      {children}
    </SystemNotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(SystemNotificationContext);
