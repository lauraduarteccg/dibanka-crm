import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import {
  getSpecificAfiliados,
  saveSpecificAfiliado,
  updateSpecificAfiliado,
  deleteSpecificAfiliado,
  getConsultationsForSelect,
  getActivePayrolls,
} from "@modules/config/ConsultationSpecific/services/specificAfiliadosService";

export const useConsultSpecificsAfiliados = () => {
  const [specificAfiliados, setSpecificAfiliados] = useState([]);
  const [payroll, setPayroll] = useState([]);
  const [consultationNoSpecific, setConsultationNoSpecific] = useState([]);
  const [loadingAfiliados, setLoadingAfiliados] = useState(true);
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

  const fetchAfiliados = useCallback(async (page = 1, search = "") => {
    setLoadingAfiliados(true);
    try {
      const data = await getSpecificAfiliados(page, search);
      setSpecificAfiliados(data.specifics);
      setTotalPages(data.pagination.total_pages);
      setCurrentPage(data.pagination.current_page);
      setPerPage(data.pagination.per_page);
      setTotalItems(data.pagination.total_specifics);
    } catch (err) {
      console.error(err);
      setError("Error al obtener las consultas específicas de afiliados.");
    } finally {
      setLoadingAfiliados(false);
    }
  }, []);

  useEffect(() => {
    fetchAfiliados(1);
  }, [fetchAfiliados]);

  const fetchPageAfiliados = useCallback(
    (page) => fetchAfiliados(page, searchTerm),
    [fetchAfiliados, searchTerm]
  );

  const handleSearchAfiliados = useCallback(
    (value) => {
      setSearchTerm(value);
      setCurrentPage(1);
      fetchAfiliados(1, value);
    },
    [fetchAfiliados]
  );

  const fetchConsultations = useCallback(async () => {
    setLoadingAfiliados(true);
    try {
      const data = await getConsultationsForSelect();
      setConsultationNoSpecific(data);
    } catch (err) {
      console.error("Error al obtener las consultas generales:", err);
    } finally {
      setLoadingAfiliados(false);
    }
  }, []);

  useEffect(() => {
    fetchConsultations();
  }, [fetchConsultations]);

  const fetchPayroll = useCallback(async () => {
    setLoadingAfiliados(true);
    try {
      const data = await getActivePayrolls();
      setPayroll(data);
    } catch (err) {
      console.error("Error al obtener pagadurías:", err);
      setError("Error al obtener las pagadurías.");
    } finally {
      setLoadingAfiliados(false);
    }
  }, []);

  useEffect(() => {
    fetchPayroll();
  }, [fetchPayroll]);

  const handleSaveAfiliados = async (e) => {
    e.preventDefault();
    setLoadingAfiliados(true);
    setValidationErrors({});

    try {
      if (formData.id) {
        await updateSpecificAfiliado(formData.id, formData);
        Swal.fire("Consulta específica actualizada", "Los cambios se guardaron correctamente.", "success");
      } else {
        await saveSpecificAfiliado(formData);
        Swal.fire("Consulta específica creada", "Se ha registrado correctamente.", "success");
      }

      setIsOpenADD(false);
      fetchAfiliados(currentPage);
    } catch (error) {
      if (error.response?.status === 422) {
        setValidationErrors(error.response.data.errors);
      } else {
        Swal.fire("Error", "Hubo un problema al guardar la consulta específica.", "error");
      }
    } finally {
      setLoadingAfiliados(false);
    }
  };

  const handleEditAfiliados = (item) => {
    setFormData({
      id: item.id,
      name: item.name,
      consultation_id: item.consultation_id,
    });
    setValidationErrors({});
    setIsOpenADD(true);
  };

  const handleDeleteAfiliados = async (id, status) => {
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
          await deleteSpecificAfiliado(id);
          Swal.fire("Estado actualizado", "La consulta específica se actualizó correctamente.", "success");
          fetchAfiliados(currentPage);
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
    specificAfiliados,
    payroll,
    consultationNoSpecific,
    loadingAfiliados,
    error,
    isOpenADD,
    setIsOpenADD,
    formData,
    setFormData,
    validationErrors,
    handleSaveAfiliados,
    perPage,
    totalItems,
    currentPage,
    totalPages,
    handleEditAfiliados,
    handleDeleteAfiliados,
    fetchPageAfiliados,
    handleSearchAfiliados,
    handleOpenForm,
    handleCloseModal,
  };
};
