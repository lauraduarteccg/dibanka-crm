import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import {
    getConsults,
    createConsult,
    updateConsult,
    deleteConsult,
    getActivePayrolls,
} from "@modules/config/Consultation/services/consultationsAfiliadosService";

export const useConsultsAfiliados = () => {
    const [consultations, setConsultations] = useState([]);
    const [payroll, setPayroll] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [isOpenADD, setIsOpenADD] = useState(false);

    const [formData, setFormData] = useState({
        id: null,
        name: "",
        payroll_ids: [],
        is_active: true,
    });

    /* ===========================================================
     *  Obtener lista de consultas de afiliados
     * =========================================================== */
    const fetchConsultation = useCallback(async (page = 1, search = "") => {
        setLoading(true);
        try {
            const data = await getConsults(page, search);
            setConsultations(data.consultations);
            setTotalPages(data.pagination.total_pages);
            setCurrentPage(data.pagination.current_page);
            setPerPage(data.pagination.per_page);
            setTotalItems(data.pagination.total_consultations);
        } catch (err) {
            console.error(err);
            setError("Error al obtener las consultas de afiliados.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchConsultation(1);
    }, [fetchConsultation]);

    const fetchPage = useCallback(
        (page) => fetchConsultation(page, searchTerm),
        [fetchConsultation, searchTerm]
    );

    const handleSearch = useCallback(
        (value) => {
            setSearchTerm(value);
            setCurrentPage(1);
            fetchConsultation(1, value);
        },
        [fetchConsultation]
    );

    /* ===========================================================
     *  Obtener pagadurías para selector
     * =========================================================== */
    const fetchPayroll = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getActivePayrolls();
            setPayroll(data);
        } catch (err) {
            console.error("Error al obtener pagadurías:", err);
            setError("Error al obtener las pagadurías.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPayroll();
    }, [fetchPayroll]);

    /* ===========================================================
     *  Crear o actualizar consulta de afiliados
     * =========================================================== */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setValidationErrors({});

        try {
            if (formData.id) {
                await updateConsult(formData.id, formData);
                Swal.fire(
                    "Consulta actualizada",
                    "Los cambios han sido guardados correctamente.",
                    "success"
                );
            } else {
                await createConsult(formData);
                Swal.fire(
                    "Consulta creada",
                    "Se ha registrado una nueva consulta de afiliados.",
                    "success"
                );
            }
            setIsOpenADD(false);
            fetchConsultation(currentPage);
        } catch (error) {
            if (error.response?.status === 422) {
                setValidationErrors(error.response.data.errors);
            } else {
                Swal.fire(
                    "Error",
                    "Hubo un problema al guardar la consulta.",
                    "error"
                );
            }
        } finally {
            setLoading(false);
        }
    };

    /* ===========================================================
     *  Editar
     * =========================================================== */
    const handleEdit = (row) => {
        // Extraer IDs de payrolls (puede ser un array o un objeto único)
        const payrollIds = Array.isArray(row.payrolls)
            ? row.payrolls.map((p) => p.id)
            : row.payrolls?.id
            ? [row.payrolls.id]
            : [];

        setFormData({
            id: row.id,
            name: row.name,
            payroll_ids: payrollIds,
            is_active: row.is_active,
        });
        setValidationErrors({});
        setIsOpenADD(true);
    };

    /* ===========================================================
     *  Eliminar
     * =========================================================== */
    const handleDelete = async (id, status) => {
        const actionText = !status ? "activar" : "desactivar";

        Swal.fire({
            position: "top-end",
            title: `¿Quieres ${actionText} esta consulta?`,
            text: `La consulta será marcada como ${
                !status ? "Activa" : "Inactiva"
            }.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: !status ? "#28a745" : "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: `Sí, ${actionText}`,
            cancelButtonText: "Cancelar",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteConsult(id);
                    Swal.fire(
                        "Estado actualizado",
                        `La consulta ahora está ${
                            !status ? "Activa" : "Inactiva"
                        }.`,
                        "success"
                    );
                    fetchConsultation(currentPage);
                } catch {
                    Swal.fire(
                        "Error",
                        "No se pudo actualizar la consulta.",
                        "error"
                    );
                }
            }
        });
    };

    const handleCloseModal = () => {
        setIsOpenADD(false);
        setValidationErrors({});
    };

    return {
        consultations,
        payroll,
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
        fetchConsultation,
        handleEdit,
        handleSubmit,
        handleDelete,
        fetchPage,
        handleSearch,
        handleCloseModal,
    };
};
