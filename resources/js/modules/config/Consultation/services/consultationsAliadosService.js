import api from "@api/axios";

/* ===========================================================
 *  SERVICIOS DE CONSULTAS - ALIADOS
 * =========================================================== */

/**
 * Obtiene las consultas de aliados con paginación y búsqueda.
 */
export const getConsults = async (page = 1, search = "") => {
    const { data } = await api.get(
        `/config/consultations-aliados?page=${page}&search=${encodeURIComponent(
            search
        )}`
    );
    return {
        consultations: data.consultations || [],
        pagination: {
            total_pages: data.pagination?.total_pages ?? 1,
            current_page: data.pagination?.current_page ?? 1,
            per_page: data.pagination?.per_page ?? 10,
            total_consultations: data.pagination?.total_consultations ?? 0,
        },
    };
};

/**
 * Busca consultas de aliados.
 */
export const searchConsults = async (search = "") => {
    return await getConsults(1, search);
};

/**
 * Crea una nueva consulta de aliados.
 */
export const createConsult = async (payload) => {
    const { data } = await api.post("/config/consultations-aliados", payload);
    return data;
};

/**
 * Actualiza una consulta de aliados existente.
 */
export const updateConsult = async (id, payload) => {
    const { data } = await api.put(
        `/config/consultations-aliados/${id}`,
        payload
    );
    return data;
};

/**
 * Elimina o desactiva una consulta de aliados.
 */
export const deleteConsult = async (id) => {
    const { data } = await api.delete(`/config/consultations-aliados/${id}`);
    return data;
};

/* ===========================================================
 *  SERVICIO DE PAGADURÍAS (para selector)
 * =========================================================== */

/**
 * Obtiene todas las pagadurías activas.
 */
export const getActivePayrolls = async () => {
    const { data } = await api.get("/payrolls/active");
    return data.data || [];
};
