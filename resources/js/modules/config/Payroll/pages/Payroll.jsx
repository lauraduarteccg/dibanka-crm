import { usePayrolls } from "@modules/config/payroll/hooks/usePayrolls";
import Table from "@components/tables/Table";
import ButtonAdd from "@components/ui/ButtonAdd";
import FormAdd from "@components/forms/FormAdd";
import TableSkeleton from "@components/tables/TableSkeleton";
import Search from "@components/forms/Search";
import StatCard from "@components/ui/StatCard";
import * as yup from "yup";

/* ===========================================================
 *  CAMPOS DEL FORMULARIO
 * =========================================================== */
const fields = [
    { name: "name", label: "Nombre", type: "text" },
    { name: "description", label: "Descripción", type: "longtext" },
    { name: "img_payroll", label: "Imagen de pagaduría", type: "file", withLabel: false },
    { type: "additional", text: "La siguiente información es opcional y se coloca en el popup de información." },
    { name: "i_title", label: "Título de la información", type: "text" },
    { name: "i_description", label: "Descripción de la información", type: "longtext" },
    { name: "i_phone", label: "Teléfono de la información", type: "text" },
    { name: "i_email", label: "Email de la información", title: "INFORMA", type: "text" },
];

/* ===========================================================
 *  VALIDACIÓN CON YUP
 * =========================================================== */
const payrollSchema = yup.object().shape({
    name: yup.string().required("El nombre es obligatorio"),
    description: yup.string().required("La descripción es obligatoria"),
    img_payroll: yup
        .mixed()
        .test("required", "La imagen de la pagaduría es obligatoria", (value) => {
            if (typeof value === "string" && value.trim() !== "") return true;
            if (value instanceof File) return true;
            return false;
        }),
    i_title: yup.string(),
    i_description: yup.string(),
    i_phone: yup.string(),
    i_email: yup.string(),
});


/* ===========================================================
 *  COMPONENTE PRINCIPAL
 * =========================================================== */
const Payroll = () => {
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

    const activePayroll = payrolls.filter((p) => p.is_active === 1).length;
    const inactivePayroll = totalItems - activePayroll;
    const statsCards = [
        {
            title: "Pagadurías Totales",
            value: totalItems,
        },
        {
            title: "Pagadurías Activas",
            value: activePayroll,
        },
        {
            title: "Pagadurías Inactivas",
            value: inactivePayroll,
        }
    ]
    return (
        <>
            {/* Estadísticas */}
            <div className="flex justify-center gap-6 mb-4">
                {statsCards.map((stat, index) => (
                    <StatCard key={index} stat={stat} loading={loading} />
                ))}
            </div>


            {/* Botón + */}
            <ButtonAdd
                onClickButtonAdd={() => {
                    setFormData({ id: null, name: "", description: "", img_payroll: null });
                    setIsOpenADD(true);
                }}
                text="Agregar pagaduría"
            />

            {/* Buscador */}
            <div className="flex justify-end px-12 -mt-10">
                <Search onSearch={handleSearch} placeholder="Buscar pagaduría..." />
            </div>

            {/* Modal Formulario */}
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

            {/* Tabla */}
            {loading ? (
                <TableSkeleton rows={4} />
            ) : (
                <Table
                    columns={[
                        { header: "ID", key: "id" },
                        { header: "Pagaduría", key: "name" },
                        { header: "Descripción", key: "description" },
                        { header: "Imagen", key: "img_payroll" },
                    ]}
                    data={payrolls}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    rowsPerPage={perPage}
                    totalItems={totalItems}
                    fetchPage={(page) => fetchPage(page)}
                    onDelete={handleDelete}
                    actions
                    onEdit={handleEdit}
                />
            )}
        </>
    );
};

export default Payroll;
