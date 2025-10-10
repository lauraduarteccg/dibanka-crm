import api from "@api/axios";

/*
 *  SERVICIO DE USUARIOS
 * */

/**
 * Obtiene la lista de usuarios con paginación y búsqueda.
 * @param {number} page - Página actual.
 * @param {string} search - Término de búsqueda.
 * @param {number} perPage - Cantidad de resultados por página.
 * @returns {Promise<Object>} - Lista de usuarios y datos de paginación.
 */
export const getUsers = async (page = 1, search = "", perPage = 10) => {
  const { data } = await api.get(
    `/config/users?page=${page}&per_page=${perPage}&search=${encodeURIComponent(search)}`
  );
console.log(data);

  return {
    users: data.users || [],
    pagination: {
      total_pages: data.pagination?.total_pages ?? 1,
      current_page: data.pagination?.current_page ?? page,
      per_page: data.pagination?.per_page ?? 10,
      total_users: data.pagination?.total_users ?? 0,
    },
  };
};

/**
 * Crea un nuevo usuario.
 * @param {Object} payload - Datos del usuario.
 * @returns {Promise<Object>} - Usuario creado.
 */
export const createUser = async (payload) => {
  const { data } = await api.post("/config/users", payload);
  return data;
};

/**
 * Actualiza un usuario existente.
 * @param {number} id - ID del usuario.
 * @param {Object} payload - Datos a actualizar.
 * @returns {Promise<Object>} - Usuario actualizado.
 */
export const updateUser = async (id, payload) => {
  const { data } = await api.put(`/config/users/${id}`, payload);
  return data;
};

/**
 * Elimina o desactiva un usuario.
 * @param {number} id - ID del usuario.
 * @returns {Promise<Object>} - Respuesta del servidor.
 */
export const deleteUser = async (id) => {
  const { data } = await api.delete(`/config/users/${id}`);
  return data;
};

/*
 *  SERVICIO DE ROLES
 * */

/**
 * Obtiene todos los roles disponibles.
 * @returns {Promise<Array>} - Lista de roles.
 */
export const getRoles = async () => {
  const { data } = await api.get("/config/roles");
  return data.roles || [];
};
