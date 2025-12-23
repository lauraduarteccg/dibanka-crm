import api from "@api/axios";

/* ===========================================================
 *  SERVICIOS DE TIPOS DE GESTIÓN
 * =========================================================== */

/**
 * Obtiene todos los tipos de gestión con paginación y búsqueda.
 */
export const getTypeManagements = async (page = 1, search = "") => {
  const { data } = await api.get(
    `/config/typemanagements?page=${page}&search=${encodeURIComponent(search)}`
  );

  return data;
};

/**
 * Crea un nuevo tipo de gestión.
 */
export const createTypeManagement = async (payload) => {
  const { data } = await api.post("/config/typemanagements", payload);
  return data;
};

/**
 * Actualiza un tipo de gestión existente.
 */
export const updateTypeManagement = async (id, payload) => {
  const { data } = await api.put(`/config/typemanagements/${id}`, payload);
  return data;
};

/**
 * Elimina o desactiva un tipo de gestión.
 */
export const deleteTypeManagement = async (id) => {
  const { data } = await api.delete(`/config/typemanagements/${id}`);
  return data;
};

/**
 * Obtiene las pagadurías activas (para el selector).
 */
export const getActivePayrolls = async () => {
  const { data } = await api.get("/payrolls/active");
  return data.data || [];
};
