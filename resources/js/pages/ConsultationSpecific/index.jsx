import Table from "@components/Table";
import ButtonAdd from "@components/ButtonAdd";
import FormAdd from "@components/FormAddTest";
import Loader from "@components/Loader";
import { useConsultSpecifics } from "./useConsultSpecifics.js";
import * as yup from "yup";
import { FaRegComment, FaBullseye } from "react-icons/fa6";

const fields = [
    { name: "specific_reason",      label: "Motivo especifico",     type: "text", icon: FaBullseye      },
];
const userSchema = yup.object().shape({
    specific_reason:        yup.string().required("El motivo especifico es obligatorio"),
});
const columns=[ 
    { header: "ID",                 key: "id"                   },
    { header: "Motivo especifico",  key: "specific_reason"      },
];   

const ConsultationSpecific = () => {
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
    } = useConsultSpecifics();

    return (
        <>
            <ButtonAdd
                onClickButtonAdd={() => setIsOpenADD(true)}
                text="Agregar Consulta"
            />
            <h1 className="text-2xl font-bold text-center mb-4 text-purple-mid">
                Lista de Consultas Especificas
            </h1>

            <FormAdd
                isOpen={isOpenADD}
                setIsOpen={setIsOpenADD}
                title="Consultas especificas"
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

export default ConsultationSpecific;
