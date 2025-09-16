import { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { AuthContext } from "@context/AuthContext";
import Swal from "sweetalert2";

export const useSpecialCases = () => {
    const { token } = useContext(AuthContext);
    const [specialCases, setSpecialCases] = useState([]);
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

    // 🔹 Obtener lista de casos especiales
    const fetchSpecialCases = useCallback(
        async (page, search = "") => {
            setLoading(true);
            try {
                const res = await axios.get(`/api/specialcases?page=${page}&search=${encodeURIComponent(search)}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setSpecialCases(res.data.specialcases);
                setTotalPages(res.data.pagination.total_pages);
                setCurrentPage(res.data.pagination.current_page);
            } catch (err) {
                setError("Error al obtener las casos especiales.");
            } finally {
                setLoading(false);
            }
        },
        [token]
    );

    useEffect(() => {
        fetchSpecialCases(1);
    }, []);

    console.log(specialCases)

    const fetchPage = useCallback(
        (page) => fetchSpecialCases(page, searchTerm),
        [fetchSpecialCases, searchTerm]
    );

    const handleSearch = useCallback((value) => {
        setSearchTerm(value);
        setCurrentPage(1);
    }, []);

    useEffect(() => {
        fetchSpecialCases(currentPage, searchTerm);
    }, [currentPage, searchTerm, fetchSpecialCases]);

    // 🔹 Manejar edición de casos especiales
    const handleEdit = (payroll) => {
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
                response = await axios.post("/api/specialcases", payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            }

            if (response.status === 200 || response.status === 201) {
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
            }
        } catch (error) {
            if (error.response?.status === 422) {
                setValidationErrors(error.response.data.errors);
            }
        } finally {
            setLoading(false);
        }
    };

    // 🔹 Activar / Desactivar caso especial
    const handleDelete = async (id, status) => {
        const actionText = !status ? "activar" : "desactivar";

        Swal.fire({
            position: "top-end",
            title: `¿Quieres ${actionText} esta caso especial?`,
            text: `El caso especial será marcada como ${
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
                        `/api/caso especial/${id}`,
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
                        fetchSpecialCases(currentPage);
                    } else {
                        Swal.fire({
                            position: "top-end",
                            title: "Error",
                            text: "No se pudo actualizar el caso especial.",
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
                            "No se pudo actualizar la caso especial.",
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
        specialCases,
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
        fetchSpecialCases,
        handleEdit,
        handleDelete,
    };
};
