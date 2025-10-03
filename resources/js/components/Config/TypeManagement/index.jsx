import React from "react";
import Table from "@components/tables/Table";
import ButtonAdd from "@components/ui/ButtonAdd";
import FormAdd from"@components/forms/FormAdd";
import Loader from "@components/ui/Loader";
import { useTypeManagement } from "./useTypeManagement.js";
import * as yup from "yup";
import Search from "@components/forms/Search";

const fields = [
    { name: "payroll_id", label: "Pagaduría", type: "select", options: [] },
    { name: "name", label: "Tipo de gestión", type: "text" },
];

const userSchema = yup.object().shape({
    payroll_id: yup
        .number()
        .required("La pagaduría es obligatoria")
        .typeError("Debes seleccionar una pagaduría"),
    name: yup
        .string()
        .required("El nombre es obligatorio")
        .min(6, "Mínimo 6 caracteres"),
});

const TypeManagement = () => {
    const {
        fetchPage,
        payroll,
        handleSearch,
        typeManagement,
        loading,
        isOpenADD,
        setIsOpenADD,
        formData,
        setFormData,
        validationErrors,
        handleSubmit,
        totalItems,
        perPage,
        currentPage,
        totalPages,
        handleDelete,
        handleEdit,
    } = useTypeManagement();

    const columns = [
        { header: "ID", key: "id" },
        { header: "Pagaduría", key: "payrolls.name" },
        { header: "Tipo de gestión", key: "name" },
    ];
    const activetypeManagement = typeManagement.filter(
        (u) => u.is_active === 1
    ).length;
    const inactivetypeManagement = totalItems - activetypeManagement;
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
                            Gestiones Activas
                        </p>
                        <p className="text-2xl font-bold text-primary-dark">
                            {activetypeManagement}
                        </p>
                    </div>
                </div>
                <div className="bg-white shadow-md rounded-lg px-6 py-4 w-64">
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-black  font-bold">
                            Gestiones Inactivas
                        </p>
                        <p className="text-2xl font-bold text-primary-dark">
                            {inactivetypeManagement}
                        </p>
                    </div>
                </div>
            </div>
            <ButtonAdd
                onClickButtonAdd={() => setIsOpenADD(true)}
                text="Agregar tipo de gestión"
            />

            <div className="flex justify-end px-12 -mt-10 ">
                <Search
                    onSearch={handleSearch}
                    placeholder="Buscar tipo de gestion..."
                />
            </div>

            <FormAdd
                isOpen={isOpenADD}
                setIsOpen={setIsOpenADD}
                title="Tipos de gestiónes"
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
                    data={typeManagement}
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

export default TypeManagement;
