import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "@components/Layout";

import { AuthContext } from "@context/AuthContext";
import Dashboard from "@pages/Dashboard";
import AuthPage from "@pages/AuthPage";
import RecoverPage from "@pages/RecoverPage";
import Contact from "@pages/Contact";
import Management from "@pages/Management";
import AddManagement from "@pages/AddManagement";
import SpecialCases from "@pages/SpecialCases";
import Loader from "@components/ui/Loader";
import Config from "@pages/Config";

const App = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <Loader />;

    return (
        <Routes>
            <Route path="/" element={<AuthPage />} />
            <Route path="/recuperar-contraseña" element={<RecoverPage />} />

            <Route
                path="/home"
                element={
                    user ? (
                        <Layout>
                            <Dashboard />
                        </Layout>
                    ) : (
                        <Navigate to="/" />
                    )
                }
            />

            <Route
                path="/contactos"
                element={
                    user ? (
                        <Layout>
                            <Contact />
                        </Layout>
                    ) : (
                        <Navigate to="/" />
                    )
                }
            />
            <Route
                path="/gestiones"
                element={
                    user ? (
                        <Layout>
                            <Management />
                        </Layout>
                    ) : (
                        <Navigate to="/" />
                    )
                }
            />
            <Route
                path="/gestiones/añadir"
                element={
                    user ? (
                        <Layout>
                            <AddManagement />
                        </Layout>
                    ) : (
                        <Navigate to="/" />
                    )
                }
            />

            <Route
                path="/casos_especiales"
                element={
                    user ? (
                        <Layout>
                            <SpecialCases />
                        </Layout>
                    ) : (
                        <Navigate to="/" />
                    )
                }
            />

            <Route
                path="/configuraciones"
                element={
                    user ? (
                        <Layout>
                            <Config />
                        </Layout>
                    ) : (
                        <Navigate to="/" />
                    )
                }
            />
            <Route
                path="/configuraciones/perfiles/edit/:id/:name"
                element={<EditRole />}
            />
        </Routes>
    );
};

export default App;
