// src/hooks/useDashboard.js
import { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import { AuthContext } from "@context/AuthContext";
import { getDashboardCounts } from "@modules/dashboard/services/dashboardService";

const useDashboard = () => {
  const { user, loading } = useContext(AuthContext);

  const location = useLocation();
  const [dataCounts, setDataCounts] = useState({
    contacts: 0,
    management: 0,
    payrolls: 0,
    consultations: 0,
  });

  useEffect(() => {
    let isMounted = true;

    if (!loading && user && location.pathname === "/home") {
      console.log("Ejecutando fetch del Dashboard en /home");

      const fetchData = async () => {
        try {
          const counts = await getDashboardCounts();
          if (isMounted) setDataCounts(counts);
        } catch (error) {
          console.error("Error al obtener datos del Dashboard:", error);
        }
      };

      fetchData();
    }

    return () => {
      isMounted = false;
    };
  }, [user, loading, location.pathname]);

  return { dataCounts, loading };
};

export default useDashboard;
