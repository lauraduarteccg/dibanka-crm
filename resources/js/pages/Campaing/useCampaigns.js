import { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { AuthContext } from "@context/AuthContext";
import Swal from "sweetalert2";

export const useCampaigns = () => {
    const { token } = useContext(AuthContext);
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isOpenADD, setIsOpenADD] = useState(false);
    const [formData, setFormData] = useState({
        id: null,
        pagaduria: "",
        tipo: "",

    });

    //Tabla de pagadurias
    const fetchCampaigns = useCallback(
        async (page) => {
            setLoading(true);
            try {
                const res = await axios.get(`/api/campaigns?page=${page}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log(res.data.campaigns);
                setCampaigns(res.data.campaigns);
                setTotalPages(res.data.pagination.total_pages);
                setCurrentPage(res.data.pagination.current_page);
            } catch (err) {
                setError("Error al obtener las campañas.");
            } finally {
                setLoading(false);
            }
        },
        [token]
    );

    useEffect(() => {
        fetchCampaigns(1);
    }, []);

    // Manejar la edición de campañas
    const handleEdit = (campaign) => {
        setFormData({
            id: campaign.id,
            name: campaign.name,
            description: campaign.description,
        });
        setValidationErrors({});
        setIsOpenADD(true);
    };

    // Crear o actualizar campaña
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setValidationErrors({});

        try {
            let response;
            if (formData.id) {
                response = await axios.put(
                    `/api/campaigns/${formData.id}`,
                    formData,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
            } else {
                response = await axios.post("/api/campaigns", formData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            }

            if (response.status === 200 || response.status === 201) {
                Swal.fire({
                    title: formData.id
                        ? "Campaña actualizada"
                        : "Campaña creada",
                    text: "Los cambios han sido guardados correctamente.",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false,
                });

                setIsOpenADD(false);
                fetchCampaigns(currentPage);
            }
        } catch (error) {
            if (error.response?.status === 422) {
                setValidationErrors(error.response.data.errors);
            }
        } finally {
            setLoading(false);
        }
    };

    //Desactivar campaña
    const handleDelete = async (id, status) => {
        const actionText = !status ? "activar" : "desactivar";

        Swal.fire({
            position: "top-end",
            title: `¿Quieres ${actionText} esta pagaduria?`,
            text: `La pagaduria será marcado como ${
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
                        `/api/campaigns/${id}`,
                        {
                            headers: { Authorization: `Bearer ${token}` },
                        }
                    );
                    console.log(status);

                    if (response.status === 200) {
                        Swal.fire({
                            position: "top-end",

                            title: "Estado actualizado",
                            text: `La pagaduria ahora está ${
                                !status ? "Activo" : "Inactivo"
                            }.`,
                            icon: "success",
                            timer: 1500,
                            showConfirmButton: false,
                            width: "350px",
                            padding: "0.8em",
                        });
                        fetchCampaigns(currentPage);
                    } else {
                        Swal.fire({
                            position: "top-end",

                            title: "Error",
                            text: "No se pudo actualizar la pagaduria.",
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
                            "No se pudo actualizar la pagaduria.",
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
        campaigns,
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
        fetchCampaigns,
        handleEdit,
        handleDelete
    };
};
