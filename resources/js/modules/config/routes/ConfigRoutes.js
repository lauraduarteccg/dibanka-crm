// resources/js/modules/configuraciones/routes/ConfiguracionesRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

// Páginas del módulo
import Configuraciones from "@modules/configuraciones/pages/Configuraciones";
import Users from "@modules/configuraciones/usuarios/pages/Users";
import Payroll from "@modules/configuraciones/pagadurias/pages/Payroll";
import Consultation from "@modules/configuraciones/tipos-consultas/pages/Consultation";
import ConsultationSpecific from "@modules/configuraciones/consultas-especificas/pages/ConsultationSpecific";
import TypeManagement from "@modules/configuraciones/tipos-gestiones/pages/TypeManagement";
import Monitoring from "@modules/configuraciones/tipos-seguimientos/pages/Monitoring";
import Roles from "@modules/configuraciones/perfiles/pages/Roles";

const ConfiguracionesRoutes = () => {
  return (
    <Routes>
      <Route index element={<Configuraciones />} />
      <Route path="usuarios" element={<Users />} />
      <Route path="pagadurias" element={<Payroll />} />
      <Route path="tipos-consultas" element={<Consultation />} />
      <Route path="consultas-especificas" element={<ConsultationSpecific />} />
      <Route path="tipos-gestiones" element={<TypeManagement />} />
      <Route path="tipos-seguimientos" element={<Monitoring />} />
      <Route path="perfiles" element={<Roles />} />
    </Routes>
  );
};

export default ConfiguracionesRoutes;
