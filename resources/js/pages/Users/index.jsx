import Table from "@components/Table";
import ButtonAdd from "@components/ButtonAdd";
import FormAdd from "@components/FormAdd";
import Loader from "@components/Loader";
import { useUsers } from "./useUsers";

const Users = () => {
    const 
    {
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
        currentPage,
        totalPages,
        fetchUsers ,
        handleDelete,
        handleEdit
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
                    });
                    setValidationErrors({});
                    setIsOpenADD(true);
                }}
                text="Agregar Usuario"
            />
            <h1 className="text-2xl font-bold text-center mb-4 text-purple-mid">
                Lista de Usuarios
            </h1>
            <FormAdd
                isOpen={isOpenADD}
                setIsOpen={setIsOpenADD}
                title={formData.id ? "Editar Usuario" : "Añadir Usuario"}
                formData={formData}
                setFormData={setFormData}
                validationErrors={validationErrors}
                loading={loading}
                handleSubmit={handleSubmit}
            />
            {error && <p className="text-center text-red-500">{error}</p>}
            {loading ? (
                <Loader />
            ) : (
                <Table
                    columns={[
                        { header: "ID", key: "id" },
                        { header: "Nombre", key: "name" },
                        { header: "Email", key: "email" },
                        { header: "Estado", key: "is_active" },
                    ]}
                    data={users}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    fetch={fetchUsers}
                    actions={true}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}
        </>
    );
};

export default Users;
