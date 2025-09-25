import { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { AuthContext } from "@context/AuthContext";
import Swal from "sweetalert2";

export const usePayrolls = () => {
  const { token } = useContext(AuthContext);
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(1);
  const [totalItems, setTotalItems] =useState(1);
  const [isOpenADD, setIsOpenADD] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    description: "",
    img_payroll: null,
  });

  // 🔹 Función auxiliar para construir FormData
  const buildFormData = (data) => {
    const form = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        form.append(key, value);
      }
    });
    return form;
  };

  // 🔹 Obtener lista de pagadurías
  const fetchPayrolls = useCallback(
    async (page, search = "") => {
      setLoading(true);
      try {
        const res = await axios.get(
          `/api/payrolls?page=${page}&search=${encodeURIComponent(search)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPayrolls(res.data.payrolls);
        setTotalPages(res.data.pagination.total_pages);
        setCurrentPage(res.data.pagination.current_page);
        setPerPage(res.data.pagination.per_page);
        setTotalItems(res.data.pagination.total_payrolls)
      } catch (err) {
        setError("Error al obtener las pagadurías.");
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  useEffect(() => {
    fetchPayrolls(1);
  }, []);

  const fetchPage = useCallback(
    (page) => fetchPayrolls(page, searchTerm),
    [fetchPayrolls, searchTerm]
  );

  const handleSearch = useCallback((value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  }, []);

  useEffect(() => {
    fetchPayrolls(currentPage, searchTerm);
  }, [currentPage, searchTerm, fetchPayrolls]);

  // 🔹 Manejar edición de pagadurías
  const handleEdit = (payroll) => {
    setFormData({
      id: payroll.id,
      name: payroll.name,
      description: payroll.description,
      img_payroll: payroll.img_payroll, // puede ser string (URL)
    });
    setValidationErrors({});
    setIsOpenADD(true);
  };

  // 🔹 Crear o actualizar pagaduría
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setValidationErrors({});

    try {
      let response;
      const form = buildFormData(formData);

      if (formData.id) {
        // ✅ Actualizar (Laravel soporta _method)
        form.append("_method", "PUT");
        response = await axios.post(
          `/api/payrolls/${formData.id}`,
          form,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // ✅ Crear
        response = await axios.post(
          "/api/payrolls",
          form,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      if (response.status === 200 || response.status === 201) {
        Swal.fire({
          title: formData.id ? "Pagaduría actualizada" : "Pagaduría creada",
          text: "Los cambios han sido guardados correctamente.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });

        setIsOpenADD(false);
        fetchPayrolls(currentPage);
      }
    } catch (error) {
      if (error.response?.status === 422) {
        setValidationErrors(error.response.data.errors);
      } else {
        console.error(error.response?.data || error.message);
        Swal.fire({
          title: "Error",
          text: "Hubo un problema al guardar la pagaduría.",
          icon: "error",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Activar / Desactivar pagaduría
  const handleDelete = async (id, status) => {
    const actionText = !status ? "activar" : "desactivar";

    Swal.fire({
      position: "top-end",
      title: `¿Quieres ${actionText} esta pagaduría?`,
      text: `La pagaduría será marcada como ${
        !status ? "Activa" : "Inactiva"
      }.`,
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
          const response = await axios.delete(`/api/payrolls/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.status === 200) {
            Swal.fire({
              position: "top-end",
              title: "Estado actualizado",
              text: `La pagaduría ahora está ${
                !status ? "Activa" : "Inactiva"
              }.`,
              icon: "success",
              timer: 1500,
              showConfirmButton: false,
              width: "350px",
              padding: "0.8em",
            });
            fetchPayrolls(currentPage);
          } else {
            Swal.fire({
              position: "top-end",
              title: "Error",
              text: "No se pudo actualizar la pagaduría.",
              icon: "error",
              width: "350px",
              padding: "0.8em",
            });
          }
        } catch (error) {
          Swal.fire({
            position: "top-end",
            title: "Error",
            text:
              error.response?.data?.message ||
              "No se pudo actualizar la pagaduría.",
            icon: "error",
            width: "350px",
            padding: "0.8em",
          });
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
