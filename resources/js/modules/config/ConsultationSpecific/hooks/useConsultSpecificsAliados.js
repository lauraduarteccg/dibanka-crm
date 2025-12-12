import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import {
  getSpecificAliados,
  saveSpecificAliado,
  updateSpecificAliado,
  deleteSpecificAliado,
  getConsultationsForSelect,
  getActivePayrolls,
} from "@modules/config/ConsultationSpecific/services/specificAliadosService";

export const useConsultSpecificsAliados = () => {
  const [specificAliados, setSpecificAliados] = useState([]);
  const [payroll, setPayroll] = useState([]);
  const [consultationNoSpecific, setConsultationNoSpecific] = useState([]);
  const [loadingAliados, setLoadingAliados] = useState(true);
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

  const fetchAliados = useCallback(async (page = 1, search = "") => {
    setLoadingAliados(true);
    try {
      const data = await getSpecificAliados(page, search);
      console.log(data.pagination.total_specifics)
      setSpecificAliados(data.specifics);
      setTotalPages(data.pagination.total_pages);
      setCurrentPage(data.pagination.current_page);
      setPerPage(data.pagination.per_page);
      setTotalItems(data.pagination.total_specifics);
    } catch (err) {
      console.error(err);
      setError("Error al obtener las consultas específicas de aliados.");
    } finally {
      setLoadingAliados(false);
    }
  }, []);

  useEffect(() => {
    fetchAliados(1);
  }, [fetchAliados]);

  const fetchPageAliados = useCallback(
    (page) => fetchAliados(page, searchTerm),
    [fetchAliados, searchTerm]
  );

  const handleSearchAliados = useCallback(
    (value) => {
      setSearchTerm(value);
      setCurrentPage(1);
      fetchAliados(1, value);
    },
    [fetchAliados]
  );

  const fetchConsultations = useCallback(async () => {
    setLoadingAliados(true);
    try {
      const data = await getConsultationsForSelect();
      setConsultationNoSpecific(data);
    } catch (err) {
      console.error("Error al obtener las consultas generales:", err);
    } finally {
      setLoadingAliados(false);
    }
  }, []);

  useEffect(() => {
    fetchConsultations();
  }, [fetchConsultations]);

  const fetchPayroll = useCallback(async () => {
    setLoadingAliados(true);
    try {
      const data = await getActivePayrolls();
      setPayroll(data);
    } catch (err) {
      console.error("Error al obtener pagadurías:", err);
      setError("Error al obtener las pagadurías.");
    } finally {
      setLoadingAliados(false);
    }
  }, []);

  useEffect(() => {
    fetchPayroll();
  }, [fetchPayroll]);

  const handleSaveAliados = async (e) => {
    e.preventDefault();
    setLoadingAliados(true);
    setValidationErrors({});

    try {
      if (formData.id) {
        await updateSpecificAliado(formData.id, formData);
        Swal.fire("Consulta específica actualizada", "Los cambios se guardaron correctamente.", "success");
      } else {
        await saveSpecificAliado(formData);
        Swal.fire("Consulta específica creada", "Se ha registrado correctamente.", "success");
      }

      setIsOpenADD(false);
      fetchAliados(currentPage);
    } catch (error) {
      if (error.response?.status === 422) {
        setValidationErrors(error.response.data.errors);
      } else {
        Swal.fire("Error", "Hubo un problema al guardar la consulta específica.", "error");
      }
    } finally {
      setLoadingAliados(false);
    }
  };

  const handleEditAliados = (item) => {
    setFormData({
      id: item.id,
      name: item.name,
      consultation_id: item.consultation_id,
    });
    setValidationErrors({});
    setIsOpenADD(true);
  };

  const handleDeleteAliados = async (id, status) => {
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
          await deleteSpecificAliado(id);
          Swal.fire("Estado actualizado", "La consulta específica se actualizó correctamente.", "success");
          fetchAliados(currentPage);
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
    specificAliados,
    payroll,
    consultationNoSpecific,
    loadingAliados,
    error,
    isOpenADD,
    setIsOpenADD,
    formData,
    setFormData,
    validationErrors,
    handleSaveAliados,
    perPage,
    totalItems,
    currentPage,
    totalPages,
    handleEditAliados,
    handleDeleteAliados,
    fetchPageAliados,
    handleSearchAliados,
    handleOpenForm,
    handleCloseModal,
  };
};
