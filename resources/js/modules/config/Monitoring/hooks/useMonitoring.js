import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import {
  getMonitorings,
  createMonitoring,
  updateMonitoring,
  deleteMonitoring,
} from "@modules/config/Monitoring/services/monitoringService";

export const useMonitoring = () => {
  const [monitoring, setMonitoring] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [isOpenADD, setIsOpenADD] = useState(false);
  const [active, setActive] = useState(0);
  const [inactive, setInactive] = useState(0);

  const [formData, setFormData] = useState({
    id: null,
    name: "",
    is_active: true,
  });

  /* ===========================================================
   *  Obtener seguimientos
   * =========================================================== */
  const fetchMonitoring = useCallback(async (page = 1, search = "") => {
    setLoading(true);
    try {
      const data = await getMonitorings(page, search);
      setMonitoring(data.monitorings);
      setTotalPages(data.pagination.total_pages);
      setCurrentPage(data.pagination.current_page);
      setPerPage(data.pagination.per_page);
      setTotalItems(data.pagination.total_monitorings);
      setActive(data.pagination.count_actives);
      setInactive(data.pagination.count_inactives);
    } catch (err) {
      console.error(err);
      setError("Error al obtener los tipos de seguimiento.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMonitoring(1);
  }, [fetchMonitoring]);

  const fetchPage = useCallback(
    (page) => fetchMonitoring(page, searchTerm),
    [fetchMonitoring, searchTerm]
  );

  const handleSearch = useCallback(
    (value) => {
      setSearchTerm(value);
      setCurrentPage(1);
      fetchMonitoring(1, value);
    },
    [fetchMonitoring]
  );

  /* ===========================================================
   *  Crear o actualizar seguimiento
   * =========================================================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setValidationErrors({});

    try {
      if (formData.id) {
        await updateMonitoring(formData.id, formData);
        Swal.fire("Seguimiento actualizado", "Cambios guardados correctamente.", "success");
      } else {
        await createMonitoring(formData);
        Swal.fire("Seguimiento creado", "Se ha registrado correctamente.", "success");
      }

      setIsOpenADD(false);
      fetchMonitoring(currentPage);
    } catch (error) {
      if (error.response?.status === 422) {
        setValidationErrors(error.response.data.errors);
      } else {
        Swal.fire("Error", "Hubo un problema al guardar el seguimiento.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  /* ===========================================================
   *  Editar seguimiento
   * =========================================================== */
  const handleEdit = (item) => {
    setFormData({
      id: item.id,
      name: item.name,
      is_active: item.is_active,
    });
    setValidationErrors({});
    setIsOpenADD(true);
  };

  /* ===========================================================
   *  Eliminar / Desactivar seguimiento
   * =========================================================== */
  const handleDelete = async (id, status) => {
    const actionText = !status ? "activar" : "desactivar";

    Swal.fire({
      position: "top-end",
      title: `¿Quieres ${actionText} este tipo de seguimiento?`,
      text: `Será marcado como ${!status ? "Activo" : "Inactivo"}.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: !status ? "#28a745" : "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: `Sí, ${actionText}`,
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteMonitoring(id);
          Swal.fire("Estado actualizado", "El seguimiento se actualizó correctamente.", "success");
          fetchMonitoring(currentPage);
        } catch {
          Swal.fire("Error", "No se pudo actualizar el seguimiento.", "error");
        }
      }
    });
  };

  const handleCloseModal = () => {
    setIsOpenADD(false);
    setValidationErrors({});
  };

  return {
    active,
    inactive,
    monitoring,
    loading,
    error,
    isOpenADD,
    setIsOpenADD,
    formData,
    setFormData,
    validationErrors,
    currentPage,
    totalPages,
    perPage,
    totalItems,
    fetchMonitoring,
    fetchPage,
    handleSearch,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleCloseModal,
  };
};
