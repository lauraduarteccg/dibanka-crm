import { useContext } from "react";
import { AuthContext } from "@context/AuthContext";
import Table from "@components/tables/Table";
import ButtonAdd from "@components/ui/ButtonAdd";
import FormAdd from "@components/forms/FormAdd";
import Loader from "@components/ui/Loader";
import Search from "@components/forms/Search";
import RolePermissions from "@components/config/RolePermissions"
import { useRoles } from "./useRoles";
import * as yup from "yup";

// Campos del formulario de roles
const fields = [
    { name: "name", label: "Nombre del Rol", type: "text" },
    { name: "description", label: "Descripción", type: "textarea" },
    {
        name: "permissions",
        label: "Permisos",
        type: "select",
        multiple: true,
        options: [],
    },
];

// Schema de validación
const roleSchema = yup.object().shape({
    name: yup.string().required("El nombre del rol es requerido"),
    description: yup.string().nullable(),
    permissions: yup
        .array()
        .min(1, "Debe seleccionar al menos un permiso")
        .required("Los permisos son requeridos"),
});

const Roles = () => {
    const {
        roles,
        loading,
        permissions,
        isOpenADD,
        setIsOpenADD,
        formData,
        setFormData,
        validationErrors,
        setValidationErrors,
        handleSubmit,
        per_page,
        total_roles,
        currentPage,
        totalPages,
        handleDelete,
        handleEdit,
        handleSearch,
        fetchPage,
        selectedRole,
        setSelectedRole,
        togglePermission
    } = useRoles();

    const { user } = useContext(AuthContext);

    return (
        <>
            <div className="flex justify-center gap-6 mb-4">
                <div className="bg-white shadow-md rounded-lg px-6 py-4 w-64">
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-black font-bold">
                            Total Roles
                        </p>
                        <p className="text-2xl font-bold text-primary-dark">
                            {total_roles}
                        </p>
                    </div>
                </div>
            </div>

            <ButtonAdd
                onClickButtonAdd={() => {
                    setFormData({
                        id: null,
                        name: "",
                        description: "",
                        permissions: [],
                    });
                    setValidationErrors({});
                    setIsOpenADD(true);
                }}
                text="Agregar Rol"
            />

            <div className="flex justify-end px-12 -mt-10 ">
                <Search onSearch={handleSearch} placeholder="Buscar rol..." />
            </div>

            <FormAdd
                isOpen={isOpenADD}
                setIsOpen={setIsOpenADD}
                title={formData.id ? "Editar Rol" : "Agregar Rol"}
                formData={formData}
                setFormData={setFormData}
                validationErrors={validationErrors}
                loading={loading}
                handleSubmit={handleSubmit}
                fields={fields.map((field) => {
                    if (field.name === "permissions") {
                        return {
                            ...field,
                            options: permissions.map((p) => ({
                                value: p.id,
                                label: p.name,
                            })),
                        };
                    }
                    return field;
                })}
                schema={roleSchema}
                admin={
                    formData.name === "Administrador" &&
                    !user.roles?.includes("Administrador")
                        ? true
                        : false
                }
            />

            {loading ? (
                <Loader />
            ) : (
                <Table
                    columns={[
                        { header: "ID", key: "id" },
                        { header: "Nombre", key: "name" },
                        { header: "Descripción", key: "description" },
                        { header: "Fecha de creación", key: "created_at" },
                    ]}
                    data={roles}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    rowsPerPage={per_page}
                    totalItems={total_roles}
                    fetchPage={(page) => fetchPage(page)}
                    actions={true}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}
            {selectedRole && (
                <RolePermissions
                    role={selectedRole}
                    onTogglePermission={async (roleId, permId, assign) => {
                        const updated = await togglePermission(
                            roleId,
                            permId,
                            assign
                        );
                        setSelectedRole(updated);
                    }}
                />
            )}
        </>
    );
};

export default Roles;
