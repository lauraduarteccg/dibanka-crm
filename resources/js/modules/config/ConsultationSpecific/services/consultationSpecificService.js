import api from "@api/axios";

/* ===========================================================
 *  SERVICIOS DE CONSULTAS ESPECÍFICAS
 * =========================================================== */

/**
 * Obtiene todas las consultas específicas con paginación y búsqueda.
 */
export const getConsultationSpecifics = async (page = 1, search = "") => {
  const { data } = await api.get(
    `/config/consultationspecifics?page=${page}&search=${encodeURIComponent(search)}`
  );

  const specifics = data.specifics?.map((s) => ({
    ...s,
    consultation: s.consultation?.name || "—",
    consultation_id: s.consultation?.id || null,
    payroll: s.consultation?.payroll?.name || "—",
  }));

  return {
    specifics,
    pagination: {
      total_pages: data.pagination?.total_pages ?? 1,
      current_page: data.pagination?.current_page ?? 1,
      per_page: data.pagination?.per_page ?? 10,
      total_specifics: data.pagination?.total_consultations ?? 0,
    },
  };
};

/**
 * Crea una nueva consulta específica.
 */
export const createConsultationSpecific = async (payload) => {
  const { data } = await api.post("/config/consultationspecifics", payload);
  return data;
};

/**
 * Actualiza una consulta específica.
 */
export const updateConsultationSpecific = async (id, payload) => {
  const { data } = await api.put(`/config/consultationspecifics/${id}`, payload);
  return data;
};

/**
 * Elimina o desactiva una consulta específica.
 */
export const deleteConsultationSpecific = async (id) => {
  const { data } = await api.delete(`/config/consultationspecifics/${id}`);
  return data;
};

/**
 * Obtiene todas las consultas generales activas (para el selector).
 */
export const getConsultationsForSelect = async () => {
  const { data } = await api.get("/config/consultations/active");
  return data || [];
};

/**
 * Pagadurías activas.
 */
export const getActivePayrolls = async () => {
  const { data } = await api.get("/payrolls/active");
  return data.data || [];
};