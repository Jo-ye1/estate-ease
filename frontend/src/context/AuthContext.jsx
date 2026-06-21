import { createContext, useContext, useState, useEffect, useRef } from "react";
import api from "../lib/api";
import { socket } from "../lib/socket";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  const socketConnectedRef = useRef(false);

  useEffect(() => {
    let mounted = true;

    const initializeAuthSession = async () => {
      try {
        const storedToken = localStorage.getItem("token");

        if (!storedToken) {
          if (mounted) setLoading(false);
          return;
        }

        const { data } = await api.get("/auth/me");

        const resolvedUser = data?.user || data;

        if (!mounted) return;

        setUser(resolvedUser);
        setToken(storedToken);

        localStorage.setItem("user", JSON.stringify(resolvedUser));

        if (!socketConnectedRef.current) {
          socket.connect();
          socket.emit("join", resolvedUser._id);
          socketConnectedRef.current = true;
        }
      } catch (error) {
        console.error("Session restore failed:", error);

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        if (mounted) {
          setUser(null);
          setToken(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuthSession();

    return () => {
      mounted = false;
    };
  }, []);

  const login = (authData) => {
    if (!authData?.token || !authData?.user) return;

    localStorage.setItem("token", authData.token);
    localStorage.setItem("user", JSON.stringify(authData.user));

    setToken(authData.token);
    setUser(authData.user);

    if (!socketConnectedRef.current) {
      socket.connect();
      socket.emit("join", authData.user._id);
      socketConnectedRef.current = true;
    }
  };

  const updateUser = (updatedUser) => {
    if (!updatedUser) return;

    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setToken(null);

    socketConnectedRef.current = false;

    if (socket.connected) {
      socket.disconnect();
    }

    window.location.replace("/");
  };

  useEffect(() => {
    if (!user) return;

    socket.on("role_escalated", (data) => {
      alert("Your operational access privileges have been modified by corporate management! Synchronizing desktop environment layout parameters...");
      
      const freshlyPromotedUser = {
        ...user,
        role: data.newRole,
        agencyId: data.agencyId
      };

      localStorage.setItem("user", JSON.stringify(freshlyPromotedUser));
      setUser(freshlyPromotedUser);
      
      window.location.reload();
    });

    return () => {
      socket.off("role_escalated");
    };
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        updateUser,
      }}
    >
      {!loading ? children : null}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};
