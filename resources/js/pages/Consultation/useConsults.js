import { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { AuthContext } from "@context/AuthContext";
import Swal from "sweetalert2";

export const useConsults = () => {
  const { token } = useContext(AuthContext);

  const [consultations, setConsultations] = useState([]);
  const [consultationSpecifics, setConsultationSpecifics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isOpenADD, setIsOpenADD] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    reason_consultation: "",
    specific_reason: [],
    is_active: true,
  });

  // ---------------------------------------------------------
  // Traer lista de consultations
  const fetchConsultation = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/consultations?page=${page}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const list = res.data.consultations || res.data.data || [];
        // mapeo ligero por si cambia la estructura
        const mapped = list.map((i) => {
        const specifics = i.specifics || []; // array de objects [{id, specific_reason, ...}]
        return {
            id: i.id,
            reason_consultation: i.reason_consultation,
            specifics,
            specific_names: specifics.map((s) => s.specific_reason).join(", "), // para la tabla
            is_active: i.is_active,
        };
        });
        setConsultations(mapped);

        console.log("Consultations fetched:", mapped);
        setTotalPages(res.data.pagination?.total_pages || res.data.meta?.last_page || 1);
        setCurrentPage(res.data.pagination?.current_page || page);
      } catch (err) {
        console.error(err);
        setError("Error al obtener las consultas.");
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  // ---------------------------------------------------------
  // Traer lista de consultationSpecifics (para llenar specific_reason)
  const fetchConsultationSpecifics = useCallback(
    async (page = 1) => {
      // Nota: si quieres todas las specifics para un select, pide un endpoint sin paginar
      setLoading(true);
      try {
        const res = await axios.get(`/api/consultationspecifics?page=${page}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const list = res.data.consultations || res.data.data || [];

        // Mapeamos a la forma que probablemente usarás: { id, specific_reason, is_active }
        const mapped = list.map((s) => ({
          id: s.id,
          specific_reason: s.specific_reason,
          is_active: s.is_active,
        }));

        setConsultationSpecifics(mapped);
        // Si este endpoint también controla paginación (para su propia tabla), la dejamos
        setTotalPages(res.data.pagination?.total_pages || res.data.meta?.last_page || totalPages);
        setCurrentPage(res.data.pagination?.current_page || currentPage || page);
      } catch (err) {
        console.error(err);
        setError("Error al obtener las consultas específicas.");
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  // ---------------------------------------------------------
  // Manejar la edición de una consulta (rellenar form)
    const handleEdit = (row) => {
    // Obtener los IDs de los motivos específicos
    const specificIds = row.specifics 
        ? row.specifics.map(s => s.id) 
        : (Array.isArray(row.specific_reason) ? row.specific_reason : []);

    setFormData({
        id: row.id ?? null,
        reason_consultation: row.reason_consultation ?? "",
        specific_reason: specificIds, // Aquí deben ir los IDs, no los textos
        is_active: row.is_active ?? true,
    });
    setValidationErrors({});
    setIsOpenADD(true);
    };


  // utilidad: asignar specific_reason seleccionada (por texto o por id)
  // si recibes id, busca en consultationSpecifics y asigna el texto
  const handleSelectSpecificById = (specificId) => {
    const found = consultationSpecifics.find((s) => String(s.id) === String(specificId));
    if (found) {
      setFormData((prev) => ({ ...prev, specific_reason: found.specific_reason }));
    } else {
      // si no existe, deja el valor vacío o como el id si prefieres
      setFormData((prev) => ({ ...prev, specific_reason: "" }));
    }
  };

  // ---------------------------------------------------------
// Crear o actualizar consulta
const handleSubmit = async (e) => {
  if (e && e.preventDefault) e.preventDefault();
  setLoading(true);
  setValidationErrors({});

  try {
    // Normalizar payload: backend espera specific_id => array
    const payload = {
      reason_consultation: formData.reason_consultation,
      specific_id: Array.isArray(formData.specific_reason)
        ? formData.specific_reason
        : [],
      is_active: formData.is_active,
    };

    let response;
    if (formData.id) {
      response = await axios.put(`/api/consultations/${formData.id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } else {
      response = await axios.post("/api/consultations", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }

    if (response.status === 200 || response.status === 201) {
      Swal.fire({
        title: formData.id ? "Consulta actualizada" : "Consulta creada",
        text: "Los cambios han sido guardados correctamente.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      setIsOpenADD(false);
      setFormData({ id: null, reason_consultation: "", specific_reason: [], is_active: true });

      // refrescar tablas
      fetchConsultation(currentPage || 1);
      fetchConsultationSpecifics(1);
    }
  } catch (error) {
    console.error(error);
    if (error.response?.status === 422) {
      setValidationErrors(error.response.data.errors || {});
    } else {
      setError(error.response?.data?.message || "Error al guardar la consulta.");
    }
  } finally {
    setLoading(false);
  }
};


  // ---------------------------------------------------------
  // Activar/Desactivar consulta
  const handleDelete = async (id, status) => {
    const actionText = !status ? "activar" : "desactivar";

    const result = await Swal.fire({
      position: "top-end",
      title: `¿Quieres ${actionText} esta consulta?`,
      text: `La consulta será marcada como ${!status ? "Activo" : "Inactivo"}.`,
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
      const response = await axios.delete(`/api/consultations/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        Swal.fire({
          position: "top-end",
          title: "Estado actualizado",
          text: `La consulta ahora está ${!status ? "Activo" : "Inactivo"}.`,
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
        });
      }
    } catch (err) {
      Swal.fire({
        position: "top-end",
        title: "Error",
        text: err.response?.data?.message || "No se pudo actualizar la consulta.",
        icon: "error",
      });
    }
  };

  // ---------------------------------------------------------
  useEffect(() => {
    // cargamos ambas listas al montar (la específica la puedes usar en selects/autocomplete)
    fetchConsultation(1);
    fetchConsultationSpecifics(1);
  }, [fetchConsultation, fetchConsultationSpecifics]);

  return {
    // datos para tablas
    consultations,
    consultationSpecifics, // <-- lista que debes usar para poblar specific_reason (select/datalist)

    // estados y control
    loading,
    error,
    isOpenADD,
    setIsOpenADD,
    formData,
    setFormData,
    validationErrors,
    currentPage,
    totalPages,

    // acciones
    fetchConsultation,
    fetchConsultationSpecifics,
    handleEdit,
    handleSelectSpecificById, // util para cuando tu select te devuelve un id
    handleSubmit,
    handleDelete,
  };
};
