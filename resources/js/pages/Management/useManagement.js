import { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { AuthContext } from "@context/AuthContext";
import Swal from "sweetalert2";

export const useManagement = () => {
  const { token } = useContext(AuthContext);

  const [management, setManagement] = useState([]);
  const [monitoring, setMonitoring] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(1);
  const [totalItems, setTotalItems] =useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [IsOpenADD, setIsOpenADD] = useState(false);
  const [view, setView] = useState(false);
  const [onMonitoring, setOnMonitoring] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const [formData, setFormData] = useState({
    id: null,
    user_id: "",
    payroll_id: "",
    consultation_id: "",
    contact_id: "",
    solution_date: "", // Añadir estos campos al estado inicial
    monitoring_id: "",
  });

  // 🔹 Obtener gestiones (sin cambios)
  const fetchManagement = useCallback(
    async (page = 1, search = "") => {
      setLoading(true);
      setError(null);
      try {
        const url = `/api/management?page=${page}&search=${encodeURIComponent(search)}`;
        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setManagement(res.data.managements || []);
        setTotalPages(res.data.meta?.last_page ?? 1);
        setCurrentPage(res.data.meta?.current_page ?? page);
        setPerPage(res.data.pagination.per_page);
        setTotalItems(res.data.pagination.total_management)
      } catch (err) {
        console.error(err);
        setError("Error al obtener las gestiones.");
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  const fetchPage = useCallback(
    (page) => fetchManagement(page, searchTerm),
    [fetchManagement, searchTerm]
  );

  const handleSearch = useCallback((value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  }, []);

  useEffect(() => {
    fetchManagement(currentPage, searchTerm);
  }, [currentPage, searchTerm, fetchManagement]);

  // 🔹 Actualizar solo solution_date y monitoring_id de una gestión
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setValidationErrors({});

    try {
      const payload = {
        solution_date: formData.solution_date,
        monitoring_id: formData.monitoring_id,
      };

      if (!payload.solution_date || !payload.monitoring_id) {
        Swal.fire({
          title: "Campos requeridos",
          text: "Por favor, complete todos los campos.",
          icon: "warning",
          timer: 2000,
          showConfirmButton: false,
        });
        return;
      }

      const response = await axios.put(
        `/api/managementmonitoring/${formData.id}`, 
        payload, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        // 🔹 Mostrar popup de éxito
        await Swal.fire({
          title: "Gestión actualizada",
          text: "Los cambios han sido guardados correctamente.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });

        // 🔹 Limpiar formulario completamente
        setFormData({
          id: null,
          user_id: "",
          payroll_id: "",
          consultation_id: "",
          contact_id: "",
          solution_date: "",
          monitoring_id: "",
        });

        // 🔹 Cerrar modal o drawer si estaba abierto
        setOnMonitoring(false);
        setIsOpenADD(false);

        // 🔹 Refrescar la lista
        fetchManagement(currentPage, searchTerm);
      }
    } catch (error) {
      if (error.response?.status === 422) {
        setValidationErrors(error.response.data.errors);
      } else {
        console.error("Error al actualizar gestión:", error);
        Swal.fire({
          title: "Error",
          text: "Ocurrió un error al actualizar la gestión.",
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  
  // 🔹 Obtener monitorings (sin cambios)
  const fetchMonitoring = useCallback(async () => {
    try {
      const res = await axios.get(`/api/monitorings/active`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMonitoring(res.data.monitorings || []);
    } catch {
      setError("Error al obtener los monitorings.");
    }
  }, [token]);

  useEffect(() => {
    fetchMonitoring();
  }, [fetchMonitoring]);

  // 🔹 Sincronizar monitoring_id con las opciones disponibles
  useEffect(() => {
    if (monitoring?.length && formData.monitoring_id != null) {
      const exists = monitoring.some(opt => Number(opt.id) === Number(formData.monitoring_id));
      if (!exists) {
        setFormData(prev => ({ ...prev, monitoring_id: "" }));
      }
    }
  }, [monitoring]);

  return {
    monitoring,
    onMonitoring,
    setOnMonitoring,
    view,
    setView,
    management,
    loading,
    error,
    formData,
    setFormData,
    currentPage,
    totalPages,
    totalItems,
    perPage,
    searchTerm,
    IsOpenADD,
    validationErrors,
    fetchManagement,
    fetchPage,
    handleSearch,
    setCurrentPage,
    handleSubmit,
    setIsOpenADD,
  };
};
