import api from "@api/axios";

/* ===========================================================
 *  SERVICIOS DE CONSULTAS
 * =========================================================== */

/**
 * Obtiene las consultas con paginación y búsqueda.
 */
export const getConsultations = async (page = 1, search = "") => {
  const { data } = await api.get(`/config/consultations?page=${page}&search=${encodeURIComponent(search)}`);
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
 * Crea una nueva consulta.
 */
export const createConsultation = async (payload) => {
  const { data } = await api.post("/config/consultations", payload);
  return data;
};

/**
 * Actualiza una consulta existente.
 */
export const updateConsultation = async (id, payload) => {
  const { data } = await api.put(`/config/consultations/${id}`, payload);
  return data;
};

/**
 * Elimina o desactiva una consulta.
 */
export const deleteConsultation = async (id) => {
  const { data } = await api.delete(`/config/consultations/${id}`);
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
