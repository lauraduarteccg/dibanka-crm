import { createContext, useState, useEffect } from "react";
import { getUser, logout } from "@modules/auth/services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    getUser()
      .then((data) => {
        setUser(data)
        setRoles(data.roles || []);
        setPermissions(data.permissions || []);

      })
      .catch(() => localStorage.removeItem("token"))
      .finally(() => setLoading(false));
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setPermissions(userData.permissions || []);
    setRoles(userData.roles || []);
  };
  const handleLogout = async () => {
    await logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, handleLogout, loading, permissions,setPermissions,handleLoginSuccess }}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthContext;