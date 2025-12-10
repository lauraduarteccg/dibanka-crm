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
export const getSpecialCasesCount = async () => {
  const { data } = await api.get("/specialcases/count");
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
  const { data } = await api.get("/consultations-aliados/count");

  return data.count;
};

/**
 * Obtiene todos los conteos del dashboard en paralelo.
 */
export const getDashboardCounts = async () => {
  const [contacts, specialcases, payrolls, consultations] = await Promise.all([
    getContactsCount(),
    getSpecialCasesCount(),
    getPayrollsCount(),
    getConsultationsCount(),
  ]);

  return { contacts, specialcases, payrolls, consultations };
};
