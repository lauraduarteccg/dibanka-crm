import { useContext } from "react";
import { AuthContext } from "@context/AuthContext";
import Table from "@components/tables/Table";
import ButtonAdd from "@components/ui/ButtonAdd";
import FormAddTest from"@components/forms/FormAdd";
import Loader from "@components/ui/Loader";
import Search from "@components/forms/Search";
import { useUsers } from "./useUsers";
import * as yup from "yup";

// Define los campos del formulario
const fields = [
    { name: "name", label: "Nombre", type: "text" },
    { name: "role", label: "Rol", type: "select", options: [] },
    { name: "email", label: "Email", type: "email" },
    {
        name: "password",
        label: "Contraseña",
        type: "password",
        hideOnEdit: true,
    },
];

// Schema de validación
const userSchema = yup.object().shape({
    name: yup.string().required("El nombre es requerido"),
    email: yup
        .string()
        .email("Email inválido")
        .required("El email es requerido"),
    role: yup.string().required("Es requerido"),
    password: yup
        .string()
        .min(6, "La contraseña debe tener al menos 6 caracteres")
        .when("id", {
            is: (id) => !id,
            then: (schema) => schema.required("La contraseña es requerida"),
            otherwise: (schema) => schema.optional(),
        }),
});

const Users = () => {
    const {
        users,
        loading,
        roles,
        isOpenADD,
        setIsOpenADD,
        formData,
        setFormData,
        validationErrors,
        setValidationErrors,
        handleSubmit,
        per_page,
        total_users,
        currentPage,
        totalPages,
        handleDelete,
        handleEdit,
        handleSearch,
        fetchPage,
        filteredRoles,
    } = useUsers();
    const { user } = useContext(AuthContext);

    const activeUsers = users.filter((u) => u.is_active === 1).length;
    const inactiveUsers = total_users - activeUsers;

    return (
        <>
            <div className="flex justify-center gap-6 mb-4">
                <div className="bg-white shadow-md rounded-lg px-6 py-4 w-64">
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-black font-bold">
                            Usuarios Totales
                        </p>
                        <p className="text-2xl font-bold text-primary-dark">
                            {total_users}
                        </p>
                    </div>
                </div>
                <div className="bg-white shadow-md rounded-lg px-6 py-4 w-64">
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-black font-bold">
                            Usuarios Activos
                        </p>
                        <p className="text-2xl font-bold text-primary-dark">
                            {activeUsers}
                        </p>
                    </div>
                </div>
                <div className="bg-white shadow-md rounded-lg px-6 py-4 w-64">
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-black  font-bold">
                            Usuarios Inactivos
                        </p>
                        <p className="text-2xl font-bold text-primary-dark">
                            {inactiveUsers}
                        </p>
                    </div>
                </div>
            </div>

            <ButtonAdd
                onClickButtonAdd={() => {
                    setFormData({
                        id: null,
                        name: "",
                        email: "",
                        password: "",
                        is_active: true,
                    });
                    setValidationErrors({});
                    setIsOpenADD(true);
                }}
                text="Agregar Usuario"
            />

            <div className="flex justify-end px-12 -mt-10 ">
                <Search
                    onSearch={handleSearch}
                    placeholder="Buscar usuario..."
                />
            </div>

            <FormAddTest
                isOpen={isOpenADD}
                setIsOpen={setIsOpenADD}
                title={formData.id ? "Usuario" : "Usuario"}
                formData={formData}
                setFormData={setFormData}
                validationErrors={validationErrors}
                loading={loading}
                handleSubmit={handleSubmit}
                fields={fields.map((field) => {
                    if (field.name === "role") {
                        return {
                            ...field,
                            options: filteredRoles.map((p) => ({
                                value: p.id,
                                label: p.name,
                            })),
                        };
                    }
                    return field;
                })}
                schema={userSchema}
                admin={
                    formData.role == 1 && !user.roles?.includes("Administrador")
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
                        { header: "Rol", key: "rolesname" },
                        { header: "Email", key: "email" },
                    ]}
                    data={users}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    rowsPerPage={per_page}
                    totalItems={total_users}
                    fetchPage={(page) => fetchPage(page)}
                    actions={true}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}
        </>
    );
};

export default Users;
