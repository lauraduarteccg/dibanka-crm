import { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  getActivePayrolls,
  getActiveTypeManagements,
  getActiveConsultations,
  getActiveSpecificConsultations,
} from "@modules/management/services/managementService";

const ManagementStaticDataContext = createContext(null);

/**
 * Provider que gestiona los datos estáticos de management
 * Estos datos se cargan una sola vez y se comparten entre todos los componentes
 */
export const ManagementStaticDataProvider = ({ children }) => {
  const [payroll, setPayroll] = useState([]);
  const [typeManagement, setTypeManagement] = useState([]);
  const [consultation, setConsultation] = useState([]);
  const [specific, setSpecific] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  /**
   * Carga todos los datos estáticos en paralelo
   * Solo se ejecuta una vez
   */
const fetchStaticData = useCallback(async () => {
  if (isLoaded) return;

  setLoading(true);
  setError(null);

  try {
    // Hacer peticiones con manejo de errores individual
    const results = await Promise.allSettled([
      getActivePayrolls(),
      getActiveTypeManagements(),
      getActiveConsultations(),
      getActiveSpecificConsultations(),
    ]);

    console.log("payroll", results[0].status === 'fulfilled' ? results[0].value : []);
    
    setPayroll(results[0].status === 'fulfilled' ? results[0].value : []);
    setTypeManagement(results[1].status === 'fulfilled' ? results[1].value : []);
    setConsultation(results[2].status === 'fulfilled' ? results[2].value : []);
    setSpecific(results[3].status === 'fulfilled' ? results[3].value : []);
    
    // Log errores individuales
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        console.error(`Error en petición ${index}:`, result.reason);
      }
    });
    
    setIsLoaded(true);
  } catch (err) {
    console.error("Error al cargar datos estáticos:", err);
    setError("Error al obtener los datos iniciales.");
  } finally {
    setLoading(false);
  }
}, [isLoaded]);

  // Cargar datos estáticos solo una vez al montar
  useEffect(() => {
    fetchStaticData();
  }, [fetchStaticData]);

  const value = {
    // Datos
    payroll,
    typeManagement,
    consultation,
    specific,

    // Estados
    loading,
    error,
    isLoaded,

    // Acciones
    refetch: fetchStaticData,
  };

  return (
    <ManagementStaticDataContext.Provider value={value}>
      {children}
    </ManagementStaticDataContext.Provider>
  );
};

/**
 * Hook para acceder a los datos estáticos
 */
export const useManagementStaticData = () => {
  const context = useContext(ManagementStaticDataContext);
  if (!context) {
    throw new Error(
      "useManagementStaticData debe usarse dentro de ManagementStaticDataProvider"
    );
  }
  return context;
};

