import { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { AuthContext } from "@context/AuthContext";
import Swal from "sweetalert2";

export const useManagement = () => {
  const { token } = useContext(AuthContext);

  const [management, setManagement] = useState([]);
  const [payroll, setPayroll] = useState([]);
  const [contact, setContact] = useState([]);
  const [consultation, setConsultation] = useState([]);
  const [typeManagement, setTypeManagement] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [IsOpenADD, setIsOpenADD] = useState(false);
  const [view, setView] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const [formData, setFormData] = useState({
    id: null,
    user_id: "",
    payroll_id: "",
    consultation_id: "",
    contact_id: "",
  });

  // 🔹 Obtener gestiones
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

  // 🔹 Editar gestión
  const handleEdit = (gestion) => {
    setFormData({
      id: gestion.id,
      user_id: gestion.user_id ?? "",
      payroll_id: gestion.payroll_id ?? "",
      consultation_id: gestion.consultation_id ?? "",
      contact_id: gestion.contact_id ?? "",
    });
    setValidationErrors({});
    setIsOpenADD(true);
  };

  // 🔹 Crear o actualizar gestión
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setValidationErrors({});

    try {
      const payload = { ...formData };
      let response;

      if (formData.id) {
        response = await axios.put(`/api/management/${formData.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        response = await axios.post("/api/management", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      if (response.status === 200 || response.status === 201) {
        Swal.fire({
          title: formData.id ? "Gestión actualizada" : "Gestión creada",
          text: "Los cambios han sido guardados correctamente.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
        setIsOpenADD(false);
        fetchManagement(currentPage, searchTerm);
      }
    } catch (error) {
      if (error.response?.status === 422) {
        setValidationErrors(error.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Payrolls
  const fetchPayroll = useCallback(async () => {
    try {
      const res = await axios.get(`/api/payrolls`, {
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
      const res = await axios.get(`/api/typemanagements`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTypeManagement(res.data.data || []);
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
      const res = await axios.get(`/api/consultations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setConsultation(res.data.consultations || []);
    } catch {
      setError("Error al obtener las consultas.");
    }
  }, [token]);

  useEffect(() => {
    fetchConsultation();
  }, [fetchConsultation]);

  return {
    view,
    setView,

    management,
    payroll,
    contact,
    consultation,
    typeManagement,

    loading,
    error,
    formData,
    setFormData,
    currentPage,
    totalPages,
    searchTerm,
    IsOpenADD,
    validationErrors,

    fetchManagement,
    fetchPage,
    handleSearch,
    setCurrentPage,
    handleEdit,
    handleSubmit,
    setIsOpenADD,
  };
};
