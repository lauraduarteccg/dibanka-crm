
import api from "@api/axios";

/* ===========================================================
 *  SERVICIOS DE AUTENTICACIÓN
 * =========================================================== */

/**
 * Inicia sesión y guarda token.
 */
export const login = async (email, password) => {
  const response = await api.post("/login", { email, password });

  localStorage.setItem("token", response.data.token);


  return response.data;
};

/**
 * Cierra sesión y elimina token.
 */
export const logout = async () => {
  try {
    await api.post("/logout");
  } catch {
    // No importa si el endpoint falla, limpiamos igual
  }
  
  localStorage.removeItem("token");
};

/**
 * Obtiene los datos del usuario autenticado.
 */
export const getUser = async () => {
  const response = await api.get("/me");

  return response.data.data;
};



/**
 * Solicita restablecer contraseña.
 */
export const forgotPassword = async (email) => {
  const response = await api.post("/forgot-password", { email });
  return response.data;
};

/**
 * Restablece la contraseña usando token del correo.
 */
export const resetPassword = async (data) => {
  const response = await api.post("/reset-password", data);
  return response.data;
};

export default api;