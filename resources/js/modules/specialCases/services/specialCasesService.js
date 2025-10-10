import api from "@api/axios";

/* ===========================================================
 *  CASOS ESPECIALES
 * =========================================================== */

/**
 * Obtiene todos los casos especiales con paginación y búsqueda.
 */
export const getSpecialCases = async (page = 1, search = "") => {
  const { data } = await api.get(
    `/specialcases?page=${page}&search=${encodeURIComponent(search)}`
  );

  return {
    specialCases: data.specialcases || [],
    pagination: {
      total_pages: data.pagination?.total_pages ?? 1,
      current_page: data.pagination?.current_page ?? 1,
      per_page: data.pagination?.per_page ?? 0,
      total: data.pagination?.total_special_cases ?? 0,
    },
  };
};

/**
 * Crea o actualiza un caso especial.
 */
export const saveSpecialCase = async (payload) => {
  const { id } = payload;
  if (id) {
    const { data } = await api.put(`/specialcases/${id}`, payload);
    return data;
  } else {
    const { data } = await api.post("/specialcases", payload);
    return data;
  }
};

/**
 * Activa o desactiva un caso especial.
 */
export const deleteSpecialCase = async (id) => {
  const { data } = await api.delete(`/specialcases/${id}`);
  return data;
};

/* ===========================================================
 *  SELECTORES RELACIONADOS
 * =========================================================== */

/**
 * Pagadurías activas.
 */
export const getActivePayrolls = async () => {
  const { data } = await api.get("/payrolls/active");
  return data.data || [];
};

/**
 * Lista de contactos.
 */
export const getContacts = async () => {
  const { data } = await api.get("/contacts");
  return data.contacts || [];
};

/**
 * Lista de agentes o usuarios.
 */
export const getUsers = async (page = 1) => {
  const { data } = await api.get(`/config/users?page=${page}`);
  return {
    users: data.users || [],
    pagination: {
      total_pages: data.pagination?.total_pages ?? 1,
      current_page: data.pagination?.current_page ?? 1,
    },
  };
};
