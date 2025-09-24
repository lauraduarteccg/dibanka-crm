import { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { AuthContext } from "@context/AuthContext";
import Swal from "sweetalert2";

export const useConsults = () => {
    const { token } = useContext(AuthContext);

    const [consultations, setConsultations] = useState([]);
    const [payroll, setPayroll] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});
    const [searchTerm, setSearchTerm] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isOpenADD, setIsOpenADD] = useState(false);
    const [perPage, setPerPage] = useState(1);
    const [totalItems, setTotalItems] =useState(1);
    const [formData, setFormData] = useState({
        id: null,
        name: "",
        payroll_id: [],
        is_active: true,
    });

    // ---------------------------------------------------------
    // Traer lista de consultations
    const fetchConsultation = useCallback(
        async (page = 1, search = "") => {
            setLoading(true);
            try {
                const res = await axios.get(
                    `/api/consultations?page=${page}&search=${encodeURIComponent(
                        search
                    )}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setConsultations(res.data.consultations);
                setTotalPages(
                    res.data.pagination?.total_pages ||
                        res.data.meta?.last_page ||
                        1
                );
                setCurrentPage(res.data.pagination?.current_page || page);
                setPerPage(res.data.pagination.per_page);
                setTotalItems(res.data.pagination.total_consultations)
            } catch (err) {
                console.error(err);
                setError("Error al obtener las consultas.");
            } finally {
                setLoading(false);
            }
        },
        [token]
    );

    const fetchPage = useCallback(
        (page) => fetchConsultation(page, searchTerm),
        [fetchConsultation, searchTerm]
    );

    const handleSearch = useCallback((value) => {
        setSearchTerm(value);
        setCurrentPage(1);
    }, []);

    useEffect(() => {
        fetchConsultation(currentPage, searchTerm);
    }, [currentPage, searchTerm, fetchConsultation]);

    // ---------------------------------------------------------
    // ---------------------------------------------------------
    // Manejar la edición de una consulta (rellenar form)
    const handleEdit = (row) => {
        setFormData({
            id: row.id ?? null,
            name: row.name ?? "",
            payroll_id: row.payrolls?.id ?? [],
            is_active: row.is_active ?? true,
        });
        setValidationErrors({});
        setIsOpenADD(true);
    };

    // ---------------------------------------------------------
    // Crear o actualizar consulta
    const handleSubmit = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        setLoading(true);
        setValidationErrors({});

        try {
            // Normalizar payload
            const payload = {
                name: formData.name,
                payroll_id: formData.payroll_id,
            };

            let response;
            if (formData.id) {
                response = await axios.put(
                    `/api/consultations/${formData.id}`,
                    payload,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
            } else {
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
                setFormData({ name: "", payroll_id: [], is_active: true });

                // refrescar tablas
                fetchConsultation(currentPage || 1);
                fetchConsultationSpecifics(1);
            }
        } catch (error) {
            console.error(error);
            if (error.response?.status === 422) {
                setValidationErrors(error.response.data.errors || {});
            } else {
                setError(
                    error.response?.data?.message ||
                        "Error al guardar la consulta."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    // ---------------------------------------------------------
    // Activar/Desactivar consulta
    const handleDelete = async (id, status) => {
        const actionText = !status ? "activar" : "desactivar";

        const result = await Swal.fire({
            position: "top-end",
            title: `¿Quieres ${actionText} esta consulta?`,
            text: `La consulta será marcada como ${
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
        });

        if (!result.isConfirmed) return;

        try {
            const response = await axios.delete(`/api/consultations/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

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
                fetchConsultation(currentPage || 1);
            } else {
                Swal.fire({
                    position: "top-end",
                    title: "Error",
                    text: "No se pudo actualizar la consulta.",
                    icon: "error",
                });
            }
        } catch (err) {
            Swal.fire({
                position: "top-end",
                title: "Error",
                text:
                    err.response?.data?.message ||
                    "No se pudo actualizar la consulta.",
                icon: "error",
            });
        }
    };

    // ---------------------------------------------------------
    useEffect(() => {
        // cargamos ambas listas al montar (la específica la puedes usar en selects/autocomplete)
        fetchConsultation(1);
    }, [fetchConsultation]);

    // ------------------------------------------------------------
    // Selector de pagadurias
    const fetchPayroll = useCallback(
        async (page) => {
            setLoading(true);
            try {
                const res = await axios.get(`/api/payrolls/active?page=${page}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setPayroll(res.data.payrolls);
                setTotalPages(res.data.pagination.total_pages);
                setCurrentPage(res.data.pagination.current_page);
                //console.log("Consultations =>", res.data.payrolls);
            } catch (err) {
                setError("Error al obtener las pagadurias.");
            } finally {
                setLoading(false);
            }
        },
        [token]
    );

    useEffect(() => {
        fetchPayroll(1);
    }, [fetchPayroll]);

    return {
        // datos para tablas
        consultations,
        payroll,

        // estados y control
        loading,
        error,
        isOpenADD,
        setIsOpenADD,
        formData,
        setFormData,
        validationErrors,
        currentPage,
        totalPages,
        totalItems,
        perPage,

        // acciones
        fetchConsultation,
        handleEdit,
        handleSubmit,
        handleDelete,
        fetchPage,
        handleSearch,
    };
};
