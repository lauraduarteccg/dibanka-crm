import Table from "@components/tables/Table";
import ButtonAdd from "@components/ui/ButtonAdd";
import FormAdd from"@components/forms/FormAdd";
import Loader from "@components/ui/Loader";
import { useConsults } from "./useConsults.js";
import * as yup from "yup";
import Search from "@components/forms/Search";
const fields = [
    { name: "payroll_id", label: "Pagaduría", type: "select", options: [] },
    { name: "name", label: "Motivo de consulta", type: "text" },
];

const userSchema = yup.object().shape({
    name: yup.string().required("El motivo de consulta es obligatorio"),
    payroll_id: yup.string().required("La pagaduría es obligatoria"),
});

const columns = [
    { header: "ID", key: "id" },
    { header: "Pagaduría", key: "payrolls.name" },
    { header: "Motivo de consulta", key: "name" },
];

const Consults = () => {
    const {
        totalItems,
        perPage,
        payroll,
        fetchPage,
        handleSearch,
        consultations,
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
        handleCloseModal,
    } = useConsults();
    const activeConsults = consultations.filter(
        (u) => u.is_active === 1
    ).length;
    const inactiveConsults = totalItems - activeConsults;
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
                            {activeConsults}
                        </p>
                    </div>
                </div>
                <div className="bg-white shadow-md rounded-lg px-6 py-4 w-64">
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-black  font-bold">
                            Consultas Inactivas
                        </p>
                        <p className="text-2xl font-bold text-primary-dark">
                            {inactiveConsults}
                        </p>
                    </div>
                </div>
            </div>
            <ButtonAdd
                onClickButtonAdd={() => setIsOpenADD(true)}
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
                title="Consultas"
                formData={formData}
                setFormData={setFormData}
                handleSubmit={handleSubmit}
                loading={loading}
                validationErrors={validationErrors}
                fields={fields.map((field) => {
                    if (field.name === "payroll_id") {
                        return {
                            ...field,
                            options: payroll.map((p) => ({
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
                    data={consultations}
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

export default Consults;
