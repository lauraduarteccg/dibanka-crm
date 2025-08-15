import { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { AuthContext } from "@context/AuthContext";
import Swal from "sweetalert2";

export const useManagement = () => {
    const { token } = useContext(AuthContext);
    const [view,             setView]                = useState(false)
    const [management,       setManagement]          = useState([]);
    const [loading,          setLoading]             = useState(true);
    const [error,            setError]               = useState(null);
    const [currentPage,      setCurrentPage]         = useState(1);
    const [totalPages,       setTotalPages]          = useState(1);
    const [formData,         setFormData]            = useState({
        id: null,
        usuario_id              : "",
        campaign_id             : "",
        consultation_id         : "",
        consultation_title      : "",
        contact_id              : "",
    });

    //Tabla de consultas
const fetchManagement = useCallback(
    async (page) => {
        setLoading(true);
        try {
            const res = await axios.get(`/api/management?page=${page}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Mapeamos la data para estructurarla
            const mappedData = res.data.data.map((gestion) => ({
                id                  : gestion.id,
                usuario_id          : gestion.usuario     ?.id                  || null,
                usuario_name        : gestion.usuario     ?.name                || "—",
                campaign_id         : gestion.campaign    ?.id                  || null,
                campaign_name       : gestion.campaign    ?.name                || "—",
                consultation_id     : gestion.consultation?.id                  || null,
                consultation_title  : gestion.consultation?.title               ||
                                      gestion.consultation?.reason_consultation ||
                                      gestion.consultation?.specific_reason     || "Sin consulta",
                contact_id          : gestion.contact     ?.id                  || null,
                contact_name        : gestion.contact     ?.name                || "—"
            }));

            // Guardamos ya mapeado
            setManagement(mappedData);
            setTotalPages(res.data.meta.last_page);
            setCurrentPage(res.data.meta.current_page);

            // Ver en consola
            // console.log(mappedData);

        } catch (err) {
            setError("Error al obtener las gestiones.");
        } finally {
            setLoading(false);
        }
    },
    [token]
);

    useEffect(() => {
        fetchManagement(1);
    }, []);

    return {
        management,
        view,
        setView,
        loading,
        error,
        formData,
        setFormData,
        currentPage,
        totalPages,
        fetchManagement,
    };
};
