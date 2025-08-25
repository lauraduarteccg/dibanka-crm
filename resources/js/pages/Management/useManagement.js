import { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { AuthContext } from "@context/AuthContext";
import Swal from "sweetalert2";

export const useManagement = () => {
  const { token } = useContext(AuthContext);
  const [view, setView] = useState(false);
  const [management, setManagement] = useState([]);
  const [campaign, setCampaign] = useState([]);
  const [contact, setContact] = useState([]);
  const [consultation, setConsultation] = useState([]);
  const [typeManagement, setTypeManagement] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState(""); // término de búsqueda
  const [IsOpenADD ,setIsOpenADD] = useState(false);
  const [validationErrors, setValidationErrors]    = useState({});
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

  // Manejar la edición de gestiones
  const handleEdit = (gestion) => {
      setFormData({
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
        consultation_specific   : gestion.consultation?.specific_reason     || "No hay consulta especifica",
        // ----------------------------------------------------------------------------------------------
        contact_id              : gestion.contact     ?.id                  || null,
        contact_name            : gestion.contact     ?.name                || "—",
        contact                 : gestion.contact                           || "Sin contacto",
        contact_email           : gestion.contact.email                     || "Sin correo",
        contact_identification  : gestion.contact.identification_number     || "Número de identificación",
        contact_phone           : gestion.contact.phone                     || "Sin Teléfono",
        // -----------------------------------------------------------------------------------------------
        created_at              : gestion.created_at
      });
      setValidationErrors({});
      setIsOpenADD(true);
  };

    // Crear o actualizar consulta
  const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setValidationErrors({});

      try {
          let response;
          const payload = { ...formData };

          // Normalizar valores antes de enviar
          // Convertir strings "true"/"false" en booleanos reales
          Object.keys(payload).forEach((key) => {
              if (payload[key] === "true") payload[key] = true;
              if (payload[key] === "false") payload[key] = false;
          });

          if (formData.id) {
              // ✅ Actualizar consulta
              response = await axios.put(
                  `/api/management/${formData.id}`,
                  payload,
                  {
                      headers: { Authorization: `Bearer ${token}` },
                  }
              );
          } else {
              // ✅ Crear consulta
              response = await axios.post("/api/management", payload, {
                  headers: { Authorization: `Bearer ${token}` },
              });
          }

          if (response.status === 200 || response.status === 201) {
              Swal.fire({
                  title: formData.id
                      ? "Gestión actualizada"
                      : "Gestión creada",
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
// Lista autocompletable de Pagaduria
  const fetchCampaign = useCallback(
      async () => {
          try {
              const res = await axios.get(`/api/campaigns`, {
                  headers: { Authorization: `Bearer ${token}` },
              });
              setCampaign   (res.data.campaigns);
          } catch (err) {
              setError("Error al obtener las pagadurias.");
          }
      },
      [token]
  );

    useEffect(() => {
    fetchCampaign();
  }, [fetchCampaign]);

// ---------------------------------------------------------
// Lista autocompletable de Pagaduria
  const fetchContact = useCallback(
      async () => {
          try {
              const res = await axios.get(`/api/contacts`, {
                  headers: { Authorization: `Bearer ${token}` },
              });
              setContact   (res.data.contacts);
          } catch (err) {
              setError("Error al obtener las pagadurias.");
          }
      },
      [token]
  );

    useEffect(() => {
    fetchContact();
  }, [fetchContact]);

// ---------------------------------------------------------
// Lista autocompletable de tipo de gestiones
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
          // campaign_names: string para mostrar en la tabla
          campaign_names:
            (typeManagement.campaigns || typeManagement.campaign || []).length > 0
              ? (typeManagement.campaigns || typeManagement.campaign).map((c) => c.name).join(", ")
              : "—",
          // campaign_array: array de objetos {id,name} si necesitas cuando editas desde la tabla
          campaign_array: (typeManagement.campaigns || typeManagement.campaign || []).map((c) => ({
            id: c.id,
            name: c.name,
          })),
          name: typeManagement.name,
          is_active: typeManagement.is_active,
        }));

        setTypeManagement(mappedData);
        setTotalPages(
          (res.data.pagination && res.data.pagination.total_pages) ||
            res.data.meta?.last_page ||
            res.data.last_page ||
            1
        );
        setCurrentPage(res.data.pagination?.current_page || res.data.meta?.current_page || page);
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

// ---------------------------------------------------------
// Lista autocompletable de Pagaduria
  const fetchConsultation = useCallback(
      async () => {
          try {
              const res = await axios.get(`/api/consultations`, {
                  headers: { Authorization: `Bearer ${token}` },
              });
              setConsultation   (res.data.consultations);
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
    handleSubmit,
    validationErrors,

    fetchCampaign,
    fetchTypeManagement,
    campaign,
    contact,
    typeManagement,
    consultation,
  };
};
