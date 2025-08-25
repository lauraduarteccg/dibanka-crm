import Table from "@components/Table";
import ButtonAdd from "@components/ButtonAdd";
import FormAdd from "@components/FormAddTest";
import Loader from "@components/Loader";
import { useTypeManagement } from "./useTypeManagement.js";
import * as yup from "yup";
import { FaRegComment } from "react-icons/fa6";
import { HiOutlineMail } from "react-icons/hi";
import React, { useState } from "react";


const fields = [
  { name: "campaign",   label: "Pagaduría",         type: "checklist", icon: FaRegComment, options: ({ campaign }) => campaign.map(c => ({ label: c.name, value: c.id })), },
  { name: "name",       label: "Tipo de gestión",   type: "text", icon: HiOutlineMail },
];

const userSchema = yup.object().shape({
    campaign:   yup.string().required("La pagaduría es obligatoria"),
    name:       yup.string().required("El nombre es obligatorio").min(6, "Mínimo 6 caracteres"),
});

const columns=[ 
    { header: "ID",                 key: "id"       },
    { header: "Pagaduria",          key: "campaign" },
    { header: "Tipo de gestión",    key: "name"     },
];   

const TypeManagement = () => {
    const {
        campaign,
        typemanagement,
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
    } = useTypeManagement();

    const [selectedCampaign, setSelectedCampaign] = useState([]);
    return (
        <>
            <ButtonAdd
                onClickButtonAdd={() => setIsOpenADD(true)}
                text="Agregar tipo de gestión"
            />
            <h1 className="text-2xl font-bold text-center mb-4 text-purple-mid">
                Lista de Tipos de gestiones
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
                fields={fields}
                schema={userSchema}
                checklist={campaign}
                selectedChecklist={selectedCampaign}
                setSelectedChecklist={setSelectedCampaign}
            />
            {console.log("Selected campaign", selectedCampaign)}


            {loading ? (
                <Loader />
            ) : (
                <Table
                    columns={columns}
                    data={typemanagement}
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

export default TypeManagement;
