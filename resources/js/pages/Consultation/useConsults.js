import { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { AuthContext } from "@context/AuthContext";
import Swal from "sweetalert2";

export const useConsults = () => {
    const { token } = useContext(AuthContext);
    const [consultation,        setConsultation]        = useState([])
    const [loading,             setLoading]             = useState(true);
    const [error,               setError]               = useState(null);
    const [validationErrors,    setValidationErrors]    = useState({});
    const [currentPage,         setCurrentPage]         = useState(1);
    const [totalPages,          setTotalPages]          = useState(1);
    const [isOpenADD,           setIsOpenADD]           = useState(false);
    const [formData,            setFormData]            = useState({
        id                  : null,
        reason_consultation : "",
        specific_reason     : "",

    });

    //Tabla de pagadurias
    const fetchConsultation = useCallback(
        async (page) => {
            setLoading(true);
            try {
                const res = await axios.get(`/api/consultations?page=${page}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setConsultation(res.data.consultations);
                setTotalPages(res.data.pagination.total_pages);
                setCurrentPage(res.data.pagination.current_page);
                console.log(res.data.consultations)
            } catch (err) {
                setError("Error al obtener las consultas.");
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
    const handleEdit = (consultation) => {
        setFormData({
            id                  : consultation.id,
            reason_consultation : consultation.reason_consultation,
            specific_reason     : consultation.specific_reason,
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
                `/api/consultations/${formData.id}`,
                payload,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
        } else {
            // ✅ Crear consulta
            response = await axios.post("/api/consultations", payload, {
                headers: { Authorization: `Bearer ${token}` },
            });
        }

        if (response.status === 200 || response.status === 201) {
            Swal.fire({
                title: formData.id
                    ? "Consulta actualizada"
                    : "Consulta creada",
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
            title: `¿Quieres ${actionText} esta consulta?`,
            text: `La consulta será marcado como ${
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
                        `/api/consultations/${id}`,
                        {
                            headers: { Authorization: `Bearer ${token}` },
                        }
                    );
                    console.log(status);

                    if (response.status === 200) {
                        Swal.fire({
                            position: "top-end",

                            title: "Estado actualizado",
                            text: `La consulta ahora está ${
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
                            "No se pudo actualizar la consulta.",
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
        consultation,
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
