import { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { AuthContext } from "@context/AuthContext";
import Swal from "sweetalert2";

export const useManagement = () => {
  const { token } = useContext(AuthContext);
  const [view, setView] = useState(false);
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
  const [IsOpenADD ,setIsOpenADD] = useState(false);
  const [validationErrors, setValidationErrors]    = useState({});
  const [formData, setFormData] = useState({
    id: null,
    usuario_id: "",
    payroll_id: "",   
    consultation_id: "",
    consultation_title: "",
    contact_id: "",
    contact_email: "",
    contact: "",
    consultation: "",
    contact_identification: "",
    contact_phone: "",
  });

  // 🔹 Obtener gestiones (con payroll)
  const fetchManagement = useCallback(
    async (page = 1, search = "") => {
      setLoading(true);
      setError(null);
      try {
        const url = `/api/management?page=${page}&search=${encodeURIComponent(search)}`;
        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const mappedData = res.data.data.map((gestion) => ({
          id                  : gestion.id,
          usuario_id          : gestion.usuario     ?.id   || null,
          usuario_name        : gestion.usuario     ?.name || "—",
          // ----------------------------------------------------------------------------------------------                                     
          payroll_id          : gestion.payroll     ?.id   || null,
          payroll_name        : gestion.payroll     ?.name || gestion.payroll?.type || "—",
          payroll             : gestion.payroll            || "Sin payroll",
          // ----------------------------------------------------------------------------------------------
          consultation_id     : gestion.consultation?.id                  || null,
          consultation_title  : gestion.consultation?.reason_consultation || "No hay consulta",
          consultation        : gestion.consultation                      || {},
          // ----------------------------------------------------------------------------------------------
          contact_id          : gestion.contact     ?.id   || null,
          contact_name        : gestion.contact     ?.name || "—",
          contact             : gestion.contact            || "Sin contacto",
          contact_email       : gestion.contact.email      || "Sin correo",
          contact_identification : gestion.contact.identification_number || "Número de identificación",
          contact_phone       : gestion.contact.phone     || "Sin Teléfono",
          // -----------------------------------------------------------------------------------------------
          created_at          : gestion.created_at
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

  const fetchPage = useCallback(
    (page) => {
      return fetchManagement(page, searchTerm);
    },
    [fetchManagement, searchTerm]
  );

  const handleSearch = useCallback((value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  }, []);

  useEffect(() => {
    fetchManagement(currentPage, searchTerm);
  }, [currentPage, searchTerm, fetchManagement]);

  // 🔹 Manejar edición
  const handleEdit = (gestion) => {
    setFormData({
      id                  : gestion.id,
      usuario_id          : gestion.usuario?.id   || null,
      usuario_name        : gestion.usuario?.name || "—",
      // ----------------------------------------------------------------------------------------------                                     
      payroll_id          : gestion.payroll?.id   || null,
      payroll_name        : gestion.payroll?.name || gestion.payroll?.type || "—",
      payroll             : gestion.payroll       || "Sin payroll",
      // ----------------------------------------------------------------------------------------------
      consultation_id     : gestion.consultation?.id                  || null,
      consultation_title  : gestion.consultation?.reason_consultation || "No hay consulta",
      consultation        : gestion.consultation                      || {},
      consultation_specific: gestion.consultation?.specific_reason     || "No hay consulta especifica",
      // ----------------------------------------------------------------------------------------------
      contact_id          : gestion.contact?.id   || null,
      contact_name        : gestion.contact?.name || "—",
      contact             : gestion.contact       || "Sin contacto",
      contact_email       : gestion.contact.email || "Sin correo",
      contact_identification : gestion.contact.identification_number || "Número de identificación",
      contact_phone       : gestion.contact.phone || "Sin Teléfono",
      // -----------------------------------------------------------------------------------------------
      created_at          : gestion.created_at
    });
    setValidationErrors({});
    setIsOpenADD(true);
  };

  // 🔹 Crear o actualizar
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setValidationErrors({});

    try {
      let response;
      const payload = { ...formData };

      Object.keys(payload).forEach((key) => {
        if (payload[key] === "true") payload[key] = true;
        if (payload[key] === "false") payload[key] = false;
      });

      if (formData.id) {
        response = await axios.put(
          `/api/management/${formData.id}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
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
        fetchConsultation(currentPage);
      }
    } catch (error) {
      if (error.response?.status === 422) {
        setValidationErrors(error.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------
  // 🔹 Lista autocompletable de Payrolls
  const fetchPayroll = useCallback(
    async () => {
      try {
        const res = await axios.get(`/api/payrolls`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPayroll(res.data.payrolls);
      } catch (err) {
        setError("Error al obtener los payrolls.");
      }
    },
    [token]
  );

  useEffect(() => {
    fetchPayroll();
  }, [fetchPayroll]);

  // 🔹 Contactos
  const fetchContact = useCallback(
    async () => {
      try {
        const res = await axios.get(`/api/contacts`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setContact(res.data.contacts);
      } catch (err) {
        setError("Error al obtener los contactos.");
      }
    },
    [token]
  );

  useEffect(() => {
    fetchContact();
  }, [fetchContact]);

  // 🔹 Tipos de gestión
  const fetchTypeManagement = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/typemanagements?page=${page}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const list = res.data.typeManagement || res.data.data || [];

        const mappedData = list.map((typeManagement) => ({
          id: typeManagement.id,
          // payroll_names: string para mostrar en tabla
          payroll_names:
            (typeManagement.payrolls || typeManagement.payroll || []).length > 0
              ? (typeManagement.payrolls || typeManagement.payroll).map((c) => c.name).join(", ")
              : "—",
          // payroll_array: array de objetos {id,name} si editas
          payroll_array: (typeManagement.payrolls || typeManagement.payroll || []).map((c) => ({
            id: c.id,
            name: c.name,
          })),
          name: typeManagement.name,
          is_active: typeManagement.is_active,
        }));

        setTypeManagement(mappedData);
        setTotalPages(res.data.meta?.last_page || 1);
        setCurrentPage(res.data.meta?.current_page || page);
      } catch (err) {
        console.error(err);
        setError("Error al obtener los tipos de gestión.");
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  useEffect(() => {
    fetchTypeManagement();
  }, [fetchTypeManagement]);

  // 🔹 Consultas
  const fetchConsultation = useCallback(
    async () => {
      try {
        const res = await axios.get(`/api/consultations`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setConsultation(res.data.consultations);
      } catch (err) {
        setError("Error al obtener las consultas.");
      }
    },
    [token]
  );

  useEffect(() => {
    fetchConsultation();
  }, [fetchConsultation]);

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
    fetchPage,
    searchTerm,
    handleSearch,
    setSearchTerm,
    setCurrentPage,
    handleEdit,
    handleSubmit,
    setIsOpenADD,
    IsOpenADD,
    validationErrors,

    fetchPayroll,    
    fetchTypeManagement,
    payroll,         
    contact,
    typeManagement,
    consultation,
  };
};
