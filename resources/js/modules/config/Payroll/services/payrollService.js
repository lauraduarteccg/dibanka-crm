import api from "@api/axios";

/* ===========================================================
 *  SERVICIO DE PAGADURÍAS (CONFIG)
 * =========================================================== */

/**
 * Obtiene la lista de pagadurías con búsqueda y paginación.
 */
export const getPayrolls = async (page = 1, search = "") => {
  const { data } = await api.get(
    `/config/payrolls-all?page=${page}&search=${encodeURIComponent(search)}`
  );
  return {
    payrolls: data.data || [],
    pagination: {
      total_pages: data.pagination?.total_pages ?? 1,
      current_page: data.pagination?.current_page ?? 1,
      per_page: data.pagination?.per_page ?? 10,
      total_payrolls: data.pagination?.total_payrolls ?? 0,
    },
  };
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
