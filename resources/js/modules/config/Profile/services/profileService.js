import api from "@api/axios";

/* ===========================================================
 *  SERVICIOS DE ROLES Y PERMISOS
 * =========================================================== */

/**
 * Obtiene todos los roles con paginación y búsqueda.
 */
export const getRoles = async (page = 1, search = "") => {
  const { data } = await api.get(
    `/config/roles?page=${page}&search=${encodeURIComponent(search)}`
  );
  // console.log(data);

  return {
    roles: data.roles || [],
    pagination: {
      total_pages: data.pagination?.total_pages ?? 1,
      current_page: data.pagination?.current_page ?? 1,
      per_page: data.pagination?.per_page ?? 10,
      total_roles: data.pagination?.total_roles ?? 0,
    },
  };
};

/**
 * Obtiene todos los permisos disponibles.
 */
export const getPermissions = async () => {
  const { data } = await api.get("/config/permissions");
  return data.permissions || [];
};

/**
 * Crea un nuevo rol.
 */
export const createRole = async (payload) => {
  const { data } = await api.post("/config/roles", payload);
  return data;
};

/**
 * Actualiza un rol existente.
 */
export const updateRole = async (id, payload) => {
  const { data } = await api.put(`/config/roles/${id}`, payload);
  return data;
};

/**
 * Elimina o desactiva un rol.
 */
export const deleteRole = async (id) => {
  const { data } = await api.delete(`/config/roles/${id}`);
  return data;
};

/**
 *  Obtiene un rol por su ID.
 */
export const getRoleById = async (id) => {
  const { data } = await api.get(`/config/roles/${id}`);

  return data;
};