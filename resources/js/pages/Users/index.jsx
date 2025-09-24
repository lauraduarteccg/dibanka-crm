import Table from "@components/Table";
import ButtonAdd from "@components/ButtonAdd";
import FormAddTest from "@components/FormAddTest";
import Loader from "@components/Loader";
import Search from "@components/Search";
import { useUsers } from "./useUsers";
import * as yup from 'yup';

// Define los campos del formulario
const userFields = [
    { name: "name", label: "Nombre", type: "text" },
    { name: "email", label: "Email", type: "email" },
    { name: "password", label: "Contraseña", type: "password", hideOnEdit: true }
];

// Schema de validación
const userSchema = yup.object().shape({
    name: yup.string().required('El nombre es requerido'),
    email: yup.string().email('Email inválido').required('El email es requerido'),
    password: yup.string()
        .min(6, 'La contraseña debe tener al menos 6 caracteres')
        .when('id', {
            is: (id) => !id,
            then: (schema) => schema.required('La contraseña es requerida'),
            otherwise: (schema) => schema.optional()
        })
});

const Users = () => {
    const {
        users,
        loading,
        error,
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
        fetchUsers,
        handleDelete,
        handleEdit,
        handleSearch,
        fetchPage,
    } = useUsers();

    return (
        <>
            <ButtonAdd
                onClickButtonAdd={() => {
                    setFormData({
                        id: null,
                        name: "",
                        email: "",
                        password: "",
                        is_active: true
                    });
                    setValidationErrors({});
                    setIsOpenADD(true);
                }}
                text="Agregar Usuario"
            />

            <div className="flex justify-end px-12 -mt-10 ">
                <Search onSearch={handleSearch} placeholder="Buscar usuario..." />
            </div>
            
            <h1 className="text-2xl font-bold text-center mb-4 text-purple-mid">
                Lista de Usuarios
            </h1>

            <FormAddTest
                isOpen={isOpenADD}
                setIsOpen={setIsOpenADD}
                title={formData.id ? "Usuario" : "Usuario"}
                formData={formData}
                setFormData={setFormData}
                validationErrors={validationErrors}
                loading={loading}
                handleSubmit={handleSubmit}
                fields={userFields} 
                schema={userSchema}
            />

            {loading ? (
                <Loader />
            ) : (
                <Table
                    columns={[
                        { header: "ID", key: "id" },
                        { header: "Nombre", key: "name" },
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