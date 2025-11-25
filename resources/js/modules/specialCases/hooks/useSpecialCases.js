import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import {
  getSpecialCases,
  saveSpecialCase,
  deleteSpecialCase,
  getActivePayrolls,
  getContacts,
  getUsers,
} from "@modules/specialCases/services/specialCasesService";

export const useSpecialCases = () => {
  const [specialCases, setSpecialCases] = useState([]);
  const [payroll, setPayroll] = useState([]);
  const [users, setUsers] = useState([]);
  const [contact, setContact] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  // Paginación
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(1);
  const [totalItems, setTotalItems] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // UI
  const [isOpenADD, setIsOpenADD] = useState(false);
  const [formData, setFormData] = useState({});

  /* ===========================================================
   *  Fetch principal
   * =========================================================== */
  const fetchSpecialCases = useCallback(
    async (page = 1, search = "") => {
      setLoading(true);
      try {
        const data = await getSpecialCases(page, search);
        setSpecialCases(data.specialCases);
        setTotalPages(data.pagination.total_pages);
        setCurrentPage(data.pagination.current_page);
        setPerPage(data.pagination.per_page);
        setTotalItems(data.pagination.total);
      } catch (err) {
        console.error(err);
        setError("Error al obtener los casos especiales.");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchSpecialCases(1);
  }, [fetchSpecialCases]);

  const fetchPage = useCallback(
    (page) => fetchSpecialCases(page, searchTerm),
    [fetchSpecialCases, searchTerm]
  );

  const handleSearch = useCallback((value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  }, []);

  /* ===========================================================
   *  Crear o actualizar
   * =========================================================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setValidationErrors({});

    try {
      const payload = { ...formData };

      Object.keys(payload).forEach((key) => {
        if (payload[key] === "true") payload[key] = true;
        if (payload[key] === "false") payload[key] = false;
      });
      await saveSpecialCase(payload);

      Swal.fire({
        title: formData.id
          ? "Caso especial actualizado"
          : "Caso especial creado",
        text: "Los cambios han sido guardados correctamente.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      setIsOpenADD(false);
      fetchSpecialCases(currentPage);
    } catch (error) {
      if (error.response?.status === 422) {
        setValidationErrors(error.response.data.errors);
      } else {
        console.error("Error al guardar el caso especial:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  /* ===========================================================
   *  Eliminar o desactivar
   * =========================================================== */
  const handleDelete = async (id, status) => {
    const actionText = !status ? "activar" : "desactivar";

    Swal.fire({
      title: `¿Quieres ${actionText} este caso especial?`,
      text: `El caso será marcado como ${!status ? "Activo" : "Inactivo"}.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: !status ? "#28a745" : "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: `Sí, ${actionText}`,
      cancelButtonText: "Cancelar",
      width: "350px",
      padding: "0.8em",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteSpecialCase(id);

          Swal.fire({
            position: "top-end",
            title: "Estado actualizado",
            text: `El caso especial ahora está ${!status ? "Activo" : "Inactivo"}.`,
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });

          fetchSpecialCases(currentPage);
        } catch (error) {
          Swal.fire({
            title: "Error",
            text:
              error.response?.data?.message ||
              "No se pudo actualizar el caso especial.",
            icon: "error",
            width: "350px",
            padding: "0.8em",
          });
        }
      }
    });
  };

  /* ===========================================================
   *  Fetch de selectores
   * =========================================================== */
  const fetchPayroll = useCallback(async () => {
    try {
      const data = await getActivePayrolls();
      setPayroll(data);
    } catch (err) {
      console.error(err);
      setError("Error al obtener las pagadurías.");
    }
  }, []);

  const fetchContact = useCallback(async () => {
    try {
      const data = await getContacts();
      setContact(data);
    } catch (err) {
      console.error(err);
      setError("Error al obtener los contactos.");
    }
  }, []);

  const fetchUser = useCallback(async (page = 1) => {
    try {
      const data = await getUsers(page);
      setUsers(data.users);
      setTotalPages(data.pagination.total_pages);
      setCurrentPage(data.pagination.current_page);
    } catch (err) {
      console.error(err);
      setError("Error al obtener los usuarios.");
    }
  }, []);

  useEffect(() => {
    fetchPayroll();
    fetchContact();
    fetchUser();
  }, [fetchPayroll, fetchContact, fetchUser]);

  /* ===========================================================
   *  Auxiliares
   * =========================================================== */
  const handleCloseModal = () => {
    setIsOpenADD(false);
    setValidationErrors({});
  };

  /* ===========================================================
   *  Return del hook
   * =========================================================== */
  return {
    // Datos principales
    specialCases,
    payroll,
    users,
    contact,

    // Estado general
    loading,
    error,
    validationErrors,
    isOpenADD,
    formData,
    currentPage,
    totalPages,
    perPage,
    totalItems,

    // Acciones
    setFormData,
    setIsOpenADD,
    fetchSpecialCases,
    fetchPage,
    handleSearch,
    handleSubmit,
    handleDelete,
    fetchUser,
    handleCloseModal,
  };
};
