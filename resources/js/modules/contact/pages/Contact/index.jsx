import { useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useCan } from "@hooks/useCan";
import Table from "@components/tables/Table";
import ButtonAdd from "@components/ui/ButtonAdd";
import Loader from "@components/ui/Loader";
import FormAdd from "@components/forms/FormAdd";
import Search from "@components/forms/Search";
import { useContact } from "@modules/contact/hooks/useContact";
import { fields, userSchema, columns } from "./constants";

const Contact = ({addContact, searchContact, viewManagementContact, editContact, activeOrDesactiveContact}) => {
    const { can } = useCan();
    const navigate = useNavigate();
    const {
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
        if (Number(formData.campaign_id) === 1) { // Aliados
            setFormData((prev) => ({
                ...prev,
                identification_type: "NIT",
            }));
        } else if (Number(formData.campaign_id) === 2) { // Afiliados
            setFormData((prev) => ({
                ...prev,
                identification_type: "CEDULA DE CIUDADANIA",
            }));
        }
    }, [formData.campaign_id, setFormData]);

    const formFields = useMemo(() => {
        return fields.map((field) => {
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
        });
    }, [payroll]);

    const handleNavigateManagement = useCallback((row) => {
        navigate(`/gestiones?search=${encodeURIComponent(row.identification_number)}`);
    }, [navigate]);

    return (
        <>
            {can("contact.create") && (
                <ButtonAdd
                    id={addContact}
                    onClickButtonAdd={() => setIsOpenADD(true)}
                    text="Agregar contacto"
                />
            )}

            <div  className="flex justify-end px-12 -mt-10 ">
                <Search
                    id={searchContact} 
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
                fields={formFields}
                schema={userSchema}

                /*  */
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
                    fetchPage ={(page) => fetchPage(page)}
                    onDelete={handleDelete}
                    actions={true}
                    onEdit={handleEdit}
                    management={true}
                    onManagement={handleNavigateManagement}
                    //IDS
                    idManagement={viewManagementContact}  
                    idEdit={editContact}
                    idOnActiveOrInactive={activeOrDesactiveContact}
                />
            )}
        </>
    );
};

export default Contact;
