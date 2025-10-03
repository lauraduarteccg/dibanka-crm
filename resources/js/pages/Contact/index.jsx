import React, { useEffect } from "react";
import Table from "@components/tables/Table";
import MuiTable from "@components/tables/MuiTable";
import ButtonAdd from "@components/ui/ButtonAdd";
import Loader from "@components/ui/Loader";
import FormAdd from "@components/forms/FormAdd";
import Search from "@components/forms/Search";

import { useContact } from "./useContact.js";
import * as yup from "yup";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    CircularProgress,
    Box,
} from "@mui/material";

const fields = [
    {
        name: "campaign",
        label: "Campaña",
        type: "select",
        options: [
            { value: "Aliados", label: "Aliados" },
            { value: "Afiliados", label: "Afiliados" },
        ],
    },
    { name: "payroll_id", label: "Pagaduría", type: "select", options: [] },
    { name: "name", label: "Nombre", type: "text" },
    { name: "email", label: "Correo", type: "text" },
    { name: "phone", label: "Teléfono", type: "text" },
    { name: "update_phone", label: "Celular actualizado", type: "text" },
    {
        name: "identification_type",
        label: "Tipo de identificación",
        type: "text",
    },
    {
        name: "identification_number",
        label: "Número de identificación",
        type: "text",
    },
];

const userSchema = yup.object().shape({
    campaign: yup.string().required("La campaña es obligatorio"),
    payroll_id: yup.string().required("La pagaduría es obligatorio"),
    name: yup
        .string()
        .required("El nombre es obligatorio")
        .min(6, "Mínimo 6 caracteres"),
    phone: yup.string().required("El teléfono es obligatorio"),
    email: yup.string().required("El correo electrónico es obligatorio"),
    update_phone: yup
        .string()
        .required("El celular actualizado es obligatorio"),
    identification_type: yup.string().required("El tipo es obligatorio"),
    identification_number: yup
        .string()
        .required("El número de identificación es obligatorio"),
});

const columns = [
    { header: "ID", key: "id" },
    { header: "Campaña", key: "campaign" },
    { header: "Pagaduría", key: "payroll.name" },
    { header: "Nombre", key: "name" },
    { header: "Correo", key: "email" },
    { header: "Teléfono", key: "phone" },
    { header: "Celular actualizado", key: "update_phone" },
    { header: "Tipo de identificación", key: "identification_type" },
    { header: "Número de identificación", key: "identification_number" },
];

const columnsManagement = [
    { header: "ID", key: "id" },
    { header: "Agente", key: "user.name" },
    { header: "Pagaduría", key: "payroll.name" },
    { header: "Consulta", key: "consultation.name" },
    { header: "Nombre de cliente", key: "contact.name" },
    { header: "Identificación", key: "contact.identification_number" },
    { header: "Celular", key: "contact.phone" },
    { header: "Fecha de creación", key: "created_at" },
];

const P = ({ text1, text2 }) => (
    <p className="text-gray-600 leading-relaxed">
        <strong className="text-gray-700">{text1}</strong>
        <span className="text-gray-900 ml-1">{text2}</span>
    </p>
);

