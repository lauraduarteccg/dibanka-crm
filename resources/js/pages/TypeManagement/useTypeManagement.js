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
    campaign: [], // <-- array of campaign ids
    is_active: true,
  });

  // Traer lista de tipos (paginated)
  const fetchConsultation = useCallback(
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

  // Manejar la edición: cargar formData con ids
  const handleEdit = (typemanagementRow) => {
    // typemanagementRow puede venir desde la tabla (mapeado más arriba)
    const campaignIds =
      typemanagementRow.campaign_array?.map((c) => c.id) ?? typemanagementRow.campaign ?? [];
    setFormData({
      id: typemanagementRow.id,
      name: typemanagementRow.name,
      campaign: Array.isArray(campaignIds) ? campaignIds : [campaignIds],
      is_active: typemanagementRow.is_active ?? true,
    });
    setValidationErrors({});
    setIsOpenADD(true);
  };

  // Crear o actualizar
  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setLoading(true);
    setValidationErrors({});

    try {
      // Normalizar payload: backend espera campaign_id => array
      const payload = {
        name: formData.name,
        is_active: formData.is_active,
        campaign_id: Array.isArray(formData.campaign) ? formData.campaign : [],
      };

      let response;
      if (formData.id) {
        response = await axios.put(`/api/typemanagements/${formData.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        response = await axios.post("/api/typemanagements", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      if (response.status === 200 || response.status === 201) {
        Swal.fire({
          title: formData.id ? "Tipo actualizado" : "Tipo creado",
          text: "Los cambios han sido guardados correctamente.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });

        setIsOpenADD(false);
        setFormData({ id: null, name: "", campaign: [], is_active: true });
        // recargar la página actual
        fetchConsultation(currentPage || 1);
      }
    } catch (error) {
      console.error(error);
      if (error.response?.status === 422) {
        setValidationErrors(error.response.data.errors || {});
      } else {
        setError(error.response?.data?.message || "Error al guardar tipo de gestión.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Activar/Desactivar (toggle)
  const handleDelete = async (id, status) => {
    const actionText = !status ? "activar" : "desactivar";

    const result = await Swal.fire({
      position: "top-end",
      title: `¿Quieres ${actionText} este tipo?`,
      text: `El tipo será marcado como ${!status ? "Activo" : "Inactivo"}.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: !status ? "#28a745" : "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: `Sí, ${actionText}`,
      cancelButtonText: "Cancelar",
      width: "350px",
      padding: "0.8em",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await axios.delete(`/api/typemanagements/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        Swal.fire({
          position: "top-end",
          title: "Estado actualizado",
          text: `El tipo ahora está ${!status ? "Activo" : "Inactivo"}.`,
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
          text: "No se pudo actualizar el tipo.",
          icon: "error",
          width: "350px",
          padding: "0.8em",
        });
      }
    } catch (error) {
      Swal.fire({
        position: "top-end",
        title: "Error",
        text: error.response?.data?.message || "No se pudo actualizar el tipo.",
        icon: "error",
      });
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
        // soporta data o campaigns según tu response
        setCampaign(res.data.campaigns || res.data.data || res.data || []);
      } catch (err) {
        console.error(err);
        setError("Error al obtener las pagadurias.");
      }
    },
    [token]
  );

  useEffect(() => {
    fetchCampaign();
  }, [fetchCampaign]);

  useEffect(() => {
    fetchConsultation(1);
  }, [fetchConsultation]);

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
