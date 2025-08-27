import { useEffect, useState, useContext } from "react";
import { AuthContext } from "@context/AuthContext";
import axios from "axios";

const useDashboard = (onLoginSuccess) => {
    const { user, token, loading, setToken } = useContext(AuthContext);
    const [dataCounts, setDataCounts] = useState({
        contacts: 0,
        management: 0,
        payrolls: 0,       // ✅ agregado para que exista desde el inicio
        consultations: 0,
    });

    useEffect(() => {
        if (!token) {
            const storedToken = localStorage.getItem("token");
            if (storedToken) {
                setToken(storedToken);
            }
        }
    }, [token, setToken]);

    useEffect(() => {
        if (loading || !token) return;

        const fetchData = async () => {
            try {
                const [contacts, management, payrolls, consultations] =
                    await Promise.all([
                        axios.get("/api/contacts/count", {
                            headers: { Authorization: `Bearer ${token}` },
                        }),
                        axios.get("/api/management/count", {
                            headers: { Authorization: `Bearer ${token}` },
                        }),
                        axios.get("/api/payrolls/count", {
                            headers: { Authorization: `Bearer ${token}` },
                        }),
                        axios.get("/api/consultations/count", {
                            headers: { Authorization: `Bearer ${token}` },
                        }),
                    ]);

                setDataCounts({
                    contacts: contacts.data.count,
                    management: management.data.count,
                    payrolls: payrolls.data.count,
                    consultations: consultations.data.count,
                });
            } catch (error) {
                console.error("Error al obtener datos del Dashboard:", error);
            }
        };

        fetchData();
    }, [token, loading]);

    return {
        user,
        token,
        loading,
        dataCounts,
        onLoginSuccess,
    };
};

export default useDashboard;
