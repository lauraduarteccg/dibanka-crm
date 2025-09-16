import { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { AuthContext } from "@context/AuthContext";
import Swal from "sweetalert2";

export const useConsultSpecifics = () => {
    const { token } = useContext(AuthContext);
    const [consultation, setConsultation] = useState([]);
    const [consultationNoSpecific, setConsultationNoSpecific] = useState([]);
    const [payroll, setPayroll] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});
    const [searchTerm, setSearchTerm] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isOpenADD, setIsOpenADD] = useState(false);
    const [formData, setFormData] = useState({
        id: null,
        name: "",
        consultation_id: null,
    });

    // ------------------------------------------------------------
    // Tabla de consultas específicas
    const fetchConsultation = useCallback(
        async (page, search = "") => {
            setLoading(true);
            try {
                const res = await axios.get(`/api/consultationspecifics?page=${page}&search=${encodeURIComponent(search)}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                // 🔑 Aplanamos el campo consultation.reason_consultation
                const specifics = res.data.specifics.map((s) => ({
                    ...s,
                    consultation: s.consultation.name || "—",
                    consultation_id: s.consultation.id || "—",
                }));

                setConsultation(specifics);
                setTotalPages(res.data.pagination.total_pages);
                setCurrentPage(res.data.pagination.current_page);
                //console.log("Specifics =>", specifics);
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
    }, [fetchConsultation]);

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

    // ------------------------------------------------------------
    // Manejar la edición de consultas
    const handleEdit = (specifics) => {
        setFormData({
            id: specifics.id ?? null,
            name: specifics.name ?? "",
            consultation_id: specifics.consultation_id ?? "—", 
        });
        setValidationErrors({});
        setIsOpenADD(true);
    };
    // Debug
    // console.log(formData);

    // ------------------------------------------------------------
    // Crear o actualizar consulta
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setValidationErrors({});

        try {
            let response;
            const payload = { 
                name: formData.name,
                consultation_id: formData.consultation_id
            };

            if (formData.id) {
                // ✅ Actualizar consulta
                response = await axios.put(
                    `/api/consultationspecifics/${formData.id}`,
                    payload,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } else {
                // ✅ Crear consulta
                response = await axios.post(`/api/consultationspecifics`, payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            }

            if (response.status === 200 || response.status === 201) {
                Swal.fire({
                    title: formData.id ? "Consulta actualizada" : "Consulta creada",
                    text: "Los cambios han sido guardados correctamente.",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false,
                });
                setFormData({ name: "",  consultation_id: [], is_active: true });
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

    // ------------------------------------------------------------
    // Desactivar consulta
    const handleDelete = async (id, status) => {
        const actionText = !status ? "activar" : "desactivar";

        Swal.fire({
            position: "top-end",
            title: `¿Quieres ${actionText} esta consulta?`,
            text: `La consulta será marcada como ${!status ? "Activo" : "Inactivo"}.`,
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
                setValidationErrors({}); 
                try {
                    const response = await axios.delete(
                        `/api/consultationspecifics/${id}`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );

                    if (response.status === 200) {
                        Swal.fire({
                            position: "top-end",
                            title: "Estado actualizado",
                            text: `La consulta ahora está ${!status ? "Activo" : "Inactivo"}.`,
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
                            width: "350px",
                            padding: "0.8em",
                        });
                    }
                } catch (error) {
                    Swal.fire({
                        position: "top-end",
                        title: "Error",
                        text: error.response?.data?.message || "No se pudo actualizar la consulta.",
                        icon: "error",
                        width: "350px",
                        padding: "0.8em",
                    });
                }
            }
        });
    };

    // ------------------------------------------------------------
    // Selector de consultas no específicas
    const fetchConsultationNoSpecifics = useCallback(
        async (page) => {
            setLoading(true);
            try {
                const res = await axios.get(`/api/consultations?page=${page}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setConsultationNoSpecific(res.data.consultations);
                setTotalPages(res.data.pagination.total_pages);
                setCurrentPage(res.data.pagination.current_page);
                //console.log("Consultations =>", res.data.consultations);
            } catch (err) {
                setError("Error al obtener las consultas.");
            } finally {
                setLoading(false);
            }
        },
        [token]
    );

    useEffect(() => {
        fetchConsultationNoSpecifics(1);
    }, [fetchConsultationNoSpecifics]);

// 🔹 limpiar errores
    const handleOpenForm = () => {
        setValidationErrors({});  
        setFormData({
            id: null,
            name: "",
            consultation_id: null,
        });
        setIsOpenADD(true);
}   ;
    // ------------------------------------------------------------
    // Selector de pagadurias no específicas
    const fetchPayrolls = useCallback(
        async (page) => {
            setLoading(true);
            try {
                const res = await axios.get(`/api/payrolls?page=${page}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setPayroll(res.data.payrolls);
                setTotalPages(res.data.pagination.total_pages);
                setCurrentPage(res.data.pagination.current_page);
                //console.log("pagadurias =>", res.data.payrolls);
            } catch (err) {
                setError("Error al obtener las pagadurias.");
            } finally {
                setLoading(false);
            }
        },
        [token]
    );

    useEffect(() => {
        fetchPayrolls(1);
    }, [fetchPayrolls]);

    return {
        fetchPage,
        handleSearch,
        handleOpenForm,
        payroll,
        consultation,
        consultationNoSpecific,
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
        handleDelete,
    };
};
