import { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { AuthContext } from "@context/AuthContext";
import Swal from "sweetalert2";

export const useManagement = () => {
  const { token } = useContext(AuthContext);
  const [view, setView] = useState(false);
  const [management, setManagement] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState(""); // término de búsqueda
  const [formData, setFormData] = useState({
    id: null,
    usuario_id: "",
    campaign_id: "",
    consultation_id: "",
    consultation_title: "",
    contact_id: "",
    contact_email: "",
    contact: "",
    consultation: "",
    contact_identification: "",
    contact_phone: "",
  });

  // Función principal: acepta page y search
  const fetchManagement = useCallback(
    async (page = 1, search = "") => {
      setLoading(true);
      setError(null);
      try {
        const url = `/api/management?page=${page}&search=${encodeURIComponent( search )}`;
        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

            const mappedData = res.data.data.map((gestion) => ({
                id                      : gestion.id,
                usuario_id              : gestion.usuario     ?.id                  || null,
                usuario_name            : gestion.usuario     ?.name                || "—",
                // ----------------------------------------------------------------------------------------------                                     
                campaign_id             : gestion.campaign    ?.id                  || null,
                campaign_name           : gestion.campaign    ?.name                || 
                                          gestion.campaign    ?.type                || "—",
                campaign                : gestion.campaign                          || "Sin pagaduria",
                // ----------------------------------------------------------------------------------------------
                consultation_id         : gestion.consultation?.id                  || null,
                consultation_title      : gestion.consultation?.reason_consultation || "No hay consulta",
                consultation            : gestion.consultation                      || {},
                // ----------------------------------------------------------------------------------------------
                contact_id              : gestion.contact     ?.id                  || null,
                contact_name            : gestion.contact     ?.name                || "—",
                contact                 : gestion.contact                           || "Sin contacto",
                contact_email           : gestion.contact.email                     || "Sin correo",
                contact_identification  : gestion.contact.identification_number     || "Número de identificación",
                contact_phone           : gestion.contact.phone                     || "Sin Teléfono",
                // -----------------------------------------------------------------------------------------------
                created_at              : gestion.created_at
            }));

        setManagement(mappedData);

        if (res.data.meta) {
          setTotalPages(res.data.meta.last_page ?? 1);
          setCurrentPage(res.data.meta.current_page ?? page);
        } else {
          setTotalPages(1);
          setCurrentPage(page);
        }
      } catch (err) {
        console.error(err);
        setError("Error al obtener las gestiones.");
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  // Wrapper: siempre incluye el searchTerm actual
  const fetchPage = useCallback(
    (page) => {
      return fetchManagement(page, searchTerm);
    },
    [fetchManagement, searchTerm]
  );

  // Handler público que proviene del SearchBar
  const handleSearch = useCallback((value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  }, []);

// Efecto: cuando cambie página o searchTerm trae datos
useEffect(() => {
  fetchManagement(currentPage, searchTerm);
}, [currentPage, searchTerm, fetchManagement]);

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
    fetchManagement, // por si quieres llamarla directamente
    fetchPage,       // pásalo a Table: fetch={fetchPage}
    searchTerm,
    handleSearch,    // pásalo a SearchBar: onSearch={handleSearch}
    setSearchTerm,
    setCurrentPage,
  };
};
