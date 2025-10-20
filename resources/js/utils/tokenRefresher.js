// @utils/tokenRefresher.js
import { useEffect, useContext, useRef } from "react";
import { AuthContext } from "@context/AuthContext";

export const useTokenRefresher = (intervalMin = 35) => {
  const { user, refreshAuthToken } = useContext(AuthContext);
  const intervalRef = useRef(null);

  useEffect(() => {
    // solo configurar el intervalo si hay usuario y no existe uno activo
    if (!user || intervalRef.current) return;

    // ⏱️ Programar refresco futuro (sin ejecutarse ahora)
    intervalRef.current = setInterval(() => {
      refreshAuthToken();
    }, intervalMin * 60 * 1000);

    // 🧹 limpiar al desmontar o cerrar sesión
    return () => {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [!!user]);
};
