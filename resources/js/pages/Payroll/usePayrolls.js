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
    const [isOpenADD, setIsOpenADD] = useState(false);
    const [formData, setFormData] = useState({
        id: null,
        pagaduria: "",
        tipo: "",
    });

    // 🔹 Obtener lista de pagadurías
    const fetchPayrolls = useCallback(
        async (page, search = "") => {
            setLoading(true);
            try {
                const res = await axios.get(`/api/payrolls?page=${page}&search=${encodeURIComponent(search)}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setPayrolls(res.data.payrolls);
                setTotalPages(res.data.pagination.total_pages);
                setCurrentPage(res.data.pagination.current_page);
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
            pagaduria: payroll.pagaduria,
            tipo: payroll.tipo,
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
            const payload = { ...formData };

            // Normalizar valores
            Object.keys(payload).forEach((key) => {
                if (payload[key] === "true") payload[key] = true;
                if (payload[key] === "false") payload[key] = false;
            });

            if (formData.id) {
                // ✅ Actualizar
                response = await axios.put(
                    `/api/payrolls/${formData.id}`,
                    payload,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
            } else {
                // ✅ Crear
                response = await axios.post("/api/payrolls", payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            }

            if (response.status === 200 || response.status === 201) {
                Swal.fire({
                    title: formData.id
                        ? "Pagaduría actualizada"
                        : "Pagaduría creada",
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
                    const response = await axios.delete(
                        `/api/payrolls/${id}`,
                        {
                            headers: { Authorization: `Bearer ${token}` },
                        }
                    );

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

    return {
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
        fetchPayrolls,
        handleEdit,
        handleDelete,
    };
};
