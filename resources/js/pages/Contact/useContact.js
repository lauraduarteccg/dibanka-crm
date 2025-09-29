import { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { AuthContext } from "@context/AuthContext";
import Swal from "sweetalert2";

export const useContact = () => {
    const { token } = useContext(AuthContext);
    const [contact,          setContact]             = useState([]);
    const [payroll,          setPayroll]             = useState([]);
    const [loading,          setLoading]             = useState(true);
    const [error,            setError]               = useState(null);
    const [validationErrors, setValidationErrors]    = useState({});
    const [currentPage,      setCurrentPage]         = useState(1);
    const [currentPageM,      setCurrentPageM]         = useState(1);
    const [totalPages,       setTotalPages]          = useState(1);
    const [totalPagesM,       setTotalPagesM]          = useState(1);
    const [perPage, setPerPage] = useState(1);
    const [totalItems, setTotalItems] =useState(1);
    const [perPageM, setPerPageM] = useState(1);
    const [totalItemsM, setTotalItemsM] =useState(1);
    const [selectedManagement, setSelectedManagement] = useState(null);
    const [managements,      setManagements]         = useState(false);
    const [management,       setManagement]          = useState([]);
    const [selectedContact,  setSelectedContact]     = useState(null);
    const [searchTerm,       setSearchTerm]          = useState("");
    const [isOpenADD,        setIsOpenADD]           = useState(false);
    const [formData,         setFormData]            = useState({
        id: null,
        campaign                : "",
        payroll_id              : "",
        name                    : "",
        identification_type     : "",
        phone                   : "",
        identification_number   : "",
        update_phone            : "",
        email                   : "",

    });

    //Tabla de pagadurias
    const fetchContact = useCallback(
        async (page, search = "") => {
            setLoading(true);
            try {
                const res = await axios.get(`/api/contacts?page=${page}&search=${encodeURIComponent(search)}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setContact(res.data.contacts);
                setTotalPages   (res.data.pagination.total_pages);
                setCurrentPage  (res.data.pagination.current_page);
                setPerPage  (res.data.pagination.per_page);
                setTotalItems (res.data.pagination.total_contacts);
            } catch (err) {
                setError("Error al obtener laos contactos.");
            } finally {
                setLoading(false);
            }
        },
        [token]
    );
    useEffect(() => {
        fetchContact(1);
    }, []);

    const fetchPage = useCallback(
        (page) => fetchContact(page, searchTerm),
        [fetchContact, searchTerm]
    );

    const handleSearch = useCallback((value) => {
        setSearchTerm(value);
        setCurrentPage(1);
        fetchContact(1, value);
    }, []);

    // Manejar la edición de consultas
    const handleEdit = (item) => {
        setFormData({
            id: item.id, 
            campaign: item.campaign,
            payroll_id: item.payroll.id,
            name: item.name,
            email: item.email,
            phone: item.phone,
            update_phone: item.update_phone,
            identification_type: item.identification_type,
            identification_number: item.identification_number,
        });
        setValidationErrors({});
        setIsOpenADD(true);
    };

    // Crear o actualizar consulta
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setValidationErrors({});

        try {
            let response;
            const payload = { ...formData };

            // Normalizar valores antes de enviar
            // Convertir strings "true"/"false" en booleanos reales
            Object.keys(payload).forEach((key) => {
                if (payload[key] === "true") payload[key] = true;
                if (payload[key] === "false") payload[key] = false;
            });

            if (formData.id) {
                // ✅ Actualizar consulta
                response = await axios.put(
                    `/api/contacts/${formData.id}`,
                    payload,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
            } else {
                // ✅ Crear consulta
                response = await axios.post("/api/contacts", payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            }

            if (response.status === 200 || response.status === 201) {
                Swal.fire({
                    title: formData.id
                        ? "Contacto actualizado"
                        : "Contacto creado",
                    text: "Los cambios han sido guardados correctamente.",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false,
                });

                setIsOpenADD(false);
                fetchContact(currentPage);
                setValidationErrors({});
            }
        } catch (error) {
            if (error.response?.status === 422) {
                setValidationErrors(error.response.data.errors);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
    setIsOpenADD(false);
    setValidationErrors({});
};

    //Desactivar consulta
    const handleDelete = async (id, status) => {
        const actionText = !status ? "activar" : "desactivar";

        Swal.fire({
            position: "top-end",
            title: `¿Quieres ${actionText} este contacto?`,
            text: `La contacto será marcado como ${
                !status ? "Activo" : "Inactivo"
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
                    const response = await axios.delete(
                        `/api/contacts/${id}`,
                        {
                            headers: { Authorization: `Bearer ${token}` },
                        }
                    );
                    console.log(status);

                    if (response.status === 200) {
                        Swal.fire({
                            position: "top-end",

                            title: "Estado actualizado",
                            text: `El contacto ahora está ${
                                !status ? "Activo" : "Inactivo"
                            }.`,
                            icon: "success",
                            timer: 1500,
                            showConfirmButton: false,
                            width: "350px",
                            padding: "0.8em",
                        });
                        fetchContact(currentPage);
                    } else {
                        Swal.fire({
                            position: "top-end",

                            title: "Error",
                            text: "No se pudo actualizar la consulta.",
                            icon: "error",
                            width: "300px",
                            padding: "0.6em",
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
                            "No se pudo actualizar el contacto.",
                        icon: "error",
                        width: "300px",
                        padding: "0.6em",
                        width: "350px",
                        padding: "0.8em",
                    });
                }
            }
        });
    };

    // ---------------------------------------------------------
    // Lista de Pagadurías
    const fetchPayroll = useCallback(async () => {
    try {
        const res = await axios.get(`/api/payrolls`, {
        headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data.payrolls || res.data.data || res.data || [];
        setPayroll(data);
    } catch (err) {
        console.error(err);
        setError("Error al obtener las pagadurías.");
    }
    }, [token]);

    useEffect(() => {
    fetchPayroll();
    }, [fetchPayroll]);

    // -----------------------------------------------------------
    // Lista de gestiones
    const fetchManagement = async (identification_number, page = 1) => {
    setLoading(true);
    try {
        const url = `/api/management?identification_number=${identification_number}&page=${page}`;
        const { data } = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
        });

        setManagement(data.managements ?? []);
        setTotalPagesM(data.last_page ?? 1);
        setCurrentPageM(data.current_page ?? 1);
        setPerPageM(data.pagination.per_page);
        setTotalItemsM(data.pagination.total_management);
        // console.log(data.managements)

    } catch (err) {
        console.error("Error al obtener gestiones:", err);
    } finally {
        setLoading(false);
    }
    };
    
    //---------------------------------------------------------------
    const handleOpenManagements = (contact) => {
        // 1. Limpio gestiones viejas
        setManagement([]);
        
        // 2. Guardo el contacto seleccionado
        setSelectedContact(contact);
        
        // 3. Abro el Dialog
        setManagements(true);
        };


    return {
        selectedManagement,
        setSelectedManagement,
        handleCloseModal,
        handleOpenManagements,
        totalItemsM,
        perPageM,
        currentPageM,
        totalPagesM,
        fetchManagement,
        management,
        selectedContact,
        setSelectedContact,
        managements,
        setManagements,
        handleSearch,
        fetchPage,
        setSearchTerm,
        searchTerm,
        fetchPayroll,
        payroll,
        contact,
        loading,
        error,
        isOpenADD,
        setIsOpenADD,
        formData,
        setFormData,
        validationErrors,
        handleSubmit,
        totalItems,
        perPage,
        currentPage,
        totalPages,
        fetchContact,
        handleEdit,
        handleDelete
    };
};
