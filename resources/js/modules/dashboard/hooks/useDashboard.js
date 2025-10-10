import { useEffect, useState, useContext } from "react";
import { AuthContext } from "@context/AuthContext";
import { getDashboardCounts } from "@modules/dashboard/services/dashboardService";

const useDashboard = (onLoginSuccess) => {
  const { user, token, loading } = useContext(AuthContext);

  const [dataCounts, setDataCounts] = useState({
    contacts: 0,
    management: 0,
    payrolls: 0,
    consultations: 0,
  });


  useEffect(() => {
  

    const fetchData = async () => {
      try {
        const counts = await getDashboardCounts();
  
        setDataCounts(counts);
      } catch (error) {
        console.error("Error al obtener datos del Dashboard:", error);
      }
    };

    fetchData();
  }, [token, loading]);

  return {
    user,
    token,
    loading,
    dataCounts,
    onLoginSuccess,
  };
};

export default useDashboard;
