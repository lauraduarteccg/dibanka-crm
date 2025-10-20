// @utils/tokenRefresher.js
import { useEffect, useContext, useRef } from "react";
import { AuthContext } from "@context/AuthContext";

export const useTokenRefresher = (intervalMin = 35) => {
  const { user, refreshAuthToken } = useContext(AuthContext);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!user || intervalRef.current) return; // evita múltiples intervalos

    // Ejecutar inmediatamente
    refreshAuthToken();

    // Programar refresco
    intervalRef.current = setInterval(() => {
      refreshAuthToken();
    }, intervalMin * 60 * 1000);


    // Limpiar al desmontar
    return () => clearInterval(intervalRef.current);
  }, [!!user]); // solo se ejecuta cuando pasa de null → objeto válido
};
