import { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { AuthContext } from "@context/AuthContext";
import Swal from "sweetalert2";

export const useContact = () => {
    const { token } = useContext(AuthContext);
    const [contact,          setContact]             = useState([]);
    const [loading,          setLoading]             = useState(true);
    const [error,            setError]               = useState(null);
    const [validationErrors, setValidationErrors]    = useState({});
    const [currentPage,      setCurrentPage]         = useState(1);
    const [totalPages,       setTotalPages]          = useState(1);
    const [isOpenADD,        setIsOpenADD]           = useState(false);
    const [formData,         setFormData]            = useState({
        id: null,
        name                    : "",
        identification_type     : "",
        phone                   : "",
        identification_number   : "",
        update_phone            : "",
        email                   : "",

    });

    //Tabla de pagadurias
    const fetchConsultation = useCallback(
        async (page) => {
            setLoading(true);
            try {
                const res = await axios.get(`/api/contacts?page=${page}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setContact      (res.data.contacts);
                setTotalPages   (res.data.pagination.total_pages);
                setCurrentPage  (res.data.pagination.current_page);
                console.log     (res.data.contacts)
            } catch (err) {
                setError("Error al obtener laos contactos.");
            } finally {
                setLoading(false);
            }
        },
        [token]
    );

    useEffect(() => {
        fetchConsultation(1);
    }, []);

    // Manejar la edición de consultas
    const handleEdit = (contact) => {
        setFormData({
            id: contact.id,
            name                    : contact.name,
            identification_type     : contact.identification_type,
            phone                   : contact.phone,
            identification_number   : contact.identification_number,
            update_phone            : contact.update_phone,
            email                   : contact.email,         
            is_active               : contact.is_active
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
            fetchConsultation(currentPage);
        }
    } catch (error) {
        if (error.response?.status === 422) {
            setValidationErrors(error.response.data.errors);
        }
    } finally {
        setLoading(false);
    }
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
                        fetchConsultation(currentPage);
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
    return {
        contact,
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
        fetchConsultation,
        handleEdit,
        handleDelete
    };
};
