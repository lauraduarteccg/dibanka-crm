import Table from "@components/tables/Table";
import ButtonAdd from "@components/ui/ButtonAdd";
import Loader from "@components/ui/Loader";

import FormAdd from "@components/forms/FormAdd";
import Search from "@components/forms/Search";

import { useMonitoring } from "./useMonitoring.js";
import * as yup from "yup";


const fields = [{ name: "name", label: "Seguimiento", type: "text" }];

const userSchema = yup.object().shape({
    name: yup
        .string()
        .required("El seguimiento es obligatorio")
        .min(6, "Mínimo 6 caracteres"),
});

const Monitoring = () => {
    const {
        fetchPage,
        handleSearch,
        monitoring,
        loading,
        isOpenADD,
        setIsOpenADD,
        formData,
        setFormData,
        validationErrors,
        handleSubmit,
        currentPage,
        totalPages,
        perPage,
        totalItems,
        handleDelete,
        handleEdit,
    } = useMonitoring();

    const columns = [
        { header: "ID", key: "id" },
        { header: "Seguimiento", key: "name" },
    ];
    const activeMonitoring = monitoring.filter((u) => u.is_active === 1).length;
    const inactiveMmonitoring = totalItems - activeMonitoring;

    return (
        <>
            <div className="flex justify-center gap-6 mb-4">
                <div className="bg-white shadow-md rounded-lg px-6 py-4 w-64">
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-black font-bold">
                            Gestiones Totales
                        </p>
                        <p className="text-2xl font-bold text-primary-dark">
                            {totalItems}
                        </p>
                    </div>
                </div>
                <div className="bg-white shadow-md rounded-lg px-6 py-4 w-64">
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-black font-bold">
                            Seguimientos Activos
                        </p>
                        <p className="text-2xl font-bold text-primary-dark">
                            {activeMonitoring}
                        </p>
                    </div>
                </div>
                <div className="bg-white shadow-md rounded-lg px-6 py-4 w-64">
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-black  font-bold">
                            Seguimientos Inactivos
                        </p>
                        <p className="text-2xl font-bold text-primary-dark">
                            {inactiveMmonitoring}
                        </p>
                    </div>
                </div>
            </div>
            <ButtonAdd
                onClickButtonAdd={() => setIsOpenADD(true)}
                text="Agregar seguimientos"
            />

            <div className="flex justify-end px-12 -mt-10 ">
                <Search
                    onSearch={handleSearch}
                    placeholder="Buscar tipo de seguimiento..."
                />
            </div>

            <FormAdd
                isOpen={isOpenADD}
                setIsOpen={setIsOpenADD}
                title="seguimiento"
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
                    data={monitoring}
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

export default Monitoring;
