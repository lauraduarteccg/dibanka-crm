import { createContext, useContext, useState, useCallback } from "react";

const TourContext = createContext(null);

export const TourProvider = ({ children }) => {
  const [run, setRun] = useState(false);

  const startTour = useCallback(() => {
    // Pequeño delay para asegurar que el DOM esté listo
    setTimeout(() => {
      setRun(true);
      console.log("🚀 Tour iniciado");
    }, 100);
  }, []);

  const stopTour = useCallback(() => {
    setRun(false);
    console.log("🛑 Tour detenido");
  }, []);

  const value = {
    run,
    startTour,
    stopTour,
  };

  return <TourContext.Provider value={value}>{children}</TourContext.Provider>;
};

export const useTour = () => {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error("useTour debe usarse dentro de TourProvider");
  }
  return context;
};

