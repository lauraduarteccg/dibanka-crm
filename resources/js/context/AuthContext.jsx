// @context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";
import axios from "axios";
import {logout, getUser} from "../modules/auth/services/authService";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(true);

    // ✅ Mantiene el usuario autenticado al recargar la página
    useEffect(() => {
        if (token) {
            axios.get("/api/me", {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((res) => {

                    setUser({
                        id: res.data.data.id,
                        name: res.data.data.name,
                        email: res.data.data.email
                    });
                    setPermissions(res.data.data.permissions || []);
                
                })
                .catch(() => {
                    handleLogout();
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [token]);



    const handleLogout  = async () => {
        await logout();
        localStorage.removeItem("token");
        setToken(null);
        setPermissions([]);
        setUser(null);
        window.location.href = "/";
    };

    //  Nueva función: refresca token y actualiza el estado
    const refreshAuthToken = async () => {
        try {
            const res = await axios.post(
                "/api/refresh-token",
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            const newToken = res.data.token;

            localStorage.setItem("token", newToken);
            setToken(newToken);

            console.info("Token actualizado en AuthContext");
            return newToken;
        } catch (error) {
            console.error(" Error al refrescar token:", error);
            handleLogout();
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,

                handleLogout ,
                setUser,
                permissions, setPermissions,
                refreshAuthToken,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