const Contact = () => {
    const {
        selectedManagement,
        setSelectedManagement,
        handleOpenManagements,
        totalItemsM,
        perPageM,
        currentPageM,
        totalPagesM,
        fetchManagement,
        management,
        selectedContact,
        setSelectedContact,
        managements,
        setManagements,
        handleSearch,
        fetchPage,
        payroll,
        contact,
        loading,
        isOpenADD,
        setIsOpenADD,
        formData,
        setFormData,
        validationErrors,
        handleSubmit,
        currentPage,
        totalPages,
        totalItems,
        perPage,
        handleDelete,
        handleEdit,
        handleCloseModal,
    } = useContact();

    // Efecto para cambiar automáticamente el tipo de identificación
    useEffect(() => {
        if (formData.campaign === "Aliados") {
            setFormData((prev) => ({
                ...prev,
                identification_type: "NIT",
            }));
        } else if (formData.campaign === "Afiliados") {
            setFormData((prev) => ({
                ...prev,
                identification_type: "CEDULA DE CIUDADANIA",
            }));
        }
    }, [formData.campaign, setFormData]);

    return (
        <>
            <ButtonAdd
                onClickButtonAdd={() => setIsOpenADD(true)}
                text="Agregar contacto"
            />

            <div className="flex justify-end px-12 -mt-10 ">
                <Search
                    onSearch={handleSearch}
                    placeholder="Buscar contacto..."
                />
            </div>

            <h1 className="text-2xl font-bold text-center mb-4 text-purple-mid">
                Lista de Contactos
            </h1>

            <FormAdd
                isOpen={isOpenADD}
                setIsOpen={handleCloseModal}
                title="Contactos"
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
                    data={contact}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    rowsPerPage={perPage}
                    totalItems={totalItems}
                    fetch={(page) => fetchPage(page)}
                    onDelete={handleDelete}
                    actions={true}
                    onEdit={handleEdit}
                    management={true}
                    onManagement={(row) => {
                  
                        setSelectedContact(row);
                        setManagements(true);
                        handleOpenManagements(contact);
                        fetchManagement(row.identification_number);
                    }}
                />
            )}

            <Dialog
                onClose={() => setManagements(false)}
                open={managements}
                maxWidth="xl"
                fullWidth
            >
                <DialogTitle>Gestiones del contacto</DialogTitle>
                <button
                    onClick={() => setManagements(false)}
                    className="absolute right-10 top-5"
                >
                    {" "}
                    X{" "}
                </button>
                <DialogContent dividers>
                    {loading ? (
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                minHeight: 200,
                            }}
                        >
                            <CircularProgress />
                        </Box>
                    ) : management.length === 0 ? (
                        <p>No hay gestiones registradas para este contacto.</p>
                    ) : (
                        <MuiTable
                            columns={columnsManagement}
                            data={management ?? []}
                            currentPage={currentPageM}
                            totalPages={totalPagesM}
                            rowsPerPage={perPageM}
                            totalItems={totalItemsM}
                            fetch={(page) =>
                                fetchManagement(
                                    selectedManagement?.identification_number,
                                    page
                                )
                            }
                            actions={false}
                            view={false}
                            edit={false}
                            onActiveOrInactive={false}
                            onRowClick={(row) => {
                            
                                setSelectedManagement(row);
                            }}
                            collapse={
                                <Box sx={{ p: 2, bgcolor: "#f9f9f9" }}>
                                    <h4 className="font-semibold text-gray-700 pb-3">
                                        {" "}
                                        Detalle de gestiones{" "}
                                    </h4>
                                    <div className="grid grid-cols-3 gap-10">
                                        <div>
                                            {console.log(management)}
                                            <div className="bg-white shadow-md rounded-lg p-5 flex flex-col gap-3">
                                                <P
                                                    text1="Agente: "
                                                    text2={
                                                        management.user
                                                            ?.name ??
                                                        "Agente sin nombre"
                                                    }
                                                />
                                                <P
                                                    text1="Campaña: "
                                                    text2={
                                                        management
                                                            .contact
                                                            ?.campaign ??
                                                        "Sin campaña"
                                                    }
                                                />
                                                <P
                                                    text1="Pagaduría: "
                                                    text2={
                                                        management
                                                            .payroll?.name ??
                                                        "Sin pagaduría"
                                                    }
                                                />
                                                <P
                                                    text1="Consulta: "
                                                    text2={
                                                        management
                                                            .consultation
                                                            ?.name ??
                                                        "Sin consulta"
                                                    }
                                                />
                                                <P
                                                    text1="Consulta especifica: "
                                                    text2={
                                                        management
                                                            .specific?.name ??
                                                        "Sin consulta especifica"
                                                    }
                                                />
                                                <P
                                                    text1="Fecha de creación: "
                                                    text2={
                                                        management.created_at ??
                                                        "Sin fecha de creación"
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="bg-white shadow-md rounded-lg p-5 flex flex-col gap-3">
                                                <P
                                                    text1="Nombre del cliente: "
                                                    text2={
                                                        management
                                                            .contact?.name ??
                                                        "Cliente sin nombre"
                                                    }
                                                />
                                                <P
                                                    text1="Teléfono: "
                                                    text2={
                                                        management
                                                            .contact?.phone ??
                                                        "Sin teléfono"
                                                    }
                                                />
                                                <P
                                                    text1="Tipo de identifiación: "
                                                    text2={
                                                        management
                                                            .contact
                                                            ?.identification_type ??
                                                        "Sin tipo de identificación"
                                                    }
                                                />
                                                <P
                                                    text1="Número de identificación: "
                                                    text2={
                                                        management
                                                            .contact
                                                            ?.identification_number ??
                                                        "Sin número de identifiación"
                                                    }
                                                />
                                                <P
                                                    text1="Celular actualizado: "
                                                    text2={
                                                        management
                                                            .contact
                                                            ?.update_phone ??
                                                        "Sin celular actualizado"
                                                    }
                                                />
                                                <P
                                                    text1="Correo: "
                                                    text2={
                                                        management
                                                            .contact?.email ??
                                                        "Usuario sin nombre"
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="bg-white shadow-md rounded-lg p-5 flex flex-col gap-3">
                                                <P
                                                    text1="Solución en primer contacto: "
                                                    text2={
                                                        management.solution
                                                            ? "Sí"
                                                            : "No" ??
                                                              "Sin solución en primer contacto"
                                                    }
                                                />
                                                <P
                                                    text1="Observaciones: "
                                                    text2={
                                                        management.comments ??
                                                        "Sin observaciones"
                                                    }
                                                />
                                                <P
                                                    text1="Fecha de solución: "
                                                    text2={
                                                        management.solution_date ??
                                                        "Sin fecha de solución"
                                                    }
                                                />
                                                <P
                                                    text1="Seguimiento: "
                                                    text2={
                                                        management
                                                            .monitoring?.name ??
                                                        "Sin seguimiento"
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </Box>
                            }
                        />
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};

export default Contact;
