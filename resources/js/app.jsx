import { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "@components/Layout";
import Loader from "@components/ui/Loader";
import { AuthContext } from "@context/AuthContext";
import AuthPage from "@modules/auth/pages/AuthPage";
import RecoverPage from "@modules/auth/pages/RecoverPage";
import Dashboard from "@modules/dashboard/pages/Dashboard";

import Contact from "@modules/contact/pages/Contact";
import Management from "@modules/management/pages/Management";
import AddManagement from "@modules/management/pages/AddManagement";
import SpecialCases from "@modules/specialCases/pages/SpecialCases";
import Config from "@modules/config/pages/Config";
import PopupInfoPayroll from "./modules/management/components/PopupInfoPayroll";
import Logs from "@modules/config/logs/pages/Logs";
import { useTokenRefresher } from "@utils/tokenRefresher";
import Joyride from "react-joyride";
import { ManagementStaticDataProvider } from "@modules/management/context/ManagementStaticDataContext";

// 👣 Pasos del recorrido
const steps = [
  {
    target: "#primer-paso",
    content: "MODULO DE CONTACTOS. Haga clic en el boton y luego next",
    spotlightClicks: true,
  },
  {
    target: "#segundo-paso",
    content: "AGREGAR CONTACTO",
  },
  {
    target: "#tercer-paso",
    content: "BUSCAR CONTACTO",
  },
  {
    target: "#cuarto-paso",
    content: "VER GESTIONES",
  },
  {
    target: "#quinto-paso",
    content: "EDITAR CONTACTO",
  },
  {
    target: "#sexto-paso",
    content: "ACTIVAR O DESACTIVAR CONTACTO",
  },
  {
    target: "#septimo-paso",
    content: "MODULO DE GESTIONES. Haga clic en el boton y luego next",
    spotlightClicks: true,
  },
  {
    target: "#octavo-paso",
    content: "Ver detalles de la gestion",
  },
  {
    target: "#noveno-paso",
    content: "Añadir seguimiento a la gestion",
  },
  {
    target: "#decimo-paso",
    content: "Buscar gestion",
  },
  {
    target: "#onceavo-paso",
    content: "Añadir gestion",
  },
  {
    target: "#sexto-paso",
    content: "ACTIVAR O DESACTIVAR CONTACTO",
  },
];

// Hook y componente de protección
import { useCan } from "@hooks/useCan";
import ProtectedRoute from "@hooks/ProtectedRoute";

const App = () => {
  const { user, loading } = useContext(AuthContext);
  const { can } = useCan();
  useTokenRefresher(35);
  if (loading) return <Loader />;

  return (
    <>
      <Joyride
        steps={steps}
        continuous={true}
        scrollToFirstStep={true}
        showProgress={true}
        showSkipButton={true}
        disableScrollParentFix={false}
        callback={(data) => {
          const { type, index } = data;
          // 👇 Cuando llega al paso 3 (Ver gestiones), desplazamos horizontalmente
          if (type === "step:before" && index === 3) {
            const target = document.querySelector("#cuarto-paso");
            if (target) {
              target.scrollIntoView({
                behavior: "smooth",
                block: "center",
                inline: "center", // 👉 mueve horizontalmente también
              });
            }
          }
        }}
        locale={{
          back: "Atrás",
          close: "Cerrar",
          last: "Finalizar",
          next: "Siguiente",
          skip: "Saltar",
        }}
        styles={{
          options: {
            primaryColor: "#4f46e5",
            zIndex: 9999,
          },
        }}
      />

      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<AuthPage />} />
        <Route path="/recuperar-contraseña" element={<RecoverPage />} />

        {/* Rutas privadas con Layout */}
        {user ? (
          <>
            {/* Dashboard general */}
            <Route
              path="/home"
              element={
                <Layout id_contact="primer-paso">
                  <Dashboard />
                </Layout>
              }
            />

            {/* Contactos */}
            <Route
              path="/contactos"
              element={
                <ProtectedRoute permission="contact.view">
                  <Layout id_management="septimo-paso">
                    <Contact
                      addContact="segundo-paso"
                      searchContact="tercer-paso"
                      viewManagementContact="cuarto-paso"
                      editContact="quinto-paso"
                      activeOrDesactiveContact="sexto-paso"
                    />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Gestiones - Envuelto con provider para datos estáticos compartidos */}
            <Route
              path="/gestiones"
              element={
                <ProtectedRoute permission="management.view">
                  <ManagementStaticDataProvider>
                    <Layout>
                      <Management 
                        idView="octavo-paso" 
                        idMonitoring="noveno-paso" 
                      />
                    </Layout>
                  </ManagementStaticDataProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/informacion"
              element={
                <ProtectedRoute permission="management.view">
                  <ManagementStaticDataProvider>
                    <Layout>
                      <PopupInfoPayroll />
                    </Layout>
                  </ManagementStaticDataProvider>
                </ProtectedRoute>
              }
            />

            {/* Añadir gestión */}
            <Route
              path="/gestiones/añadir"
              element={
                <ProtectedRoute permission="management.create">
                  <ManagementStaticDataProvider>
                    <Layout>
                      <AddManagement />
                    </Layout>
                  </ManagementStaticDataProvider>
                </ProtectedRoute>
              }
            />

            {/* Casos especiales */}
            <Route
              path="/casos_especiales"
              element={
                <ProtectedRoute permission="special_cases.view">
                  <Layout>
                    <SpecialCases />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Configuración */}
            <Route
              path="/configuraciones"
              element={
                <ProtectedRoute
                  permission={[
                    "config.user.edit",
                    "config.role.edit",
                    "config.payroll.edit",
                    "config.consultation.edit",
                    "config.specific.edit",
                    "config.typeManagement.edit",
                    "config.monitoring.edit",
                  ]}
                >
                  <Layout>
                    <Config />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Logs */}
            <Route
              path="/logs"
              element={
                <ProtectedRoute
                  permission={[
                    "config.user.edit",
                    "config.role.edit",
                    "config.payroll.edit",
                    "config.consultation.edit",
                    "config.specific.edit",
                    "config.typeManagement.edit",
                    "config.monitoring.edit",
                  ]}
                >
                  <Layout>
                    <Logs />
                  </Layout>
                </ProtectedRoute>
              }
            />
          </>
        ) : (
          // 🔒 Si no está autenticado
          <Route path="*" element={<Navigate to="/" replace />} />
        )}
      </Routes>
    </>
  );
};

export default App;
