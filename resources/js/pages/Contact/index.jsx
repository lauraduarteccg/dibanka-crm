import Table from "@components/Table";
import ButtonAdd from "@components/ButtonAdd";
import FormAdd from "@components/FormAddTest";
import Loader from "@components/Loader";
import { useContact } from "./useContact.js";
import * as yup from "yup";
import { FaRegComment, FaBullseye } from "react-icons/fa6";

const fields = [
    { name: "nombre", label: "Nombre", type: "text", icon: FaRegComment },
    { name: "tipo_identificacion", label: "Tipo de identificación", type: "text", icon: FaBullseye },
    { name: "telefono", label: "Teléfono", type: "text", icon: FaBullseye },
    { name: "numero_identificacion", label: "Numero de identificación", type: "text", icon: FaBullseye },
    { name: "celular_actualizado", label: "Celular actualizado", type: "text", icon: FaBullseye },
    { name: "correo", label: "Correo", type: "text", icon: FaBullseye },
];
const userSchema = yup.object().shape({
    nombre: yup.string().required("El nombre es obligatorio").min(6, "Mínimo 6 caracteres"),
    tipo_identificacion: yup.string().required("El tipo es obligatorio"),
    telefono: yup.string().required("El teléfono es obligatorio"),
    numero_identificacion: yup.string().required("El número de identificación es obligatorio"),
    celular_actualizado: yup.string().required("El celular actualizado es obligatorio"),
    correo: yup.string().required("El correo electronico es obligatorio"),
});
const columns=[ 
    { header: "ID", key: "id" },
    { header: "Nombre", key: "nombre" },
    { header: "Tipo de identificación", key: "tipo_identificacion" },
    { header: "Telefono", key: "telefono" },
    { header: "Número de identificación", key: "numero_identificacion" },
    { header: "Celular actualizado", key: "celular_actualizado" },
    { header: "Correo", key: "correo" },
];   

const Contact = () => {
    const {
        contact,
        loading,
        error,
        isOpenADD,
        setIsOpenADD,
        formData,
        setFormData,
        validationErrors,
        handleSubmit,
        currentPage,
        totalPages,
        fetchConsultation,
        handleDelete,
        handleEdit,
    } = useContact();

    return (
        <>
            <ButtonAdd
                onClickButtonAdd={() => setIsOpenADD(true)}
                text="Agregar contacto"
            />
            <h1 className="text-2xl font-bold text-center mb-4 text-purple-mid">
                Lista de Contactos
            </h1>

            <FormAdd
                isOpen={isOpenADD}
                setIsOpen={setIsOpenADD}
                title="Contactos"
                formData={formData}
                setFormData={setFormData}
                handleSubmit={handleSubmit}
                loading={loading}
                validationErrors={validationErrors}
                fields={fields}
                schema={userSchema}
            />

            {loading ? (
                <Loader />
            ) : (
                <Table
                    columns={columns}
                    data={contact}
                    currentPage={currentPage}
                    fetch={fetchConsultation}
                    onDelete={handleDelete}
                    totalPages={totalPages}
                    actions={true}
                    onEdit={handleEdit}
                />
            )}
        </>
    );
};

export default Contact;
