import React from "react";
import { useCampaigns } from "./useCampaigns";
import Table from "@components/Table";
import ButtonAdd from "@components/ButtonAdd";
import FormAdd from "@components/FormAddTest";
import Loader from "@components/Loader";
import * as yup from "yup";
import { GoPerson } from "react-icons/go";
import { MdOutlineCategory } from "react-icons/md";

const fields = [
    { name: "name",         label: "Nombre",    type: "text", icon: GoPerson            },
    { name: "type",         label: "Tipo",      type: "text", icon: MdOutlineCategory   },
    { name: "is_active",    label: "Activo",    type: "boolean-select"                  },
];
const userSchema = yup.object().shape({
    name:       yup.string().   required("El nombre es obligatorio").min(6, "Mínimo 6 caracteres"),
    type:       yup.string().   required("El tipo es obligatorio"),
    is_active:  yup.boolean().  required("El estado es obligatorio"),
});

const Campaigns = () => {
    const {
        campaigns,
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
        fetchCampaigns,
        handleDelete,
        handleEdit,
    } = useCampaigns();

    return (
        <>
            <ButtonAdd
                onClickButtonAdd={() => setIsOpenADD(true)}
                text="Agregar pagaduria"
            />
            <h1 className="text-2xl font-bold text-center mb-4 text-purple-mid">
                Lista de pagadurías
            </h1>

            <FormAdd
                isOpen={isOpenADD}
                setIsOpen={setIsOpenADD}
                title="Pagaduría"
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
                    columns={[
                        { header: "ID",         key: "id"   },
                        { header: "Pagaduría",  key: "name" },
                        { header: "Tipo",       key: "type" },
                    ]}
                    data={campaigns}
                    currentPage={currentPage}
                    fetch={fetchCampaigns}
                    onDelete={handleDelete}
                    totalPages={totalPages}
                    actions={true}
                    onEdit={handleEdit}
                />
            )}
        </>
    );
};

export default Campaigns;
