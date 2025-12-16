import { useState, useEffect, useContext, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContext } from "@context/AuthContext";
import {
  getManagements,
  getActiveMonitorings,
  updateManagementMonitoring
} from "@modules/management/services/managementService";
import { useDebounce } from "@modules/management/hooks/useDebounce";

export const useManagement = () => {
  const [management, setManagement] = useState([]);
  const [monitoring, setMonitoring] = useState([]);
  const [managementCountAfiliados, setManagementCountAfiliados] = useState([]);
  const [managementCountAliados, setManagementCountAliados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(1);
  const [totalItems, setTotalItems] = useState(1);

  // UI y búsqueda
  const location = useLocation();

  // Estado para el término de búsqueda y el filtro por columna
  const [searchTerm, setSearchTerm] = useState(() => {
    const params = new URLSearchParams(location.search);
    
    return params.get("search") || "";
  });
  
  const [filterColumn, setFilterColumn] = useState("");

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
    consultation_id: "",
    contact_id: "",
    solution_date: "",
    monitoring_id: "",
  });

  /* ===========================================================
   *  Campaign State
   * =========================================================== */
  const [campaign, setCampaign] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get("campaign") || "Aliados";
  });

  /* ===========================================================
   *  Fetch principal de gestiones (optimizado)
   * =========================================================== */
  const fetchManagement = useCallback(
    async (page = 1, search = "", column = "", currentCampaign = campaign) => {
      if (isFetching.current) return;
      
      isFetching.current = true;
      setLoading(true);
      try {
        const data = await getManagements(page, search, currentCampaign, column);
        // Update count based on current campaign and search results
        const totalCount = data.pagination?.total ?? 0;
        if (currentCampaign.toLowerCase() === 'afiliados') {
          setManagementCountAfiliados(totalCount);
        } else {
          setManagementCountAliados(totalCount);
        }
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
    [campaign]
  );

  // Cargar gestiones cuando cambie la página, búsqueda o filtro
  useEffect(() => {
    fetchManagement(currentPage, debouncedSearchTerm, filterColumn, campaign);
  }, [currentPage, debouncedSearchTerm, filterColumn, campaign, fetchManagement]);

  // Inicializar contadores de ambas campañas al montar el componente
  useEffect(() => {
    const initializeCounts = async () => {
      try {
        // Fetch count for the opposite campaign (the one not currently active)
        const oppositeCampaign = campaign === "Aliados" ? "Afiliados" : "Aliados";
        const data = await getManagements(1, debouncedSearchTerm, oppositeCampaign, filterColumn);
        const totalCount = data.pagination?.total ?? 0;
        
        if (oppositeCampaign.toLowerCase() === 'afiliados') {
          setManagementCountAfiliados(totalCount);
        } else {
          setManagementCountAliados(totalCount);
        }
      } catch (err) {
        console.error("Error al inicializar contadores:", err);
      }
    };

    initializeCounts();
  }, [debouncedSearchTerm, filterColumn, campaign]);

  /* ===========================================================
   *  Paginación y búsqueda con filtro
   * =========================================================== */
  const fetchPage = useCallback(
    (page) => fetchManagement(page, debouncedSearchTerm, filterColumn, campaign),
    [fetchManagement, debouncedSearchTerm, filterColumn, campaign]
  );

  const handleSearch = useCallback(
    (value, column = "") => {
      setSearchTerm(value);
      setFilterColumn(column);
      setCurrentPage(1);
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

      await updateManagementMonitoring(formData.id, payload, campaign);

      Swal.fire({
        title: "Gestión actualizada",
        text: "Los cambios han sido guardados correctamente.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      setFormData({
        id: null,
        user_id: "",
        consultation_id: "",
        contact_id: "",
        solution_date: "",
        monitoring_id: "",
      });

      setOnMonitoring(false);
      setIsOpenADD(false);
      fetchManagement(currentPage, debouncedSearchTerm, filterColumn);
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
   *  Sincronizar URL con searchTerm
   * =========================================================== */
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get("search");

    if (searchParam !== null && searchParam !== searchTerm) {
      setSearchTerm(searchParam);
      setCurrentPage(1);
    }
  }, [location.search]);

  const handleClearSearch = useCallback(() => {
    setSearchTerm("");
    setFilterColumn("");
    setCurrentPage(1);
    navigate(location.pathname, { replace: true });
  }, [navigate, location.pathname]);

  /* ===========================================================
   *  Return
   * =========================================================== */
  return {
    // Datos
    management,
    monitoring,
    formData,
    validationErrors,
    searchTerm,
    filterColumn,
    managementCountAliados,
    managementCountAfiliados,

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
    handleClearSearch,
    handleSubmit,
    setFormData,
    setIsOpenADD,
    setOnMonitoring,
    setView,
    setCurrentPage,
    
    // Campaign
    campaign,
    setCampaign,
  };
};