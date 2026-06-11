import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuthSession = () => {
      try {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");

        if (storedToken && storedUser) {
          setToken(storedToken);
          // Safely parse user payload context object rules
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser.user ? parsedUser.user : parsedUser);
        }
      } catch (err) {
        console.error("Auth session restore failure:", err.message);
        localStorage.clear();
      } finally {
        setLoading(false);
      }
    };

    initializeAuthSession();
  }, []);

  const login = (authData) => {
    if (authData.token) {
      localStorage.setItem("token", authData.token);
      
      // Extract accurate user document metrics safely
      const cleanUserObj = authData.user ? authData.user : authData;
      localStorage.setItem("user", JSON.stringify(cleanUserObj));
      
      setToken(authData.token);
      setUser(cleanUserObj);
    }
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setUser(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
