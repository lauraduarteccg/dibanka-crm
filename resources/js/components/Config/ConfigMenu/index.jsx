import React, { useState } from "react";
import {
    FiUser,
    FiBriefcase,
    FiSearch,
    FiFileText,
    FiSettings,
    FiFlag,
    FiKey,
} from "react-icons/fi";

const ConfigMenu = ({ onSelect }) => {
    const [selected, setSelected] = useState();

    const menuItems = [
        { id: "usuarios", label: "Usuarios", icon: <FiUser /> },
        { id: "perfiles", label: "Perfiles", icon: <FiKey /> },
        { id: "pagadurias", label: "Pagadurías", icon: <FiBriefcase /> },
        {
            id: "tipos-consultas",
            label: "Tipos de Consultas",
            icon: <FiSearch />,
        },
        {
            id: "consultas-especificas",
            label: "Consultas Específicas",
            icon: <FiFileText />,
        },
        {
            id: "tipos-gestiones",
            label: "Tipos de Gestiones",
            icon: <FiSettings />,
        },
        {
            id: "tipos-seguimientos",
            label: "Tipos de seguimientos",
            icon: <FiFlag />,
        },
    ];

    const handleClick = (id) => {
        setSelected(id);
        if (onSelect) onSelect(id);
    };

    return (
        <div className="bg-white shadow-md rounded-xl p-4 mx-12">
            <ul className="flex flex-row space-x-2 justify-center">
                {menuItems.map((item) => {
                    const isActive = selected === item.id;
                    return (
                        <li key={item.id}>
                            <button
                                onClick={() => handleClick(item.id)}
                                className={`flex items-center px-3 py-2 rounded-lg transition
                  ${
                      isActive
                          ? "bg-purple-light text-white"
                          : "text-gray-700 hover:bg-purple-light hover:text-white"
                  }`}
                            >
                                <span className="mr-2 text-xl">
                                    {item.icon}
                                </span>
                                <span className="text-sm font-medium">
                                    {item.label}
                                </span>
                            </button>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default ConfigMenu;
