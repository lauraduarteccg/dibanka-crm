import { usePayrolls } from "./usePayrolls";
import Table from "@components/tables/Table";
import ButtonAdd from "@components/ui/ButtonAdd";
import FormAdd from"@components/forms/FormAdd";
import Loader from "@components/ui/Loader";
import * as yup from "yup";
import Search from "@components/forms/Search";

const fields = [
    { name: "name", label: "Nombre", type: "text" },
    { name: "description", label: "Descripción", type: "longtext" },
    {
        name: "img_payroll",
        label: "Imagen de pagaduría",
        type: "file",
        withLabel: false,
    },
];

const payrollSchema = yup.object().shape({
    name: yup.string().required("El nombre es obligatorio"),
    description: yup.string().required("La descripción es obligatoria"),
    img_payroll: yup
        .mixed()
        .test(
            "required",
            "La imagen de la pagaduría es obligatoria",
            (value) => {
                // ✅ Acepta cuando viene como URL string (imagen guardada en BD)
                if (typeof value === "string" && value.trim() !== "")
                    return true;

                // ✅ Acepta cuando es un File nuevo
                if (value instanceof File) return true;

                return false;
            }
        ),
});

const Payrolls = () => {
    const {
        fetchPage,
        handleSearch,
        payrolls,
        loading,
        isOpenADD,
        setIsOpenADD,
        formData,
        setFormData,
        validationErrors,
        handleSubmit,
        currentPage,
        totalPages,
        handleDelete,
        handleEdit,
        totalItems,
        handleCloseModal,
        perPage,
    } = usePayrolls();

    const activePayroll = payrolls.filter((u) => u.is_active === 1).length;
    const inactivePayroll = totalItems - activePayroll;
    return (
        <>
            <div className="flex justify-center gap-6 mb-4">
                <div className="bg-white shadow-md rounded-lg px-6 py-4 w-64">
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-black font-bold">
                            Pagadurías Totales
                        </p>
                        <p className="text-2xl font-bold text-primary-dark">
                            {totalItems}
                        </p>
                    </div>
                </div>
                <div className="bg-white shadow-md rounded-lg px-6 py-4 w-64">
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-black font-bold">
                            Pagadurías Activas
                        </p>
                        <p className="text-2xl font-bold text-primary-dark">
                            {activePayroll}
                        </p>
                    </div>
                </div>
                <div className="bg-white shadow-md rounded-lg px-6 py-4 w-64">
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-black  font-bold">
                            Pagadurías Inactivas
                        </p>
                        <p className="text-2xl font-bold text-primary-dark">
                            {inactivePayroll}
                        </p>
                    </div>
                </div>
            </div>
            <ButtonAdd
                onClickButtonAdd={() => setIsOpenADD(true)}
                text="Agregar pagaduría"
            />

            <div className="flex justify-end px-12 -mt-10 ">
                <Search
                    onSearch={handleSearch}
                    placeholder="Buscar pagaduria..."
                />
            </div>

            <FormAdd
                isOpen={isOpenADD}
                setIsOpen={handleCloseModal}
                title="Pagaduría"
                formData={formData}
                setFormData={setFormData}
                handleSubmit={handleSubmit}
                loading={loading}
                validationErrors={validationErrors}
                fields={fields}
                schema={payrollSchema}
            />

            {loading ? (
                <Loader />
            ) : (
                <Table
                    columns={[
                        { header: "ID", key: "id" },
                        { header: "Pagaduría", key: "name" },
                        { header: "Imagen", key: "img_payroll" },
                    ]}
                    data={payrolls}
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

export default Payrolls;
