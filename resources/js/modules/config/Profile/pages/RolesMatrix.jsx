import React, { useState, useEffect } from "react";
import { createRole, getRoleById, updateRole } from "@modules/config/profile/services/profileService";
import Loader from "@components/ui/Loader";
import Swal from "sweetalert2";
import ButtonAdd from "@components/ui/ButtonAdd";

// ======================================================
// 🔧 Estructura modular — agrupada por tipo
// ======================================================
const MODULE_GROUPS = {
  configuracion: {
    label: "Configuración del Sistema",
    modules: [
      { id: "config.user", name: "Usuarios" },
      { id: "payroll", name: "Pagadurías" },
      { id: "consultation", name: "Consultas" },
      { id: "specific", name: "Consultas Específicas" },
      { id: "typeManagement", name: "Tipos de Gestiones" },
      { id: "monitoring", name: "Seguimientos" },
      { id: "config.role", name: "Perfiles y Roles" },
    ],
  },
  operativos: {
    label: "Módulos Operativos",
    modules: [
      { id: "contact", name: "Contactos" },
      { id: "management", name: "Gestiones" },
      { id: "special_cases", name: "Casos Especiales" },
    ],
  },
};

const PERMISSIONS = [
  { id: "view", label: "Ver" },
  { id: "create", label: "Crear" },
  { id: "edit", label: "Editar" },
  { id: "delete", label: "Eliminar" },
];

const RolesMatrix = ({ role, onClose }) => {
  const [roleName, setRoleName] = useState(role?.name || "");
  const [permissions, setPermissions] = useState({});
  const [loading, setLoading] = useState(false);

  // ======================================================
  // Inicializar permisos base
  // ======================================================
  const initPermissions = () => {
    const defaultPerms = {};
    Object.values(MODULE_GROUPS).forEach((group) => {
      group.modules.forEach((mod) => {
        defaultPerms[mod.id] = PERMISSIONS.reduce((acc, perm) => {
          acc[perm.id] = false;
          return acc;
        }, {});
      });
    });
    setPermissions(defaultPerms);
  };

  useEffect(() => {
    initPermissions();
  }, []);

  // ======================================================
  // Cargar permisos si estamos editando
  // ======================================================
  useEffect(() => {
    if (role?.permissions) {
      const rolePermissions = role.permissions.map((p) => p.name);

      const loadedPerms = {};
      Object.values(MODULE_GROUPS).forEach((group) => {
        group.modules.forEach((mod) => {
          // base
          loadedPerms[mod.id] = PERMISSIONS.reduce((acc, perm) => {
            const key = `${mod.id}.${perm.id}`;
            const configKey = `config.${mod.id}.${perm.id}`;
            acc[perm.id] =
              rolePermissions.includes(key) ||
              rolePermissions.includes(configKey);
            return acc;
          }, {});

          // 👇 agregamos la excepción especial solo para management
          if (mod.id === "management") {
            const filtredValue =
              role?.config?.management?.viewFiltred ?? 
              rolePermissions.includes("management.viewFiltred");
            loadedPerms[mod.id]["viewFiltred"] = filtredValue;
          }

        });
      });

      setRoleName(role.name);
      setPermissions(loadedPerms);
    }
  }, [role]);


  // ======================================================
  // Alternar permisos
  // ======================================================
  const togglePermission = (moduleId, permId) => {
    setPermissions((prev) => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        [permId]: !prev[moduleId][permId],
      },
    }));
  };

  // ======================================================
  // Guardar cambios con lógica de prefijos
  // ======================================================
