import api from "@api/axios";

/* ===========================================================
 *  GESTIONES
 * =========================================================== */

/**
 * Obtiene la lista de gestiones con paginación, búsqueda y filtro por columna.
 * @param {number} page
 * @param {string} search - Término de búsqueda
 * @param {string} campaign - "Aliados" o "Afiliados"
 * @param {string} filterColumn - Columna específica para filtrar (opcional)
 */
export const getManagements = async (page = 1, search = "", campaign = "Aliados", filterColumn = "") => {
  const campaignLower = campaign.toLowerCase();
  let endpoint = "/management-aliados"; // Default

  if (campaignLower === "afiliados") {
    endpoint = "/management-afiliados";
  }

  let url = `${endpoint}?page=${page}`;

  // Si hay un filtro por columna específica, usar los parámetros que espera el backend
  if (filterColumn && search) {
    url += `&searchValue=${encodeURIComponent(search)}&filterColumn=${filterColumn}`;
  } 
  // Si no hay filtro específico, usar búsqueda general
  else if (search) {
    url += `&search=${encodeURIComponent(search)}`;
  }

  const { data } = await api.get(url);

  return {
    managements: data.managements || [],
    count: data.count || 0,
    pagination: {
      current_page: data.pagination?.current_page ?? 1,
      last_page: data.pagination?.last_page ?? data.pagination?.total_pages ?? 1,
      per_page: data.pagination?.per_page ?? 0,
      total: data.pagination?.total_management ?? data.pagination?.total_items ?? 0,
    },
  };
};

/**
 * Crea una nueva gestión según la campaña seleccionada.
 * Para actualizaciones (con id), usa el endpoint estándar.
 * Para creaciones, usa endpoints específicos por campaña.
 * 
 * @param {Object} payload - Datos de la gestión
 * @param {string} campaign - "Aliados" o "Afiliados"
 */
export const saveManagement = async (payload, campaign = "") => {
  const { id } = payload;
  
  // Si tiene ID, es una actualización (usar endpoint estándar)
  if (id) {
    const { data } = await api.put(`/management/${id}`, payload);
    return data;
  }
  
  // Para nuevas gestiones, determinar endpoint según campaña
  const campaignLower = campaign.toLowerCase();
  let endpoint = "/management-aliados"; // Por defecto Aliados
  
  if (campaignLower == "afiliados") {
    endpoint = "/management-afiliados";
  }
  
  console.log(`🎯 Creando gestión en: ${endpoint} (Campaña: "${campaign}")`);
  console.log('📊 Tipo de campaign:', typeof campaign, 'Valor:', campaign);
  
  const { data } = await api.post(endpoint, payload);
  return data;
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
 * @param {number} id
 * @param {Object} payload
 * @param {string} campaign - "Aliados" o "Afiliados"
 */
export const updateManagementMonitoring = async (id, payload, campaign = "Aliados") => {
  const campaignLower = campaign.toLowerCase();
  let endpoint = `/managementmonitoring-aliados/${id}`; // Default

  if (campaignLower === "afiliados") {
    endpoint = `/managementmonitoring-afiliados/${id}`;
  }

  const { data } = await api.put(endpoint, payload);
  return data;
};

/* ===========================================================
 *  CONSULTAS - DINÁMICAS POR CAMPAÑA
 * =========================================================== */

/**
 * Consultas activas según la campaña.
 * @param {string} campaign - "aliados" o "afiliados"
 */
export const getActiveConsultationsByCampaign = async (campaign = "") => {
  if (!campaign) {
    return [];
  }
  
  const campaignLower = campaign.toLowerCase();
  const endpoint = `/config/consultations-${campaignLower}/active`;
  
  try {
    const { data } = await api.get(endpoint);
    return data.consultations || [];
  } catch (error) {
    console.error(`Error al obtener consultas de ${campaign}:`, error);
    return [];
  }
};

/**
 * Consultas específicas activas según la campaña.
 * @param {string} campaign - "aliados" o "afiliados"
 */
export const getActiveSpecificConsultationsByCampaign = async (campaign = "") => {
  if (!campaign) {
    return [];
  }
  
  const campaignLower = campaign.toLowerCase();
  const endpoint = `/config/consultationspecifics-${campaignLower}/active`;
  
  try {
    const { data } = await api.get(endpoint);
    return data.consultationspecific || [];
  } catch (error) {
    console.error(`Error al obtener consultas específicas de ${campaign}:`, error);
    return [];
  }
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
 *  CONTEO DE GESTIONES ALIADOS Y AFILIADOS
 * =========================================================== */

/**
 * Obtiene todos los conteos de gestiones activos.
 */
export const getCountManagementsAliados = async () => {
  const { data } = await api.get("/management-aliados/count");
  return data.count || [];
};

/**
 * Obtiene todos los conteos de gestiones activos.
 */
export const getCountManagementsAfiliados = async () => {
  const { data } = await api.get("/management-afiliados/count");
  return data.count || [];
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
 * Contactos con filtro por columna.
 * @param {number} page - Número de página
 * @param {string} search - Término de búsqueda
 * @param {string} filterColumn - Columna específica para filtrar (opcional)
 */
export const getContacts = async (page = 1, search = "", filterColumn = "") => {
  let url = `/contacts/active?page=${page}`;
  
  // Si hay un filtro por columna específica
  if (filterColumn && search) {
    url += `&searchValue=${encodeURIComponent(search)}&filterColumn=${filterColumn}`;
  } 
  // Si no hay filtro específico, usar búsqueda general
  else if (search) {
    url += `&search=${encodeURIComponent(search)}`;
  }
  
  const { data } = await api.get(url);
  return data || [];
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