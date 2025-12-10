import api from "@api/axios";

/* ===========================================================
 *  SERVICIOS DE CONSULTAS ESPECÍFICAS - AFILIADOS
 * =========================================================== */

/**
 * Obtiene las consultas específicas de afiliados con paginación y búsqueda.
 */
export const getSpecificAfiliados = async (page = 1, search = "") => {
  const { data } = await api.get(
    `/config/consultationspecifics-afiliados?page=${page}&search=${encodeURIComponent(search)}`
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
 * Crea una nueva consulta específica de afiliados.
 */
export const saveSpecificAfiliado = async (payload) => {
  const { data } = await api.post("/config/consultationspecifics-afiliados", payload);
  return data;
};

/**
 * Actualiza una consulta específica de afiliados.
 */
export const updateSpecificAfiliado = async (id, payload) => {
  const { data } = await api.put(`/config/consultationspecifics-afiliados/${id}`, payload);
  return data;
};

/**
 * Elimina o desactiva una consulta específica de afiliados.
 */
export const deleteSpecificAfiliado = async (id) => {
  const { data } = await api.delete(`/config/consultationspecifics-afiliados/${id}`);
  return data;
};

/* ===========================================================
 *  SERVICIOS COMPARTIDOS
 * =========================================================== */

/**
 * Obtiene todas las consultas generales activas (para el selector).
 */
export const getConsultationsForSelect = async () => {
  const { data } = await api.get("/config/consultations-afiliados/active");
  return data.consultations || [];
};

/**
 * Pagadurías activas.
 */
export const getActivePayrolls = async () => {
  const { data } = await api.get("/payrolls/active");
  return data.data || [];
};
