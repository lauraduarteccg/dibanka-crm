import { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { AuthContext } from "@context/AuthContext";
import Swal from "sweetalert2";

export const useTypeManagement = () => {
  const { token } = useContext(AuthContext);
  const [typemanagement, setTypeManagement] = useState([]);
  const [campaign, setCampaign] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isOpenADD, setIsOpenADD] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    campaign: [],
    is_active: true,
  });

  // Tabla de pagadurias
  const fetchConsultation = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/typemanagements?page=${page}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const list = res.data.typeManagement || res.data.data || [];
        const mappedData = list.map((typeManagement) => ({
          id        : typeManagement.id,
          campaign  : typeManagement.campaign?.name ?? [],
          name      : typeManagement.name,
          is_active : typeManagement.is_active,
        }));

        setTypeManagement(mappedData);

        const pagination = res.data.pagination || res.data.meta || {};
        setTotalPages(pagination.total_pages ?? pagination.last_page ?? 1);
        setCurrentPage(pagination.current_page ?? pagination.current_page ?? page);
        console.log(list);
      } catch (err) {
        setError("Error al obtener los contactos.");
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  useEffect(() => {
    fetchConsultation(1);
  }, [fetchConsultation]);

  // Manejar la edición de consultas
  const handleEdit = (typemanagementRow) => {
    setFormData({
      id        : typemanagementRow.id,
      name      : typemanagementRow.name,
      campaign  : typemanagementRow.campaign ?? [], 
      is_active : typemanagementRow.is_active ?? true,
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

      Object.keys(payload).forEach((key) => {
        if (payload[key] === "true") payload[key] = true;
        if (payload[key] === "false") payload[key] = false;
      });

      if (formData.id) {
        // Actualizar
        response = await axios.put(`/api/typemanagements/${formData.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        // Crear
        response = await axios.post("/api/typemanagements", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      if (response.status === 200 || response.status === 201) {
        Swal.fire({
          title: formData.id ? "Contacto actualizado" : "Contacto creado",
          text: "Los cambios han sido guardados correctamente.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });

        setIsOpenADD(false);
        // volver a cargar la página actual
        fetchConsultation(currentPage || 1);
      }
    } catch (error) {
      if (error.response?.status === 422) {
        setValidationErrors(error.response.data.errors);
      } else {
        // opcional: mostrar error genérico
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  // Desactivar / activar
  const handleDelete = async (id, status) => {
    const actionText = !status ? "activar" : "desactivar";

    Swal.fire({
      position: "top-end",
      title: `¿Quieres ${actionText} este contacto?`,
      text: `La contacto será marcado como ${!status ? "Activo" : "Inactivo"}.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: !status ? "#28a745" : "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: `Sí, ${actionText}`,
      cancelButtonText: "Cancelar",
      width: "350px",
      padding: "0.8em",
      customClass: {
        title: "swal-title-small",
        popup: "swal-full-height",
        confirmButton: "swal-confirm-small",
        cancelButton: "swal-cancel-small",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(`/api/typemanagements/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.status === 200) {
            Swal.fire({
              position: "top-end",
              title: "Estado actualizado",
              text: `El contacto ahora está ${!status ? "Activo" : "Inactivo"}.`,
              icon: "success",
              timer: 1500,
              showConfirmButton: false,
              width: "350px",
              padding: "0.8em",
            });
            fetchConsultation(currentPage || 1);
          } else {
            Swal.fire({
              position: "top-end",
              title: "Error",
              text: "No se pudo actualizar la consulta.",
              icon: "error",
              width: "350px",
              padding: "0.8em",
            });
          }
        } catch (error) {
          Swal.fire({
            position: "top-end",
            title: "Error",
            text: error.response?.data?.message || "No se pudo actualizar el contacto.",
            icon: "error",
            width: "350px",
            padding: "0.8em",
          });
        }
      }
    });
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


  return {
    campaign,
    typemanagement,
    loading,
    error,
    isOpenADD,
    setIsOpenADD,
    formData,
    setFormData,
    validationErrors,
    handleSubmit,
    currentPage,
    totalPages,
    fetchConsultation,
    handleEdit,
    handleDelete,
  };
};
