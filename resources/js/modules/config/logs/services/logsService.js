import api from "@api/axios";

/* ===========================================================
 *  LOGS DE ACTIVIDAD
 * =========================================================== */

/**
 * Obtiene todos los logs de actividad con paginación, búsqueda y filtro por fechas.
 */
export const getActivityLogs = async ({
  page = 1,
  search = "",
  start_date = null,
  end_date = null,
} = {}) => {
  try {
    const token = localStorage.getItem("token");

    const queryParams = new URLSearchParams({ page, search });

    // ✅ Las fechas ya vienen con espacio (no con "T"), así que no usamos encodeURIComponent
    if (start_date) queryParams.append("start_date", start_date);
    if (end_date) queryParams.append("end_date", end_date);

    const { data } = await api.get(`/config/activity-logs?${queryParams.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      logs: data.data || [],
      pagination: {
        total_pages: data.pagination?.total_pages ?? 1,
        current_page: data.pagination?.current_page ?? 1,
        per_page: data.pagination?.per_page ?? 0,
        total: data.pagination?.total_logs ?? 0,
      },
    };
  } catch (error) {
    console.error("Error en getActivityLogs:", error);
    throw error;
  }
};
