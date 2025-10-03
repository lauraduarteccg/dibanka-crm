// Config.jsx
import React, { useState } from "react";
import DinamicTitle from "@components/ui/DinamicTitle";
import ConfigMenu from "@components/config/ConfigMenu";
import Users from "@components/config/Users";
import Payroll from "@components/config/Payroll";
import Consultation from "@components/config/Consultation";
import TypeManagement from "@components/config/TypeManagement";
import ConsultationSpecific from "@components/config/ConsultationSpecific";
import Monitoring from "@components/config/Monitoring";
import Roles from "@components/config/Roles";
// Mapeo de las vistas disponibles
const VIEWS = {
    usuarios: Users,
    pagadurias: Payroll,
    "tipos-consultas": Consultation,
    "consultas-especificas": ConsultationSpecific,
    "tipos-gestiones": TypeManagement,
    "tipos-seguimientos": Monitoring,
    "perfiles": Roles,
};

const Config = () => {
    const [selected, setSelected] = useState();

    const SelectedComponent = VIEWS[selected] || null;

    return (
        <>
            <DinamicTitle text="Configuración" />
            <ConfigMenu onSelect={setSelected} selected={selected} />
            <div className="my-6 py-2">
                {SelectedComponent ? <SelectedComponent /> : null}
            </div>
        </>
    );
};

export default Config;
