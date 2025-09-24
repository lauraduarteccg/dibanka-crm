import { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { AuthContext } from "@context/AuthContext";
import Swal from "sweetalert2";

export const useAddManagement = () => {
  const { token } = useContext(AuthContext);

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
  const [validationErrors, setValidationErrors] = useState({});

  // 🔹 Obtener gestiones
  const fetchManagement = useCallback(
    async (page = 1, search = "") => {
      setLoading(true);
      setError(null);
      try {
        const url = `/api/management?page=${page}&search=${encodeURIComponent(
          search
        )}`;
        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setManagement(res.data.managements || []);
        setTotalPages(res.data.meta?.last_page ?? 1);
        setCurrentPage(res.data.meta?.current_page ?? page);
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

  // 🔹 Crear o actualizar gestión
  const handleSubmit = async (payload) => {
    setLoading(true);
    setValidationErrors({});

    // 🔹 Convertir campos vacíos a null
    const preparedPayload = { ...payload };

    try {
      let response;
      if (preparedPayload.id) {
        // Actualizar
        response = await axios.put(`/api/management/${preparedPayload.id}`, preparedPayload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        // Crear nueva gestión
        response = await axios.post("/api/management", preparedPayload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      if (response.status === 200 || response.status === 201) {
        // 🔹 Mostrar popup de éxito
        await Swal.fire({
          title: "Gestión guardada",
          text: "La gestión ha sido creada correctamente.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });

        // 🔹 Limpiar el formulario y cerrar modal (si corresponde)
        setIsOpenADD(false);
        // Opcional: refrescar la lista de gestiones
        fetchManagement(currentPage, searchTerm);
      }
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
    } finally {
      setLoading(false);
    }
  };



  // 🔹 Pagadurias
  const fetchPayroll = useCallback(async () => {
    try {
      const res = await axios.get(`/api/payrolls/active`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPayroll(res.data.payrolls || []);
    } catch {
      setError("Error al obtener los payrolls.");
    }
  }, [token]);

  useEffect(() => {
    fetchPayroll();
  }, [fetchPayroll]);

  // 🔹 Contactos
  const fetchContact = useCallback(async () => {
    try {
      const res = await axios.get(`/api/contacts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setContact(res.data.contacts || []);
    } catch {
      setError("Error al obtener los contactos.");
    }
  }, [token]);

  useEffect(() => {
    fetchContact();
  }, [fetchContact]);

  // 🔹 Tipos de gestión
  const fetchTypeManagement = useCallback(async () => {
    try {
      const res = await axios.get(`/api/typemanagements/active`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTypeManagement(res.data.typeManagement || []);
    } catch {
      setError("Error al obtener los tipos de gestión.");
    }
  }, [token]);

  useEffect(() => {
    fetchTypeManagement();
  }, [fetchTypeManagement]);


  // 🔹 Consultas
  const fetchConsultation = useCallback(async () => {
    try {
      const res = await axios.get(`/api/consultations/active`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setConsultation(res.data.consultation || []);
    } catch {
      setError("Error al obtener las consultas.");
    }
  }, [token]);

  useEffect(() => {
    fetchConsultation();
  }, [fetchConsultation]);
  

  // 🔹 Consultas especificas
  const fetchSpecific = useCallback(async () => {
    try {
      const res = await axios.get(`/api/consultationspecifics/active`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSpecific(res.data.consultationspecific || []);
    } catch {
      setError("Error al obtener las consultas especificas.");
    }
  }, [token]);


  useEffect(() => {
    fetchSpecific();
  }, [fetchSpecific]);


  return {
    view,
    setView,
    specific,
    management,
    payroll,
    contact,
    consultation,
    typeManagement,
    loading,
    error,
    currentPage,
    totalPages,
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
