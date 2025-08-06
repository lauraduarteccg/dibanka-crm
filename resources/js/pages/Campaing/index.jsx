import React from "react";
import { useCampaigns } from "./useCampaigns";
import Table from "@components/Table";
import ButtonAdd from "@components/ButtonAdd";
import FormAdd from "@components/FormAdd";
import Loader from "@components/Loader";

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
                formData={formData}
                setFormData={setFormData}
                validationErrors={validationErrors}
                loading={loading}
                handleSubmit={handleSubmit}
            />

            {loading ? (
                <Loader />
            ) : (
                <Table
                    columns={[
                        { header: "ID", key: "id" },
                        { header: "pagaduria", key: "name" },
                        { header: "tipo", key: "type" },
                        { header: "Estado", key: "is_active" },
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
