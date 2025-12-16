import { useEffect, useMemo, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCan } from "@hooks/useCan";
import Table from "@components/tables/Table";
import ButtonAdd from "@components/ui/ButtonAdd";
import FormAdd from "@components/forms/FormAdd";
import FilterSearch from "@components/ui/FilterSearch";
import { useContact } from "@modules/contact/hooks/useContact";
import { fields, userSchema, columns, filterOptions } from "./constants";
import TableSkeleton from "@components/tables/TableSkeleton";
const Contact = ({
    addContact,
    searchContact,
    viewManagementContact,
    editContact,
    activeOrDesactiveContact,
}) => {
    const { can } = useCan();
    const navigate = useNavigate();
    const location = useLocation(); // Hook para leer parámetros de la URL
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

    // Efecto para leer parámetros de la URL y filtrar automáticamente
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const searchParam = params.get("search");
        const columnParam = params.get("column");

        if (searchParam) {
            handleSearch(searchParam, columnParam || "");
        }
    }, [location.search, handleSearch]);

    // Efecto para cambiar automáticamente el tipo de identificación
    useEffect(() => {
        if (Number(formData.campaign_id) === 1) {
            // Aliados
            setFormData((prev) => ({
                ...prev,
                identification_type: "NIT",
            }));
        } else if (Number(formData.campaign_id) === 2) {
            // Afiliados
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

    const handleNavigateManagement = useCallback(
        (row) => {
            const campaignName =
                row.campaign?.name ||
                (row.campaign_id === 1 ? "Aliados" : "Afiliados");
            navigate(
                `/gestiones?search=${encodeURIComponent(
                    row.identification_number
                )}&campaign=${campaignName}`
            );
        },
        [navigate]
    );

    const handleFilterSearch = (searchValue, filterColumn) => {
        let column = filterColumn;

        // Normalizar filtros para backend
        if (filterColumn === "payroll.name") column = "payroll";
        if (filterColumn === "campaign.name") column = "campaign";

        handleSearch(searchValue, column);
    };


    const handleClearSearch = () => {
        handleSearch("", "");
        navigate("/contactos");
    };

    return (
        <>
            {can("contact.create") && (
                <ButtonAdd
                    id={addContact}
                    onClickButtonAdd={() => setIsOpenADD(true)}
                    text="Agregar contacto"
                />
            )}

            <div className="flex justify-end px-12 -mt-10 gap-2">
                <FilterSearch
                    id={searchContact}
                    onFilter={handleFilterSearch}
                    placeholder="Buscar contacto..."
                    filterOptions={filterOptions}
                    initialSearchValue={new URLSearchParams(location.search).get("search") || ""}
                    initialSelectedFilter={new URLSearchParams(location.search).get("column") || ""}
                />
                {(new URLSearchParams(location.search).get("search") || "") && (
                    <button
                        onClick={handleClearSearch}
                        className="bg-red-500 text-white h-[50%] px-4 py-2 rounded hover:bg-red-600 transition-colors"
                    >
                        Limpiar filtro
                    </button>
                )}
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
            />
            {loading ? (
                <TableSkeleton row="9" />
            ) : (
                <Table
                    columns={columns}
                    data={contact}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    rowsPerPage={perPage}
                    totalItems={totalItems}
                    fetchPage={(page) => fetchPage(page)}
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