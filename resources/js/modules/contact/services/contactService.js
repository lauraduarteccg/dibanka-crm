import api from "@api/axios";

/* ===========================================================
 *  CONTACTOS
 * =========================================================== */

/**
 * Obtiene la lista de contactos con paginación y búsqueda.
 * @param {number} page - Número de página
 * @param {string} search - Término de búsqueda general
 * @param {string} filterColumn - Columna específica para filtrar
 */
export const getContacts = async (page = 1, search = "", filterColumn = "") => {
    let url = `/contacts?page=${page}`;
    
    // Si hay un filtro por columna específica
    if (filterColumn && search) {
        url += `&${filterColumn}=${encodeURIComponent(search)}`;
    } 
    // Si no hay filtro específico, usar búsqueda general
    else if (search) {
        url += `&search=${encodeURIComponent(search)}`;
    }
    
    const { data } = await api.get(url);
    return data;
};

/**
 * Crea un nuevo contacto.
 */
export const createContact = async (contactData) => {
    const { data } = await api.post("/contacts", contactData);
    return data;
};

/**
 * Actualiza un contacto existente.
 */
export const updateContact = async (id, contactData) => {
    const { data } = await api.put(`/contacts/${id}`, contactData);
    return data;
};

/**
 * Activa o desactiva un contacto.
 */
export const deleteContact = async (id) => {
    const { data } = await api.delete(`/contacts/${id}`);
    return data;
};

/**
 * Obtiene el historial de cambios de un contacto específico.
 * @param {number} id - ID del contacto
 * @param {number} page - Número de página
 */
export const getHistoryChanges = async (contactId, page = 1) => {
    const { data } = await api.get(`/change-histories/entity/contact/${contactId}?page=${page}`);
    return data;
};

/* ===========================================================
 *  PAGADURÍAS
 * =========================================================== */

/**
 * Obtiene todas las pagadurías.
 */
export const getPayrolls = async () => {
    const { data } = await api.get("/payrolls/active");
    return data.data;
};

/**
 * Consultas activas.
 */
export const getActivePayrolls = async () => {
    const { data } = await api.get("/payrolls/active");
    return data.payrolls || [];
};