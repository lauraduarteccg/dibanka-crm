import * as yup from "yup";

export const fields = [
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
        type: "select",
        options: [
            { value: "CEDULA DE CIUDADANIA", label: "CÉDULA DE CIUDADANÍA" },
            { value: "NIT", label: "NIT" },
            { value: "PASAPORTE", label: "PASAPORTE" },
            { value: "CEDULA DE EXTRANJERIA", label: "CÉDULA DE EXTRANJERÍA" },
        ],
    },
    {
        name: "identification_number",
        label: "Número de identificación",
        type: "text",
    },
];

export const userSchema = yup.object().shape({
    campaign: yup.string().required("La campaña es obligatorio"),
    payroll_id: yup.string().required("La pagaduría es obligatorio"),
    name: yup
        .string()
        .required("El nombre es obligatorio"),
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

export const columns = [
    { header: "ID", key: "id" },
    { header: "Campaña", key: "campaign" },
    { header: "Pagaduría", key: "payroll.name" },
    { header: "Nombre", key: "name" },
    { header: "Correo", key: "email" },
    { header: "Teléfono", key: "phone" },
    { header: "Celular actualizado", key: "update_phone" },
    //{ header: "Tipo de identificación", key: "identification_type" },
    { header: "Número de identificación", key: "identification_number" },
];
