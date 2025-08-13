import Table from "@components/Table";
import ButtonAdd from "@components/ButtonAdd";
import FormAdd from "@components/FormAddTest";
import Loader from "@components/Loader";
import { useConsults } from "./useConsults.js";
import * as yup from "yup";
import { FaRegComment, FaBullseye } from "react-icons/fa6";

const fields = [
    { name: "motivo_consulta",      label: "Motivo de consulta",    type: "text", icon: FaRegComment    },
    { name: "motivo_especifico",    label: "Motivo especifico",     type: "text", icon: FaBullseye      },
];
const userSchema = yup.object().shape({
    name:               yup.string().required("El nombre es obligatorio").min(6, "Mínimo 6 caracteres"),
    motivo_consulta:    yup.string().required("El tipo es obligatorio"),
    motivo_especifico:  yup.string().required("El estado es obligatorio"),
});
const columns=[ 
    { header: "ID",                 key: "id"                   },
    { header: "Motivo de consulta", key: "motivo_consulta"      },
    { header: "Motivo especifico",  key: "motivo_especifico"    },
];   

const Consults = () => {
    const {
        consultation,
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
    } = useConsults();

    return (
        <>
            <ButtonAdd
                onClickButtonAdd={() => setIsOpenADD(true)}
                text="Agregar Consulta"
            />
            <h1 className="text-2xl font-bold text-center mb-4 text-purple-mid">
                Lista de Consultas
            </h1>

            <FormAdd
                isOpen={isOpenADD}
                setIsOpen={setIsOpenADD}
                title="Consultas"
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
                    data={consultation}
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

export default Consults;
