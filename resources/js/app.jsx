import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "@components/Layout"; 

import { AuthContext } from "@context/AuthContext";
import Dashboard from "@pages/Dashboard";
import Users from "@pages/Users";
import AuthPage from "@pages/AuthPage";
import Campaing from "@pages/Campaing";

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
        </Routes>
    );
};

export default App;
