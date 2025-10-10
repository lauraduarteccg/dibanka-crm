import api from "@api/axios";

/**
 * Obtiene el conteo de contactos registrados.
 */
export const getContactsCount = async () => {
  const { data } = await api.get("/contacts/count");
  return data.count;
};

/**
 * Obtiene el conteo de gestiones realizadas.
 */
export const getManagementCount = async () => {
  const { data } = await api.get("/management/count");
  return data.count;
};

/**
 * Obtiene el conteo de pagadurías activas.
 */
export const getPayrollsCount = async () => {
  const { data } = await api.get("/payrolls/count");
  return data.count;
};

/**
 * Obtiene el conteo de tipos de consulta.
 */
export const getConsultationsCount = async () => {
  const { data } = await api.get("/consultations/count");

  return data.count;
};

/**
 * Obtiene todos los conteos del dashboard en paralelo.
 */
export const getDashboardCounts = async () => {
  const [contacts, management, payrolls, consultations] = await Promise.all([
    getContactsCount(),
    getManagementCount(),
    getPayrollsCount(),
    getConsultationsCount(),
  ]);

  return { contacts, management, payrolls, consultations };
};
