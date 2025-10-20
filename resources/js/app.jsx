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
import { useTokenRefresher } from "@utils/tokenRefresher";

// Hook y componente de protección
import { useCan } from "@hooks/useCan";
import ProtectedRoute from "@hooks/ProtectedRoute";

const App = () => {
    const { user, loading } = useContext(AuthContext);
    const { can } = useCan();
    useTokenRefresher(35);
    if (loading) return <Loader />;

    return (
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
                            <Layout>
                                <Dashboard />
                            </Layout>
                        }
                    />

                    {/* Contactos (contact.view) */}
                    <Route
                        path="/contactos"
                        element={
                            <ProtectedRoute permission="contact.view">
                                <Layout>
                                    <Contact />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />

                    {/* Gestiones (management.view) */}
                    <Route
                        path="/gestiones"
                        element={
                            <ProtectedRoute permission="management.view">
                                <Layout>
                                    <Management />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />

                    {/* Añadir gestión (management.create) */}
                    <Route
                        path="/gestiones/añadir"
                        element={
                            <ProtectedRoute permission="management.create">
                                <Layout>
                                    <AddManagement />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />

                    {/* Casos especiales (special_cases.view) */}
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

                    {/* Configuración (config.view) */}
                    <Route
                        path="/configuraciones"
                        element={
                            <ProtectedRoute permission={[
                                "config.user.edit",
                                "config.role.edit",
                                "config.payroll.edit",
                                "config.consultation.edit",
                                "config.specific.edit",
                                "config.typeManagement.edit",
                                "config.monitoring.edit",
                            ]}>
                                <Layout>
                                    <Config />
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
    );
};

export default App;
