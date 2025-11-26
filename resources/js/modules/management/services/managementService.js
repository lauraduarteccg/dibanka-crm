import api from "@api/axios";

/* ===========================================================
 *  GESTIONES
 * =========================================================== */

/**
 * Obtiene la lista de gestiones con paginación y búsqueda.
 */
export const getManagements = async (page = 1, search = "") => {
  const { data } = await api.get(
    `/management?page=${page}&search=${encodeURIComponent(search)}`
  );

  return {
    managements: data.managements || [],
    pagination: {
      current_page: data.pagination?.current_page ?? 1,
      last_page: data.pagination?.last_page ?? 1,
      per_page: data.pagination?.per_page ?? 0,
      total: data.pagination?.total_management ?? 0,
    },
  };
};
/**
 * Crea una nueva gestión o actualiza una existente.
 */
export const saveManagement = async (payload) => {
  const { id } = payload;
  if (id) {
    const { data } = await api.put(`/management/${id}`, payload);
    return data;
  } else {
    const { data } = await api.post("/management", payload);
    return data;
  }
};


/**
 * Tipos de gestión activos.
 */
export const getActiveTypeManagements = async () => {
  const { data } = await api.get("/config/typemanagements/active");
  return data.typeManagement || [];
};

/**
 * Actualiza los campos solution_date y monitoring_id de una gestión.
 */
export const updateManagementMonitoring = async (id, payload) => {
  const { data } = await api.put(`/managementmonitoring/${id}`, payload);
  return data;
};

/**
 * Consultas específicas activas.
 */
export const getActiveSpecificConsultations = async () => {
  const { data } = await api.get("/config/consultationspecifics/active");
  return data.consultationspecific || [];
};

/* ===========================================================
 *  SEGUIMIENTOS
 * =========================================================== */

/**
 * Obtiene todos los seguimientos activos.
 */
export const getActiveMonitorings = async () => {
  const { data } = await api.get("/monitorings/active");
  return data.monitorings || [];
};


/* ===========================================================
 *  LISTAS PARA FORMULARIO
 * =========================================================== */

/**
 * Pagadurías activas.
 */
export const getActivePayrolls = async () => {
  const { data } = await api.get("/payrolls/active");
  return data.data || [];
};

/**
 * Contactos.
 */
export const getContacts = async (page = 1, search = "", payroll = "") => {
  const { data } = await api.get(`/contacts/active?search=${encodeURIComponent(search)}&payroll=${encodeURIComponent(payroll)}&page=${page}`);
  return data || [];
};

/**
 * Consultas activas.
 */
export const getActiveConsultations = async () => {
  const { data } = await api.get("/config/consultations/active");
  return data.consultation || [];
};

/**
 * Enviar sms.
 */
export const sendSms = async (payload) => {
  const { data } = await api.post("/send-sms", payload);
  return data;
};

/**
 * Enviar WhatsApp.
 */
export const sendWhatsApp = async (payload) => {
  const { data } = await api.post("/send-wsp", payload);
  return data;
};