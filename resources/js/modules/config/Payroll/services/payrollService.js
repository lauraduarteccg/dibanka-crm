import api from "@api/axios";

/* ===========================================================
 *  SERVICIO DE PAGADURÍAS (CONFIG)
 * =========================================================== */

/**
 * Obtiene la lista de pagadurías con búsqueda y paginación.
 */
export const getPayrolls = async (page = 1, search = "") => {
  const { data } = await api.get(
    `/config/payrolls?page=${page}&search=${encodeURIComponent(search)}`
  );
  return data;
};

/**
 * Crea una nueva pagaduría (usa FormData para archivos).
 */
export const createPayroll = async (payload) => {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(key, value);
    }
  });
  const { data } = await api.post("/config/payrolls", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

/**
 * Actualiza una pagaduría existente.
 */
export const updatePayroll = async (id, payload) => {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(key, value);
    }
  });
  formData.append("_method", "PUT");
  const { data } = await api.post(`/config/payrolls/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

/**
 * Elimina o desactiva una pagaduría.
 */
export const deletePayroll = async (id) => {
  const { data } = await api.delete(`/config/payrolls/${id}`);
  return data;
};
