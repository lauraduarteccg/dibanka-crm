import Table from "@components/Table";
import ButtonAdd from "@components/ButtonAdd";
import FormAdd from "@components/FormAddTest";
import Loader from "@components/Loader";
import { useConsults } from "./useConsults.js";
import * as yup from "yup";
import { FaRegComment, FaBullseye } from "react-icons/fa6";

const fields = [
    { name: "reason_consultation",  label: "Motivo de consulta",    type: "text", icon: FaRegComment    },
    { name: "specific_reason",      label: "Motivo especifico",     type: "text", icon: FaBullseye      },
];
const userSchema = yup.object().shape({
    reason_consultation:    yup.string().required("El motivo de consulta es obligatorio"),
    specific_reason:        yup.string().required("El motivo especifico es obligatorio"),
});
const columns=[ 
    { header: "ID",                 key: "id"                   },
    { header: "Motivo de consulta", key: "reason_consultation"  },
    { header: "Motivo especifico",  key: "specific_reason"      },
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
