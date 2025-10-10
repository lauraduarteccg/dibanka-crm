import api from "@api/axios";

/* ===========================================================
 *  CONTACTOS
 * =========================================================== */

/**
 * Obtiene la lista de contactos con paginación y búsqueda.
 */
export const getContacts = async (page = 1, search = "") => {
    const { data } = await api.get(`/contacts?page=${page}&search=${encodeURIComponent(search)}`);
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
