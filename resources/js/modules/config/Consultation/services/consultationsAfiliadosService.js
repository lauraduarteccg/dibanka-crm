import api from "@api/axios";

/* ===========================================================
 *  SERVICIOS DE CONSULTAS - AFILIADOS
 * =========================================================== */

/**
 * Obtiene las consultas de afiliados con paginación y búsqueda.
 */
export const getConsults = async (page = 1, search = "") => {
    const { data } = await api.get(
        `/config/consultations-afiliados?page=${page}&search=${encodeURIComponent(
            search
        )}`
    );
    return data;
};

/**
 * Busca consultas de afiliados.
 */
export const searchConsults = async (search = "") => {
    return await getConsults(1, search);
};

/**
 * Crea una nueva consulta de afiliados.
 */
export const createConsult = async (payload) => {
    const { data } = await api.post("/config/consultations-afiliados", payload);
    return data;
};

/**
 * Actualiza una consulta de afiliados existente.
 */
export const updateConsult = async (id, payload) => {
    const { data } = await api.put(
        `/config/consultations-afiliados/${id}`,
        payload
    );
    return data;
};

/**
 * Elimina o desactiva una consulta de afiliados.
 */
export const deleteConsult = async (id) => {
    const { data } = await api.delete(`/config/consultations-afiliados/${id}`);
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
