import Table from "@components/Table";
import ButtonAdd from "@components/ButtonAdd";
import FormAdd from "@components/FormAddTest";
import Loader from "@components/Loader";
import { useConsultSpecifics } from "./useConsultSpecifics.js";
import * as yup from "yup";
import Search from "@components/Search"

const fields = [
    { name: "consultation_id",      label: "Motivo",                type: "select",         options: []      },
    { name: "name",                 label: "Motivo especifico",     type: "text"      },
];
const userSchema = yup.object().shape({
    name:        yup.string().required("El motivo especifico es obligatorio"),
    consultation_id: yup
        .number()
        .required("El motivo general es obligatorio")
        .typeError("Debes seleccionar un motivo general"),
});
const columns=[ 
    { header: "ID",                 key: "id"                   },
    { header: "Motivo",             key: "consultation"      },
    { header: "Motivo especifico",  key: "name"      },
];   

const ConsultationSpecific = () => {
    const {
        fetchPage,
        handleSearch,
        handleOpenForm,
        consultationNoSpecific,
        consultation,
        loading,
        error,
        isOpenADD,
        setIsOpenADD,
        formData,
        setFormData,
        validationErrors,
        handleSubmit,
        perPage,
        totalItems,
        currentPage,
        totalPages,
        fetchConsultation,
        handleDelete,
        handleEdit,
        handleCloseModal,
    } = useConsultSpecifics();

    return (
        <>
            <ButtonAdd
                onClickButtonAdd={handleOpenForm}
                text="Agregar Consulta"
            />

            <div className="flex justify-end px-12 -mt-10 ">
                <Search onSearch={handleSearch} placeholder="Buscar consulta..." />
            </div>
            <h1 className="text-2xl font-bold text-center mb-4 text-purple-mid">
                Lista de Consultas Especificas
            </h1>

            <FormAdd
                isOpen={isOpenADD}
                setIsOpen={handleCloseModal}
                title="consultas especificas"
                formData={formData}
                setFormData={setFormData}
                handleSubmit={handleSubmit}
                loading={loading}
                validationErrors={validationErrors}
                fields={fields.map(field => {
                    if (field.name === "consultation_id") {
                        return {
                            ...field,
                            options: consultationNoSpecific.map(p => ({ 
                                value: p.id,
                                label: p.name 
                            }))
                        };
                    }
                    return field;
                })}
                schema={userSchema}
            />

            {loading ? (
                <Loader />
            ) : (
                <Table
                    columns={columns}
                    data={consultation}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    rowsPerPage={perPage}
                    totalItems={totalItems}
                    fetch={(page) => fetchPage(page)}
                    onDelete={handleDelete}
                    actions={true}
                    onEdit={handleEdit}
                />
            )}
        </>
    );
};

export default ConsultationSpecific;
