import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import {
  getConsultationSpecifics,
  createConsultationSpecific,
  updateConsultationSpecific,
  deleteConsultationSpecific,
  getConsultationsForSelect,
} from "@modules/config/consultationSpecific/services/consultationSpecificService";

export const useConsultSpecifics = () => {
  const [consultation, setConsultation] = useState([]);
  const [consultationNoSpecific, setConsultationNoSpecific] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [isOpenADD, setIsOpenADD] = useState(false);

  const [formData, setFormData] = useState({
    id: null,
    name: "",
    consultation_id: null,
  });

  /* ===========================================================
   *  Obtener lista de consultas específicas
   * =========================================================== */
  const fetchConsultationSpecifics = useCallback(async (page = 1, search = "") => {
    setLoading(true);
    try {
      const data = await getConsultationSpecifics(page, search);
      setConsultation(data.specifics);
      setTotalPages(data.pagination.total_pages);
      setCurrentPage(data.pagination.current_page);
      setPerPage(data.pagination.per_page);
      setTotalItems(data.pagination.total_specifics);
    } catch (err) {
      console.error(err);
      setError("Error al obtener las consultas específicas.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConsultationSpecifics(1);
  }, [fetchConsultationSpecifics]);

  const fetchPage = useCallback(
    (page) => fetchConsultationSpecifics(page, searchTerm),
    [fetchConsultationSpecifics, searchTerm]
  );

  const handleSearch = useCallback(
    (value) => {
      setSearchTerm(value);
      setCurrentPage(1);
      fetchConsultationSpecifics(1, value);
    },
    [fetchConsultationSpecifics]
  );

  /* ===========================================================
   *  Cargar consultas generales
   * =========================================================== */
  const fetchConsultations = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getConsultationsForSelect();
      setConsultationNoSpecific(data.consultation);
      //console.log(data.consultation);
    } catch (err) {
      console.error("Error al obtener las consultas generales:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConsultations();
  }, [fetchConsultations]);

  /* ===========================================================
   *  Crear o actualizar
   * =========================================================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setValidationErrors({});

    try {
      if (formData.id) {
        await updateConsultationSpecific(formData.id, formData);
        Swal.fire("Consulta específica actualizada", "Los cambios se guardaron correctamente.", "success");
      } else {
        await createConsultationSpecific(formData);
        Swal.fire("Consulta específica creada", "Se ha registrado correctamente.", "success");
      }

      setIsOpenADD(false);
      fetchConsultationSpecifics(currentPage);
    } catch (error) {
      if (error.response?.status === 422) {
        setValidationErrors(error.response.data.errors);
      } else {
        Swal.fire("Error", "Hubo un problema al guardar la consulta específica.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  /* ===========================================================
   *  Editar
   * =========================================================== */
  const handleEdit = (item) => {
    setFormData({
      id: item.id,
      name: item.name,
      consultation_id: item.consultation_id,
    });
    setValidationErrors({});
    setIsOpenADD(true);
  };

  /* ===========================================================
   *  Eliminar
   * =========================================================== */
  const handleDelete = async (id, status) => {
    const actionText = !status ? "activar" : "desactivar";

    Swal.fire({
      position: "top-end",
      title: `¿Quieres ${actionText} esta consulta específica?`,
      text: `Será marcada como ${!status ? "Activa" : "Inactiva"}.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: !status ? "#28a745" : "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: `Sí, ${actionText}`,
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteConsultationSpecific(id);
          Swal.fire("Estado actualizado", "La consulta específica se actualizó correctamente.", "success");
          fetchConsultationSpecifics(currentPage);
        } catch {
          Swal.fire("Error", "No se pudo actualizar la consulta específica.", "error");
        }
      }
    });
  };

  const handleOpenForm = () => {
    setValidationErrors({});
    setFormData({ id: null, name: "", consultation_id: null });
    setIsOpenADD(true);
  };

  const handleCloseModal = () => {
    setIsOpenADD(false);
    setValidationErrors({});
  };

  return {
    handleCloseModal,
    fetchPage,
    handleSearch,
    handleOpenForm,
    consultation,
    consultationNoSpecific,
    loading,
    error,
    isOpenADD,
    setIsOpenADD,
    formData,
    setFormData,
    validationErrors,
    handleSubmit,
    perPage,
    totalItems,
    currentPage,
    totalPages,
    handleEdit,
    handleDelete,
  };
};
