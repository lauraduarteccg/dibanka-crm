import api from "@api/axios";

/* ===========================================================
 *  SERVICIOS DE TIPOS DE SEGUIMIENTO
 * =========================================================== */

/**
 * Obtiene los seguimientos con paginación y búsqueda.
 */
export const getMonitorings = async (page = 1, search = "") => {
  const { data } = await api.get(
    `/config/monitorings?page=${page}&search=${encodeURIComponent(search)}`
  );

  return {
    monitorings: data.monitorings || [],
    pagination: {
      total_pages: data.pagination?.total_pages ?? 1,
      current_page: data.pagination?.current_page ?? 1,
      per_page: data.pagination?.per_page ?? 10,
      total_monitorings: data.pagination?.total_monitorings ?? 0,
    },
  };
};

/**
 * Crea un nuevo tipo de seguimiento.
 */
export const createMonitoring = async (payload) => {
  const { data } = await api.post("/config/monitorings", payload);
  return data;
};

/**
 * Actualiza un tipo de seguimiento existente.
 */
export const updateMonitoring = async (id, payload) => {
  const { data } = await api.put(`/config/monitorings/${id}`, payload);
  return data;
};

/**
 * Elimina o desactiva un seguimiento.
 */
export const deleteMonitoring = async (id) => {
  const { data } = await api.delete(`/config/monitorings/${id}`);
  return data;
};
