import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import {
  getPayrolls,
  createPayroll,
  updatePayroll,
  deletePayroll,
} from "@modules/config/payroll/services/payrollService";

export const usePayrolls = () => {
  const [payrolls, setPayrolls] = useState([]);
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
    description: "",
    img_payroll: null,
    i_title: "",
    i_description: "",
    i_phone: "",
    i_email: "",
  });

  /* ===========================================================
   *  Obtener lista de pagadurías
   * =========================================================== */
  const fetchPayrolls = useCallback(async (page = 1, search = "") => {
    setLoading(true);
    try {
      const data = await getPayrolls(page, search);
      console.log(data)
      setPayrolls(data.payrolls);
      setTotalPages(data.pagination.total_pages);
      setCurrentPage(data.pagination.current_page);
      setPerPage(data.pagination.per_page);
      setTotalItems(data.pagination.total_payrolls);
    } catch (err) {
      console.error(err);
      setError("Error al obtener las pagadurías.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayrolls(1);
  }, [fetchPayrolls]);

  const fetchPage = useCallback((page) => fetchPayrolls(page, searchTerm), [fetchPayrolls, searchTerm]);
  const handleSearch = useCallback((value) => {
    setSearchTerm(value);
    setCurrentPage(1);
    fetchPayrolls(1, value);
  }, [fetchPayrolls]);

  /* ===========================================================
   *  Crear o actualizar pagaduría
   * =========================================================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setValidationErrors({});

    try {
      if (formData.id) {
        await updatePayroll(formData.id, formData);
        Swal.fire("Pagaduría actualizada", "Los cambios han sido guardados correctamente.", "success");
      } else {
        await createPayroll(formData);
        Swal.fire("Pagaduría creada", "Se ha registrado una nueva pagaduría.", "success");
      }
      setIsOpenADD(false);
      fetchPayrolls(currentPage);
    } catch (error) {
      if (error.response?.status === 422) {
        setValidationErrors(error.response.data.errors);
      } else {
        Swal.fire("Error", "Hubo un problema al guardar la pagaduría.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  /* ===========================================================
   *  Editar pagaduría
   * =========================================================== */
  const handleEdit = (item) => {
    setFormData({
      id: item.id,
      name: item.name,
      description: item.description,
      img_payroll: item.img_payroll ? item.img_payroll : null,
      i_title: item.i_title,
      i_description: item.i_description,
      i_phone: item.i_phone,
      i_email: item.i_email,
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
      title: `¿Quieres ${actionText} esta pagaduría?`,
      text: `La pagaduría será marcada como ${!status ? "Activa" : "Inactiva"}.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: !status ? "#28a745" : "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: `Sí, ${actionText}`,
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deletePayroll(id);
          Swal.fire("Estado actualizado", `La pagaduría ahora está ${!status ? "Activa" : "Inactiva"}.`, "success");
          fetchPayrolls(currentPage);
        } catch (error) {
          Swal.fire("Error", "No se pudo actualizar la pagaduría.", "error");
        }
      }
    });
  };

  const handleCloseModal = () => {
    setIsOpenADD(false);
    setValidationErrors({});
  };

  return {
    handleCloseModal,
    fetchPage,
    handleSearch,
    payrolls,
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
    totalItems,
    perPage,
    fetchPayrolls,
    handleEdit,
    handleDelete,
  };
};
