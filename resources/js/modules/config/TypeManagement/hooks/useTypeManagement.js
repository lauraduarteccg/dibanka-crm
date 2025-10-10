import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import {
  getTypeManagements,
  createTypeManagement,
  updateTypeManagement,
  deleteTypeManagement,
  getActivePayrolls,
} from "@modules/config/TypeManagement/services/typeManagementService";

export const useTypeManagement = () => {
  const [typeManagement, setTypeManagement] = useState([]);
  const [payroll, setPayroll] = useState([]);
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
    payroll_id: "",
    is_active: true,
  });

  /* ===========================================================
   *  Obtener tipos de gestión
   * =========================================================== */
  const fetchTypeManagement = useCallback(async (page = 1, search = "") => {
    setLoading(true);
    try {
      const data = await getTypeManagements(page, search);
      setTypeManagement(data.typeManagement);
      setTotalPages(data.pagination.total_pages);
      setCurrentPage(data.pagination.current_page);
      setPerPage(data.pagination.per_page);
      setTotalItems(data.pagination.total_managements);
    } catch (err) {
      console.error(err);
      setError("Error al obtener los tipos de gestión.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTypeManagement(1);
  }, [fetchTypeManagement]);

  const fetchPage = useCallback(
    (page) => fetchTypeManagement(page, searchTerm),
    [fetchTypeManagement, searchTerm]
  );

  const handleSearch = useCallback(
    (value) => {
      setSearchTerm(value);
      setCurrentPage(1);
      fetchTypeManagement(1, value);
    },
    [fetchTypeManagement]
  );

  /* ===========================================================
   *  Obtener pagadurías para selector
   * =========================================================== */
  const fetchPayroll = useCallback(async () => {
    try {
      const data = await getActivePayrolls();
      setPayroll(data);
    } catch (err) {
      setError("Error al obtener las pagadurías.");
    }
  }, []);

  useEffect(() => {
    fetchPayroll();
  }, [fetchPayroll]);

  /* ===========================================================
   *  Crear o actualizar tipo de gestión
   * =========================================================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setValidationErrors({});

    try {
      if (formData.id) {
        await updateTypeManagement(formData.id, formData);
        Swal.fire("Tipo de gestión actualizado", "Cambios guardados correctamente.", "success");
      } else {
        await createTypeManagement(formData);
        Swal.fire("Tipo de gestión creado", "Se registró correctamente.", "success");
      }
      setIsOpenADD(false);
      fetchTypeManagement(currentPage);
    } catch (error) {
      if (error.response?.status === 422) {
        setValidationErrors(error.response.data.errors);
      } else {
        Swal.fire("Error", "Hubo un problema al guardar el tipo de gestión.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  /* ===========================================================
   *  Editar tipo de gestión
   * =========================================================== */
  const handleEdit = (item) => {
    setFormData({
      id: item.id,
      name: item.name,
      payroll_id: item.payrolls?.id || "",
      is_active: item.is_active,
    });
    setValidationErrors({});
    setIsOpenADD(true);
  };

  /* ===========================================================
   *  Eliminar o desactivar
   * =========================================================== */
  const handleDelete = async (id, status) => {
    const actionText = !status ? "activar" : "desactivar";

    Swal.fire({
      position: "top-end",
      title: `¿Quieres ${actionText} este tipo de gestión?`,
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
          await deleteTypeManagement(id);
          Swal.fire("Estado actualizado", "El tipo de gestión se actualizó correctamente.", "success");
          fetchTypeManagement(currentPage);
        } catch {
          Swal.fire("Error", "No se pudo actualizar el tipo de gestión.", "error");
        }
      }
    });
  };

  const handleCloseModal = () => {
    setIsOpenADD(false);
    setValidationErrors({});
  };

  return {
    // Datos
    typeManagement,
    payroll,
    loading,
    error,
    isOpenADD,
    setIsOpenADD,
    formData,
    setFormData,
    validationErrors,
    currentPage,
    totalPages,
    totalItems,
    perPage,

    // Acciones
    fetchPage,
    handleSearch,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleCloseModal,
  };
};
