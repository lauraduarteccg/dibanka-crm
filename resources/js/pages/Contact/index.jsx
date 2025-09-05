import React, { useEffect } from "react";
import Table from "@components/Table";
import ButtonAdd from "@components/ButtonAdd";
import FormAdd from "@components/FormAddTest";
import Loader from "@components/Loader";
import { useContact } from "./useContact.js";
import * as yup from "yup";
import Search from "@components/Search"



const fields = [
    { name: "campaign",                 label: "Campaña",                   type: "select", options: [{value: "Aliados", label: "Aliados"},{value: "Afiliados", label: "Afiliados"}]},
    { name: "payroll_id",               label: "Pagaduría",                 type: "select", options: [] },
    { name: "name",                     label: "Nombre",                    type: "text",   options: [{value: "NIT", label: "NIT"},{value: "CEDULA DE CIUDADANIA", label: "CEDULA DE CIUDADANIA"}]},
    { name: "email",                    label: "Correo",                    type: "text",               },
    { name: "phone",                    label: "Teléfono",                  type: "text",               },
    { name: "update_phone",             label: "Celular actualizado",       type: "text",               },
    { name: "identification_type",      label: "Tipo de identificación",    type: "text",               },
    { name: "identification_number",    label: "Numero de identificación",  type: "text",               },
];
const userSchema = yup.object().shape({
    campaign:               yup.string().required("La campaña es obligatorio"),
    payroll_id:             yup.string().required("La pagaduria es obligatorio"),
    name:                   yup.string().required("El nombre es obligatorio").min(6, "Mínimo 6 caracteres"),
    phone:                  yup.string().required("El teléfono es obligatorio"),
    email:                  yup.string().required("El correo electronico es obligatorio"),
    update_phone:           yup.string().required("El celular actualizado es obligatorio"),
    identification_type:    yup.string().required("El tipo es obligatorio"),
    identification_number:  yup.string().required("El número de identificación es obligatorio"),
});
const columns=[ 
    { header: "ID",                         key: "id"                       },
    { header: "Campaña",                    key: "campaign"                 },
    { header: "Pagaduria",                  key: "payroll_name"             },
    { header: "Nombre",                     key: "name"                     },
    { header: "Correo",                     key: "email"                    },
    { header: "Telefono",                   key: "phone"                    },
    { header: "Celular actualizado",        key: "update_phone"             },
    { header: "Tipo de identificación",     key: "identification_type"      },
    { header: "Número de identificación",   key: "identification_number"    },
];   

const Contact = () => {
    const {
        fetchPayroll,
        payroll,
        contact,
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
    } = useContact();


    // Efecto para cambiar automáticamente el tipo de identificación
    useEffect(() => {
        if (formData.campaign === "Aliados") {
            setFormData(prev => ({
                ...prev,
                identification_type: "NIT"
            }));
        } else if (formData.campaign === "Afiliados") {
            setFormData(prev => ({
                ...prev,
                identification_type: "CEDULA DE CIUDADANIA"
            }));
        }
    }, [formData.campaign, setFormData]);

    return (
        <>
            <ButtonAdd
                onClickButtonAdd={() => setIsOpenADD(true)}
                text="Agregar contacto"
            />
            <h1 className="text-2xl font-bold text-center mb-4 text-purple-mid">
                Lista de Contactos
            </h1>

            <FormAdd
                isOpen={isOpenADD}
                setIsOpen={setIsOpenADD}
                title="Contactos"
                formData={formData}
                setFormData={setFormData}
                handleSubmit={handleSubmit}
                loading={loading}
                validationErrors={validationErrors}
                fields={fields.map(field => {
                    if (field.name === "payroll_id") {
                        return {
                            ...field,
                            options: payroll.map(p => ({ 
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
                    data={contact}
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

export default Contact;
