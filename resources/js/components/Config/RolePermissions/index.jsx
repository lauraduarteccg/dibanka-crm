import React from "react";

const RolePermissions = ({ role, onTogglePermission }) => {
  if (!role) return null;

  return (
    <div className="overflow-x-auto">
      <h2 className="text-lg font-bold mb-4">
        Perfil: {role.name}
      </h2>
      <table className="min-w-full border border-gray-200">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">Nombre del módulo</th>
            <th className="p-2 border">Permisos</th>
          </tr>
        </thead>
        <tbody>
          {role.modules.map((module) => (
            <tr key={module.module} className="border-b">
              <td className="p-2 border font-bold">{module.module}</td>
              <td className="p-2 border">
                <div className="flex flex-wrap gap-4">
                  {module.permissions.map((perm) => (
                    <label key={perm.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={perm.assigned}
                        onChange={() => onTogglePermission(role.id, perm.id, !perm.assigned)}
                      />
                      {perm.action.charAt(0).toUpperCase() + perm.action.slice(1)}
                    </label>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RolePermissions;
