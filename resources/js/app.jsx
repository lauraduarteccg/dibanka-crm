import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "@components/Layout"; 

import { AuthContext } from "@context/AuthContext";
import Dashboard from "@pages/Dashboard";
import Users from "@pages/Users";
import AuthPage from "@pages/AuthPage";
import Payroll from "@pages/Payroll";
import Consultation from "@pages/Consultation";
import ConsultationSpecific from "@pages/ConsultationSpecific";
import Contact from "@pages/Contact";
import Management from "@pages/Management";
import AddManagement from "@pages/AddManagement";
import TypeManagement from "@pages/TypeManagement";
import SpecialCases from "@pages/SpecialCases";

const App = () => {
    const { user } = useContext(AuthContext);

    return (
        <Routes>
            <Route path="/" element={<AuthPage />} />

            <Route
                path="/home"
                element={user ? <Layout><Dashboard /></Layout> : <Navigate to="/" />}
            />
            <Route
                path="/usuarios"
                element={user ? <Layout><Users /></Layout> : <Navigate to="/" />}
            />
            <Route
                path="/pagadurias"
                element={user ? <Layout><Payroll /></Layout> : <Navigate to="/" />}
            />
            <Route
                path="/consultas"
                element={user ? <Layout><Consultation /></Layout> : <Navigate to="/" />}
            />
            <Route
                path="/contactos"
                element={user ? <Layout><Contact /></Layout> : <Navigate to="/" />}
            />
            <Route
                path="/gestiones"
                element={user ? <Layout><Management /></Layout> : <Navigate to="/" />}
            />
            <Route
                path="/gestiones/añadir"
                element={user ? <Layout><AddManagement /></Layout> : <Navigate to="/" />}
            />
            <Route
                path="/tipo_de_gestiones"
                element={user ? <Layout><TypeManagement /></Layout> : <Navigate to="/" />}
            />
            <Route
                path="/consultas_especificas"
                element={user ? <Layout><ConsultationSpecific /></Layout> : <Navigate to="/" />}
            />
            <Route
                path="/casos_especiales"
                element={user ? <Layout><SpecialCases /></Layout> : <Navigate to="/" />}
            />
        </Routes>
    );
};

export default App;
