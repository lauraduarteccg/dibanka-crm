import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "@components/Layout"; 

import { AuthContext } from "@context/AuthContext";
import Dashboard from "@pages/Dashboard";
import Users from "@pages/Users";
import AuthPage from "@pages/AuthPage";
import Campaing from "@pages/Campaing";
import Consultation from "@pages/Consultation";
import Contact from "@pages/Contact";
import Management from "@pages/Management";

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
                element={user ? <Layout><Campaing /></Layout> : <Navigate to="/" />}
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
        </Routes>
    );
};

export default App;
