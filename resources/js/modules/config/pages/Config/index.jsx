import { useState } from "react";
import { useCan } from "@hooks/useCan";

import DinamicTitle from "@components/ui/DinamicTitle";
import ConfigMenu from "@modules/config/components/ConfigMenu";

// Submódulos importados desde modules
import Users from "@modules/config/users/pages/Users";
import Payroll from "@modules/config/Payroll/pages/Payroll";
import Consultation from "@modules/config/Consultation/pages/Consultation";
import ConsultationSpecific from "@modules/config/ConsultationSpecific/pages/ConsultationSpecific";
import TypeManagement from "@modules/config/TypeManagement/pages/TypeManagement";
import Monitoring from "@modules/config/Monitoring/pages/Monitoring";
import Profiles from "@modules/config/profile/pages/profiles";
import Logs from "@modules/config/logs/pages/Logs";

import { MdOutlineContentPasteSearch } from "react-icons/md";
import {
  FaUsers, FaUserShield, FaBuilding,
  FaListAlt,  FaCogs, FaClipboardCheck
} from "react-icons/fa";

// Mapeo de vistas y permisos (todos bajo config.*)

const MODULES = [
  {
    id: "usuarios",
    label: "Usuarios",
    permission: "config.user.edit",
    component: Users,
    icon: FaUsers,
  },
  {
    id: "perfiles",
    label: "Perfiles y Roles",
    permission: "config.role.edit",
    component: Profiles,
    icon: FaUserShield,
  },
  {
    id: "pagadurias",
    label: "Pagadurías",
    permission: "config.payroll.edit",
    component: Payroll,
    icon: FaBuilding,
  },
  {
    id: "tipos-consultas",
    label: "Consultas",
    permission: "config.consultation.edit",
    component: Consultation,
    icon: FaListAlt,
  },
  {
    id: "consultas-especificas",
    label: "Consultas Específicas",
    permission: "config.specific.edit",
    component: ConsultationSpecific,
    icon: MdOutlineContentPasteSearch,
  },
  {
    id: "tipos-gestiones",
    label: "Tipos de Gestiones",
    permission: "config.typeManagement.edit",
    component: TypeManagement,
    icon: FaCogs,
  },
  {
    id: "tipos-seguimientos",
    label: "Tipos de Seguimientos",
    permission: "config.monitoring.edit",
    component: Monitoring,
    icon: FaClipboardCheck,
  },
  {
    id: "logs",
    label: "Logs de Actividad",
    permission: "config.role.view",
    component: Logs,
    icon: FaClipboardCheck,
  },
];

const Config = ({ idConfigMenu }) => {
  const { can } = useCan();
  const [selected, setSelected] = useState("usuarios");

  // Filtrar los módulos accesibles según permisos del usuario
  const accessibleModules = MODULES.filter((mod) => can(mod.permission));

  // Buscar el módulo activo
  const activeModule = accessibleModules.find((m) => m.id === selected);
  const SelectedComponent = activeModule ? activeModule.component : null;

  return (
    <>
      <DinamicTitle text="Configuración del Sistema" />

      {/* Menú lateral superior (mismo estilo, ahora dinámico) */}
      <ConfigMenu
        id={idConfigMenu}
        onSelect={setSelected}
        selected={selected}
        menuItems={accessibleModules.map((m) => ({
          id: m.id,
          label: m.label,
          icon: m.icon,
        }))}
      />

      {/* Contenido dinámico */}
      <div className="my-6 py-4 px-10">
        {SelectedComponent ? (
          <SelectedComponent />
        ) : accessibleModules.length > 0 ? (
          <p className="text-gray-500 text-center">
            Selecciona una sección para configurar.
          </p>
        ) : (
          <p className="text-gray-500 text-center mt-10 text-lg">
            🚫 No tienes permisos para acceder a ningún módulo de configuración.
          </p>
        )}
      </div>
    </>
  );
};

export default Config;
