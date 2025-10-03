import Table from "@components/tables/Table";
import ButtonAdd from "@components/ui/ButtonAdd";
import FormAdd from"@components/forms/FormAdd";
import Loader from "@components/ui/Loader";
import { useConsultSpecifics } from "./useConsultSpecifics.js";
import * as yup from "yup";
import Search from "@components/forms/Search";

const fields = [
    { name: "consultation_id", label: "Motivo", type: "select", options: [] },
    { name: "name", label: "Motivo especifico", type: "text" },
];
const userSchema = yup.object().shape({
    name: yup.string().required("El motivo especifico es obligatorio"),
    consultation_id: yup
        .number()
        .required("El motivo general es obligatorio")
        .typeError("Debes seleccionar un motivo general"),
});
const columns = [
    { header: "ID", key: "id" },
    { header: "Motivo", key: "consultation" },
    { header: "Motivo especifico", key: "name" },
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
    
    const activeConsultationSpecific = consultationNoSpecific.filter(
        (u) => u.is_active === 1
    ).length;
    const inactiveConsultationSpecific =
        totalItems - activeConsultationSpecific;
    return (
        <>
            <div className="flex justify-center gap-6 mb-4">
                <div className="bg-white shadow-md rounded-lg px-6 py-4 w-64">
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-black font-bold">
                            Consultas Totales
                        </p>
                        <p className="text-2xl font-bold text-primary-dark">
                            {totalItems}
                        </p>
                    </div>
                </div>
                <div className="bg-white shadow-md rounded-lg px-6 py-4 w-64">
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-black font-bold">
                            Consultas Activas
                        </p>
                        <p className="text-2xl font-bold text-primary-dark">
                            {activeConsultationSpecific}
                        </p>
                    </div>
                </div>
                <div className="bg-white shadow-md rounded-lg px-6 py-4 w-64">
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-black  font-bold">
                            Consultas Inactivas
                        </p>
                        <p className="text-2xl font-bold text-primary-dark">
                            {inactiveConsultationSpecific}
                        </p>
                    </div>
                </div>
            </div>
            <ButtonAdd
                onClickButtonAdd={handleOpenForm}
                text="Agregar Consulta"
            />

            <div className="flex justify-end px-12 -mt-10 ">
                <Search
                    onSearch={handleSearch}
                    placeholder="Buscar consulta..."
                />
            </div>
        
            <FormAdd
                isOpen={isOpenADD}
                setIsOpen={handleCloseModal}
                title="consultas especificas"
                formData={formData}
                setFormData={setFormData}
                handleSubmit={handleSubmit}
                loading={loading}
                validationErrors={validationErrors}
                fields={fields.map((field) => {
                    if (field.name === "consultation_id") {
                        return {
                            ...field,
                            options: consultationNoSpecific.map((p) => ({
                                value: p.id,
                                label: p.name,
                            })),
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
