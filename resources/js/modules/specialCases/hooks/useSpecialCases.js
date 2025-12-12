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
  const [filterColumn, setFilterColumn] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(1);
  const [totalItems, setTotalItems] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // UI
  const [isOpenADD, setIsOpenADD] = useState(false);
  const [formData, setFormData] = useState({});
  const [selectedPayroll, setSelectedPayroll] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [openSearchContact, setOpenSearchContact] = useState(false);

  // Contact Search Pagination
  const [contactSearch, setContactSearch] = useState([]);
  const [currentPageContact, setCurrentPageContact] = useState(1);
  const [totalPagesContact, setTotalPagesContact] = useState(1);
  const [searchTermContact, setSearchTermContact] = useState("");
  const [perPageContact, setPerPageContact] = useState(10);
  const [totalItemsContact, setTotalItemsContact] = useState(0);
  const [loadingContact, setLoadingContact] = useState(false);

  /* ===========================================================
   *  Fetch principal
   * =========================================================== */
  const fetchSpecialCases = useCallback(
    async (page = 1, search = "", column = filterColumn) => {
      setLoading(true);
      try {
        const data = await getSpecialCases(page, search, column);
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

  // 🔥 NUEVO: useEffect para buscar cuando cambie el searchTerm
  // 🔥 NUEVO: useEffect para buscar cuando cambie el searchTerm
  useEffect(() => {
    fetchSpecialCases(currentPage, searchTerm, filterColumn);
  }, [searchTerm, currentPage, filterColumn, fetchSpecialCases]);

  const fetchPage = useCallback(
    (page) => {
      setCurrentPage(page);
    },
    []
  );

  const handleSearch = useCallback((value, column = "") => {
    setSearchTerm(value);
    setFilterColumn(column);
    setCurrentPage(1); // Resetear a la primera página al buscar
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchTerm("");
    setFilterColumn("");
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
      fetchSpecialCases(currentPage, searchTerm);
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

          fetchSpecialCases(currentPage, searchTerm);
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

  // Fetch contacts for search modal with pagination
  const fetchContactsSearch = useCallback(
    async (page = 1, search = "") => {
      setLoadingContact(true);
      try {
        const payrollName = selectedPayroll?.name || "";
        const contactData = await getContacts(page, search, payrollName);
        
        setContactSearch(contactData.contacts || []);
        setCurrentPageContact(contactData.pagination?.current_page || 1);
        setTotalPagesContact(contactData.pagination?.total_pages || 1);
        setPerPageContact(contactData.pagination?.per_page || 10);
        setTotalItemsContact(contactData.pagination?.total_contacts);
      } catch (err) {
        console.error("Error al obtener contactos:", err);
      } finally {
        setLoadingContact(false);
      }
    },
    [selectedPayroll]
  );

  const handleSearchContact = useCallback((value) => {
    setSearchTermContact(value);
    setCurrentPageContact(1);
  }, []);

  const fetchPageContact = useCallback((page) => {
    setCurrentPageContact(page);
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

  // 🔥 useEffect para buscar contactos cuando cambie la pagaduría seleccionada
  useEffect(() => {
    if (openSearchContact && selectedPayroll) {
      fetchContactsSearch(1, searchTermContact);
    }
  }, [selectedPayroll, openSearchContact, fetchContactsSearch, searchTermContact]);

  // 🔥 useEffect para buscar cuando cambie el término de búsqueda o página de contactos
  useEffect(() => {
    if (openSearchContact) {
      fetchContactsSearch(currentPageContact, searchTermContact);
    }
  }, [searchTermContact, currentPageContact, openSearchContact, fetchContactsSearch]);

  /* ===========================================================
   *  Auxiliares
   * =========================================================== */
  const clearFieldError = (fieldName) => {
    setValidationErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  };

  const onSelectContact = (contact) => {
    setSelectedContact(contact);
    setFormData((prev) => ({
      ...prev,
      contact_id: contact.id,
    }));
    setOpenSearchContact(false);
    clearFieldError("contact_id");
  };

  // 🔥 Manejar el cambio de pagaduría
  const handlePayrollChange = (payroll) => {
    setSelectedPayroll(payroll);
    setFormData((prev) => ({
      ...prev,
      payroll_id: payroll?.id || "",
    }));
    
    // Limpiar contacto seleccionado cuando cambie la pagaduría
    setSelectedContact(null);
    setFormData((prev) => ({
      ...prev,
      contact_id: "",
    }));
    
    clearFieldError("payroll_id");
    clearFieldError("contact_id");
    
    // Resetear búsqueda de contactos
    setSearchTermContact("");
    setCurrentPageContact(1);
  };

  const handleEdit = (item) => {
    setFormData({
      id: item.id,
      user_id: item.user_id,
      payroll_id: item.contact?.payroll?.id || "",
      contact_id: item.contact_id,
      management_messi: item.management_messi,
      id_call: item.id_call,
      id_messi: item.id_messi,
    });
    
    // Set selected payroll and contact for display
    if (item.contact?.payroll) {
      setSelectedPayroll(item.contact.payroll);
    }
    if (item.contact) {
      setSelectedContact(item.contact);
    }
    
    setIsOpenADD(true);
  };

  const handleCloseModal = () => {
    setIsOpenADD(false);
    setValidationErrors({});
    setFormData({});
    setSelectedPayroll(null);
    setSelectedContact(null);
    setSearchTermContact("");
    setCurrentPageContact(1);
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
    searchTerm,
    filterColumn,

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
    selectedPayroll,
    selectedContact,
    openSearchContact,

    // Contact Search
    contactSearch,
    currentPageContact,
    totalPagesContact,
    searchTermContact,
    perPageContact,
    totalItemsContact,
    loadingContact,

    // Acciones
    setFormData,
    setIsOpenADD,
    setSelectedPayroll,
    setSelectedContact,
    setOpenSearchContact,
    fetchSpecialCases,
    fetchPage,
    handleSearch,
    handleSubmit,
    handleClearSearch,
    handleDelete,
    handleEdit,
    fetchUser,
    handleCloseModal,
    clearFieldError,
    onSelectContact,
    fetchContactsSearch,
    handleSearchContact,
    fetchPageContact,
    handlePayrollChange,
  };
};