const handleSave = async () => {
  if (!roleName.trim()) {
    Swal.fire("Atención", "Debes ingresar un nombre para el rol.", "info");
    return;
  }

  const formattedPermissions = [];
  const configModules = ["payroll", "consultation", "specific", "typeManagement", "monitoring"];

  for (const modId in permissions) {
    for (const permId in permissions[modId]) {
      if (permissions[modId][permId]) {
        let permKey = `${modId}.${permId}`;

        // Si el módulo está en la lista especial
        if (configModules.includes(modId) && permId !== "view") {
          permKey = `config.${permKey}`;
        }

        formattedPermissions.push(permKey);
      }
    }
  }

  // ✅ Nuevo bloque: configuración especial para management.viewFiltred
  const config = {};
  if (permissions.management?.viewFiltred !== undefined) {
    config.management = { viewFiltred: permissions.management.viewFiltred };
  }

  setLoading(true);
  try {
    if (role) {
      await updateRole(role.id, { name: roleName, permissions: formattedPermissions, config });
      Swal.fire("Actualizado", "El rol se ha actualizado correctamente.", "success");
    } else {
      await createRole({ name: roleName, permissions: formattedPermissions, config });
      Swal.fire("Creado", "El nuevo rol ha sido creado.", "success");
    }
    onClose();
  } catch (error) {
    console.error(error);
    Swal.fire("Error", "No se pudieron guardar los cambios.", "error");
  } finally {
    setLoading(false);
  }
};


  if (loading) return <Loader />;

  // ======================================================
  // UI
  // ======================================================
  return (
    <div className="flex flex-col gap-6 px-6 py-6">
      <h1 className="text-2xl font-semibold text-gray-800">
        {role ? "Editar Rol" : "Crear nuevo rol"}
      </h1>

      {/* Nombre del rol */}
      <div>
        <label className="block text-gray-700 font-semibold mb-2">
          Nombre del rol
        </label>
        <input
          type="text"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
          className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-purple-light focus:outline-none"
          placeholder="Ejemplo: Administrador de Configuración"
        />
      </div>

      {/* Permisos por grupo */}
      {Object.entries(MODULE_GROUPS).map(([groupKey, group]) => (
        <div
          key={groupKey}
          className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-200 mt-6"
        >
          <h2 className="text-lg font-semibold bg-gray-100 px-6 py-3 border-b text-gray-800">
            {group.label}
          </h2>
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 w-1/3">
                  Módulo
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Permisos
                </th>
              </tr>
            </thead>
            <tbody>
              {group.modules.map((mod, i) => (
                <tr
                  key={mod.id}
                  className={`${i % 2 === 0 ? "bg-gray-50" : "bg-white"} border-b`}
                >
                  <td className="px-6 py-3 font-semibold text-gray-800">
                    {mod.name}
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex flex-wrap gap-4">
                      {/* permisos base */}
                      {PERMISSIONS.map((perm) => {
                        // 🔒 Lógica para ocultar permisos específicos
                        if (mod.id === "special_cases" && (perm.id === "delete" || perm.id === "edit")) return null;
                        if (mod.id === "config.role" && perm.id === "delete") return null;
                        if (mod.id === "management" && perm.id === "delete") return null;

                        return (
                          <label
                            key={`${mod.id}-${perm.id}`}
                            className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              className="accent-purple-light"
                              checked={permissions[mod.id]?.[perm.id] || false}
                              onChange={() => togglePermission(mod.id, perm.id)}
                            />
                            {perm.label}
                          </label>
                        );
                      })}

                      {/* permiso adicional SOLO para management */}
                      {mod.id === "management" && (
                        <label
                          key={`${mod.id}-viewFiltred`}
                          className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            className="accent-purple-light"
                            checked={permissions[mod.id]?.["viewFiltred"] || false}
                            onChange={() => togglePermission(mod.id, "viewFiltred")}
                          />
                          Ver filtradas
                        </label>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      ))}

      {/* Botón Guardar */}
      <div className="flex justify-end">
        <ButtonAdd
          text={role ? "Actualizar Rol" : "Guardar Rol"}
          onClickButtonAdd={handleSave}
        />
      </div>
    </div>
  );
};

export default RolesMatrix;
