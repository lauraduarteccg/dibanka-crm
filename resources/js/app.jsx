import React, { useContext, useCallback } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "@components/Layout";
import Loader from "@components/ui/Loader";
import { AuthContext } from "@context/AuthContext";
import { TourProvider, useTour } from "@context/TourContext";
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
import steps from "./steps";

// Hook y componente de protección
import { useCan } from "@hooks/useCan";
import ProtectedRoute from "@hooks/ProtectedRoute";


// Componente interno que usa el tour
const AppContent = () => {
    const { user, loading } = useContext(AuthContext);
    const { can } = useCan();
    const { run, stopTour } = useTour();
    useTokenRefresher(35);

    // Callback mejorado para el tour - DEBE estar antes de cualquier return condicional
    const handleJoyrideCallback = useCallback(
        (data) => {
            const { type, index, status, action } = data;

            console.log("🎯 Tour callback:", { type, index, status, action });

            // Scroll suave cuando cambia de paso
            if (type === "step:before") {
                const step = steps[index];
                if (step?.target) {
                    // Esperar un poco más para asegurar que el elemento esté disponible
                    setTimeout(() => {
                        const target = document.querySelector(step.target);
                        if (target) {
                            target.scrollIntoView({
                                behavior: "smooth",
                                block: "center",
                                inline: "center",
                            });
                            console.log("✅ Elemento encontrado:", step.target);
                        } else {
                            console.warn(
                                "⚠️ Elemento no encontrado:",
                                step.target
                            );
                        }
                    }, 200);
                }
            }

            // Si el tour se completa o se cierra
            if (status === "finished" || status === "skipped") {
                stopTour();
            }

            // Si el tour se pausa, intentar reanudarlo
            if (status === "paused") {
                console.log("⏸️ Tour pausado, intentando reanudar...");
                // El tour se pausa cuando no encuentra el elemento o hay un problema
                // No detenemos el tour, solo registramos
            }

            // Si hay un error (elemento no encontrado)
            if (status === "error") {
                console.error("❌ Error en el tour:", data);
                // No detenemos el tour automáticamente, permitimos que continúe
            }
        },
        [stopTour]
    );

    // Return condicional DESPUÉS de todos los hooks
    if (loading) return <Loader />;

    return (
        <>
            <Joyride
                steps={steps}
                run={run}
                continuous={true}
                scrollToFirstStep={true}
                showProgress={true}
                showSkipButton={true}
                disableScrollParentFix={false}
                disableOverlayClose={true}
                hideCloseButton={false}
                disableCloseOnEsc={false}
                floaterProps={{
                    disableAnimation: false,
                }}
                callback={handleJoyrideCallback}
                debug={false}
                locale={{
                    back: "← Atrás",
                    close: "✕ Cerrar",
                    last: "Finalizar ✓",
                    next: "Siguiente →",
                    skip: "⏭ Saltar tour",
                }}
                styles={{
                    options: {
                        zIndex: 10000,
                        arrowColor: "#ffffff",
                        textColor: "#1f2937",
                        backgroundColor: "#ffffff",
                        overlayColor: "rgba(0, 0, 0, 0.75)",
                        spotlightShadow: "0 0 20px rgba(99, 102, 241, 0.4)",
                        beaconSize: 36,
                        zIndex: 10000,
                    },
                    tooltip: {
                        borderRadius: "12px",
                        padding: "20px",
                        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
                        fontSize: "15px",
                        lineHeight: "1.6",
                    },
                    tooltipContainer: {
                        textAlign: "left",
                    },
                    tooltipTitle: {
                        fontSize: "18px",
                        fontWeight: "700",
                        marginBottom: "12px",
                        color: "#1f2937",
                        lineHeight: "1.4",
                    },
                    tooltipContent: {
                        padding: "8px 0",
                        fontSize: "14px",
                    },
                    buttonNext: {
                        backgroundColor: "#6366f1",
                        borderRadius: "8px",
                        padding: "10px 20px",
                        fontSize: "14px",
                        fontWeight: "600",
                        border: "none",
                        color: "#ffffff",
                        cursor: "pointer",
                        transition: "all 0.2s",
                    },
                    buttonBack: {
                        color: "#6b7280",
                        marginRight: "10px",
                        fontSize: "14px",
                        fontWeight: "500",
                        padding: "10px 20px",
                        borderRadius: "8px",
                        border: "1px solid #e5e7eb",
                        backgroundColor: "#ffffff",
                        cursor: "pointer",
                        transition: "all 0.2s",
                    },
                    buttonSkip: {
                        color: "#6b7280",
                        fontSize: "13px",
                        fontWeight: "500",
                        padding: "8px 16px",
                        borderRadius: "8px",
                        border: "1px solid #e5e7eb",
                        backgroundColor: "#ffffff",
                        cursor: "pointer",
                        transition: "all 0.2s",
                    },
                    buttonClose: {
                        color: "#6b7280",
                        fontSize: "18px",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        cursor: "pointer",
                        transition: "all 0.2s",
                    },
                    overlay: {
                        mixBlendMode: "normal",
                        backgroundColor: "rgba(0, 0, 0, 0.75)",
                    },
                    spotlight: {
                        borderRadius: "8px",
                        backgroundColor: "transparent !important",
                        border: "2px solid rgba(99, 102, 241, 0.5)",
                        boxShadow: "0 0 0 4px rgba(99, 102, 241, 0.2)",
                    },
                    beacon: {
                        inner: {
                            border: "3px solid #6366f1",
                        },
                        outer: {
                            border: "3px solid #6366f1",
                            animation:
                                "joyride-beacon-inner 1.2s infinite ease-in-out",
                        },
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
                                                idSearchManagement="decimo-paso"
                                                idAddManagement="onceavo-paso"
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
                                    <Layout id_special_cases="doceavo-paso">
                                        <SpecialCases
                                            idAddSpecialCase="treceavo-paso"
                                            idSearchSpecialCase="catorceavo-paso"
                                        />
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
                                    <Layout id_config="quinceavo-paso">
                                        <Config idConfigMenu="dieciseisavo-paso" />
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

// Componente principal que envuelve con providers
const App = () => {
    return (
        <TourProvider>
            <AppContent />
        </TourProvider>
    );
};

export default App;
