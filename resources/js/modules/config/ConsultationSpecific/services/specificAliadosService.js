import api from "@api/axios";

/* ===========================================================
 *  SERVICIOS DE CONSULTAS ESPECÍFICAS - ALIADOS
 * =========================================================== */

/**
 * Obtiene las consultas específicas de aliados con paginación y búsqueda.
 */
export const getSpecificAliados = async (page = 1, search = "") => {
  const { data } = await api.get(
    `/config/consultationspecifics-aliados?page=${page}&search=${encodeURIComponent(search)}`
  );

  const specifics = (data.specifics || []).map((s) => ({
    ...s,
    consultation: s.consultation?.name || "—",
    consultation_id: s.consultation?.id || null,
    payroll: s.consultation?.payrolls?.map(p => p.name).join(", ") || "—",
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
 * Crea una nueva consulta específica de aliados.
 */
export const saveSpecificAliado = async (payload) => {
  const { data } = await api.post("/config/consultationspecifics-aliados", payload);
  return data;
};

/**
 * Actualiza una consulta específica de aliados.
 */
export const updateSpecificAliado = async (id, payload) => {
  const { data } = await api.put(`/config/consultationspecifics-aliados/${id}`, payload);
  return data;
};

/**
 * Elimina o desactiva una consulta específica de aliados.
 */
export const deleteSpecificAliado = async (id) => {
  const { data } = await api.delete(`/config/consultationspecifics-aliados/${id}`);
  return data;
};

/* ===========================================================
 *  SERVICIOS COMPARTIDOS
 * =========================================================== */

/**
 * Obtiene todas las consultas generales activas (para el selector).
 */
export const getConsultationsForSelect = async () => {
  const { data } = await api.get("/config/consultations-aliados/active");
  return data.consultations || [];
};

/**
 * Pagadurías activas.
 */
export const getActivePayrolls = async () => {
  const { data } = await api.get("/payrolls/active");
  return data.data || [];
};
