import { useState, useEffect, useContext, useCallback, useRef } from "react";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContext } from "@context/AuthContext";
import {
  getManagements,
  getActiveMonitorings,
  updateManagementMonitoring,
} from "@modules/management/services/managementService";
import { useDebounce } from "@modules/management/hooks/useDebounce";

export const useManagement = () => {
  const [management, setManagement] = useState([]);
  const [monitoring, setMonitoring] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(1);
  const [totalItems, setTotalItems] = useState(1);

  // UI y búsqueda
  const [searchTerm, setSearchTerm] = useState("");
  const [IsOpenADD, setIsOpenADD] = useState(false);
  const [view, setView] = useState(false);
  const [onMonitoring, setOnMonitoring] = useState(false);

  // Debounce para búsqueda (optimización)
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Refs para evitar loops y peticiones simultáneas
  const isFetching = useRef(false);
  const hasInitialLoad = useRef(false);

  // Validaciones y formulario
  const [validationErrors, setValidationErrors] = useState({});
  const [formData, setFormData] = useState({
    id: null,
    user_id: "",
    payroll_id: "",
    consultation_id: "",
    contact_id: "",
    solution_date: "",
    monitoring_id: "",
  });

  /* ===========================================================
   *  Fetch principal de gestiones (optimizado)
   * =========================================================== */
  const fetchManagement = useCallback(
    async (page = 1, search = "") => {
      if (isFetching.current) return; // Evitar peticiones simultáneas
      
      isFetching.current = true;
      setLoading(true);
      try {
        const data = await getManagements(page, search);
        setManagement(data.managements || []);
        setCurrentPage(data.pagination?.current_page || 1);
        setTotalPages(data.pagination?.last_page || 1);
        setPerPage(data.pagination?.per_page || 1);
        setTotalItems(data.pagination?.total || 0);
      } catch (err) {
        console.error("Error al obtener gestiones:", err);
        setError("Error al obtener las gestiones.");
      } finally {
        setLoading(false);
        isFetching.current = false;
      }
    },
    []
  );

  // Cargar gestiones cuando cambie la página o búsqueda (con debounce)
  useEffect(() => {
    fetchManagement(currentPage, debouncedSearchTerm);
  }, [currentPage, debouncedSearchTerm, fetchManagement]);

  /* ===========================================================
   *  Paginación y búsqueda
   * =========================================================== */
  const fetchPage = useCallback(
    (page) => fetchManagement(page, debouncedSearchTerm),
    [fetchManagement, debouncedSearchTerm]
  );

  const handleSearch = useCallback(
    (value) => {
      setSearchTerm(value);
      setCurrentPage(1); // Resetear a página 1 cuando se busca
    },
    []
  );

  /* ===========================================================
   *  Actualizar management-monitoring
   * =========================================================== */
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

      await updateManagementMonitoring(formData.id, payload);

      Swal.fire({
        title: "Gestión actualizada",
        text: "Los cambios han sido guardados correctamente.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      // Limpia formulario
      setFormData({
        id: null,
        user_id: "",
        payroll_id: "",
        consultation_id: "",
        contact_id: "",
        solution_date: "",
        monitoring_id: "",
      });

      setOnMonitoring(false);
      setIsOpenADD(false);
      fetchManagement(currentPage, debouncedSearchTerm);
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

  /* ===========================================================
   *  Fetch Monitorings
   * =========================================================== */
  const fetchMonitoring = useCallback(async () => {
    try {
      const data = await getActiveMonitorings();
      setMonitoring(data);
    } catch (err) {
      console.error("Error al obtener monitorings:", err);
      setError("Error al obtener los monitorings.");
    }
  }, []);

  useEffect(() => {
    fetchMonitoring();
  }, [fetchMonitoring]);

  /* ===========================================================
   *  Validar monitoring_id actual
   * =========================================================== */
  useEffect(() => {
    if (monitoring?.length && formData.monitoring_id != null) {
      const exists = monitoring.some(
        (opt) => Number(opt.id) === Number(formData.monitoring_id)
      );
      if (!exists) {
        setFormData((prev) => ({ ...prev, monitoring_id: "" }));
      }
    }
  }, [monitoring]);


  /* ===========================================================
   *  Extraer parámetros de la URL (optimizado)
   * =========================================================== */
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get("search");

    if (searchParam && searchParam !== searchTerm) {
      // Solo actualizar si el parámetro es diferente al término actual
      setSearchTerm(searchParam);
      setCurrentPage(1);
    } else if (!searchParam && searchTerm && !hasInitialLoad.current) {
      // Solo cargar inicialmente si no hay búsqueda
      hasInitialLoad.current = true;
    }
  }, [location.search]); // Removido fetchManagement y searchTerm de dependencias para evitar loops

  /* ===========================================================
   *  Return
   * =========================================================== */
  return {
    // Datos
    management,
    monitoring,
    formData,
    validationErrors,

    // Estados UI
    loading,
    error,
    IsOpenADD,
    view,
    onMonitoring,

    // Paginación
    currentPage,
    totalPages,
    totalItems,
    perPage,
    fetchPage,

    // Acciones
    fetchManagement,
    fetchPage,
    handleSearch,
    handleSubmit,
    setFormData,
    setIsOpenADD,
    setOnMonitoring,
    setView,
    setCurrentPage,
  };
};
