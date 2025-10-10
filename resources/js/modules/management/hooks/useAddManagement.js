import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import {
  getManagements,
  saveManagement,

  getActiveTypeManagements,
  getActiveConsultations,
  getActiveSpecificConsultations,
  getActivePayrolls,
  getContacts
} from "@modules/management/services/managementService";

export const useAddManagement = () => {
  const [management, setManagement] = useState([]);
  const [payroll, setPayroll] = useState([]);
  const [contact, setContact] = useState([]);
  const [consultation, setConsultation] = useState([]);
  const [typeManagement, setTypeManagement] = useState([]);
  const [specific, setSpecific] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [IsOpenADD, setIsOpenADD] = useState(false);
  const [view, setView] = useState(false);
  const [modal, setModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  /* ===========================================================
   *  FETCH GESTIONES
   * =========================================================== */
  const fetchManagement = useCallback(async (page = 1, search = "") => {
    setLoading(true);
    try {
      const data = await getManagements(page, search);
      setManagement(data.managements);
      setTotalPages(data.pagination.last_page);
      setCurrentPage(data.pagination.current_page);
    } catch (err) {
      console.error(err);
      setError("Error al obtener las gestiones.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchManagement(currentPage, searchTerm);
  }, [fetchManagement, currentPage, searchTerm]);

  const fetchPage = useCallback(
    (page) => fetchManagement(page, searchTerm),
    [fetchManagement, searchTerm]
  );

  const handleSearch = useCallback((value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  }, []);

  /* ===========================================================
   *  CREAR / ACTUALIZAR GESTIÓN
   * =========================================================== */
const handleSubmit = async (payload) => {
  setLoading(true);
  setValidationErrors({});

  try {
    const response = await saveManagement(payload);

    Swal.fire({
      title: "Gestión guardada",
      text: "La gestión ha sido creada correctamente.",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    });

    setIsOpenADD(false);
    fetchManagement(currentPage, searchTerm);
    return true;

  } catch (error) {
    if (error.response?.status === 422) {
      setValidationErrors(error.response.data.errors);
    } else {
      console.error("Error al guardar gestión:", error);
      Swal.fire({
        title: "Error",
        text: "Ocurrió un error al guardar la gestión.",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
      });
    }
    return false;
  } finally {
    setLoading(false);
  }
};


  /* ===========================================================
   *  FETCH LISTAS (Pagadurías, Contactos, Consultas, etc.)
   * =========================================================== */
  const fetchPayroll = useCallback(async () => {
    try {
      const data = await getActivePayrolls();
      setPayroll(data);
    } catch {
      setError("Error al obtener los payrolls.");
    }
  }, []);
  const fetchContact = useCallback(async (page = 1, search = "") => {
    setLoading(true);
    try {
      const data = await getContacts(page, search);
      setContact(data);

    } catch (err) {
      console.error(err);
      setError("Error al obtener los contactos.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTypeManagement = useCallback(async () => {
    try {
      const data = await getActiveTypeManagements();
      setTypeManagement(data);
    } catch {
      setError("Error al obtener los tipos de gestión.");
    }
  }, []);

  const fetchConsultation = useCallback(async () => {
    try {
      const data = await getActiveConsultations();
      setConsultation(data);
    } catch {
      setError("Error al obtener las consultas.");
    }
  }, []);

  const fetchSpecific = useCallback(async () => {
    try {
      const data = await getActiveSpecificConsultations();
      setSpecific(data);
    } catch {
      setError("Error al obtener las consultas específicas.");
    }
  }, []);

  useEffect(() => {
    fetchPayroll();
    fetchContact();

    fetchTypeManagement();
    fetchConsultation();
    fetchSpecific();
  }, [fetchPayroll, fetchContact, fetchTypeManagement, fetchConsultation, fetchSpecific]);

  /* ===========================================================
   *  LIMPIAR ERRORES
   * =========================================================== */
  const clearValidationError = (field) => {
    setValidationErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

   /* ===========================================================
   *  ENVIO DE SMS
   * =========================================================== */

  const fetchSMS = useCallback(async () => {
    try {
      const data = await getActiveSpecificConsultations();
      setSpecific(data);
    } catch {
      setError("Error al obtener las consultas específicas.");
    }
  }, []);


  /* ===========================================================
   *  RETORNO DEL HOOK
   * =========================================================== */
  return {
    // Datos
    management,
    payroll,
    contact,
    consultation,
    typeManagement,
    specific,

    // Estados
    loading,
    error,
    view,
    modal,
    IsOpenADD,
    validationErrors,
    totalPages,
    currentPage,

    // Acciones
    setView,
    setModal,
    setIsOpenADD,
    setCurrentPage,
    setValidationErrors,
    fetchPage,
    fetchManagement,
    handleSearch,
    handleSubmit,
    clearValidationError,
  };
};
