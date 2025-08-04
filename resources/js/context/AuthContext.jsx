import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token") || "");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }

        setLoading(true);
        axios
            .get("/api/me", { headers: { Authorization: `Bearer ${token}` } })
            .then((response) => {
                if (response.status === 200) {
                    setUser(response.data.user);
                }
            })
            .catch((err) => {
                console.error("Error al obtener el usuario:", err);
                setError("No se pudo autenticar al usuario");
                setUser(null);
                setToken("");
                localStorage.removeItem("token"); // 🔥 Asegurar que el token no persista si es inválido
            })
            .finally(() => setLoading(false)); // 🔥 Asegurar que `loading` siempre se actualiza
    }, [token]); // 🔥 Se ejecuta cada vez que `token` cambia

    const login = async (email, password) => {
        setLoading(true);
        try {
            const response = await axios.post("/api/login", { email, password });

            localStorage.setItem("token", response.data.token);
            setToken(response.data.token); // 🔥 Esto activará el `useEffect`
            setUser(response.data.user);
            setError(null);
        } catch (err) {
            setError("Credenciales incorrectas");
            throw new Error("Credenciales incorrectas");
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        axios
            .post("/api/logout", {}, { headers: { Authorization: `Bearer ${token}` } })
            .catch((err) => console.error("Error al cerrar sesión:", err));

        setUser(null);
        setToken("");
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={{ user, token, setUser, login, logout, loading, error,setToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
