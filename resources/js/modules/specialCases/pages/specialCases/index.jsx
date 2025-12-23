import { useContext, useEffect } from "react";
import { useCan } from "@hooks/useCan";
import { useSpecialCases } from "@modules/specialCases/hooks/useSpecialCases";
import TableSkeleton from "@components/tables/TableSkeleton";

import Table from "@components/tables/Table";
import ButtonAdd from "@components/ui/ButtonAdd";
import FormSpecialCases from "@components/modals/FormSpecialCases";
import SearchContact from "@components/modals/SearchContact";
import FilterSearch from "@components/ui/FilterSearch";
import HistoryChanges from "@components/ui/HistoryChanges";

import { AuthContext } from "@context/AuthContext";

const SpecialCases = ({ idAddSpecialCase, idSearchSpecialCase }) => {
    const { user } = useContext(AuthContext);
    const {
        payroll,
        fetchPage,
        handleSearch,
        specialCases,
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
        handleCloseModal,
        selectedPayroll,
        setSelectedPayroll,
        selectedContact,
        setSelectedContact,
        openSearchContact,
        setOpenSearchContact,
        clearFieldError,
        onSelectContact,
        contactSearch,
        currentPageContact,
        totalPagesContact,
        perPageContact,
        totalItemsContact,
        loadingContact,
        fetchContactsSearch,
        handleSearchContact,
        fetchPageContact,
        searchTermContact,
        searchTerm,
        filterColumn,
        handleClearSearch,
        //historial
        openHistory,
        setOpenHistory,
        history,
        currentPageH,
        totalPagesH,
        perPageH,
        totalItemsH,
        loadingHistory,
        fetchHistoryChanges,
        handleOpenHistory,
        fetchHistoryPage,
    } = useSpecialCases();
    const { can, canAny } = useCan();

    const filterOptions = [
        { value: "id", label: "ID" },
        { value: "user", label: "Agente" },
        { value: "campaign", label: "Campaña" },
        { value: "payroll", label: "Pagaduría" },
        { value: "identification_number", label: "Identificación" },
        { value: "management_messi", label: "Gestión Messi" },
        { value: "contact", label: "Cliente" },
        { value: "id_call", label: "ID llamada" },
        { value: "id_messi", label: "ID Messi" },
        { value: "observations", label: "Observaciones" },
    ];

    // Cuando se abre el modal, asigna el user actual como predeterminado
    useEffect(() => {
        if (isOpenADD && user) {
            setFormData((prev) => ({
                ...prev,
                user_id: user.id,
            }));
        }
    }, [isOpenADD, user, setFormData]);

    const columns = [
        { header: "ID", key: "id" },
        { header: "Agente", key: "user.name" },
        { header: "Campaña", key: "contact.campaign.name" },
        { header: "Pagaduria", key: "contact.payroll" },
        { header: "Identificación", key: "contact.identification_number" },
        { header: "Gestión Messi", key: "management_messi" },
        { header: "Cliente", key: "contact.name" },
        { header: "ID llamada", key: "id_call" },
        { header: "ID Messi", key: "id_messi" },
        { header: "Fecha creación", key: "created_at" },
        { header: "Observaciones", key: "observations" },
    ];

    return (
        <>
            {can("special_cases.create") && (
                <ButtonAdd
                    id={idAddSpecialCase}
                    onClickButtonAdd={() => setIsOpenADD(true)}
                    text="Agregar caso especial"
                />
            )}
            <div className="flex justify-end px-12 -mt-10 ">
                <FilterSearch
                    onFilter={handleSearch}
                    filterOptions={filterOptions}
                    initialSearchValue={searchTerm}
                    initialSelectedFilter={filterColumn}
                    placeholder="Buscar caso especial..."
                />
                {searchTerm && (
                    <button
                        onClick={handleClearSearch}
                        className="bg-red-500 text-white h-[50%] px-4 py-2 rounded hover:bg-red-600 transition-colors"
                    >
                        Limpiar filtro
                    </button>
                )}
            </div>

            <h1 className="text-2xl font-bold text-center mb-4 text-purple-mid">
                Lista de casos especiales
            </h1>
            <FormSpecialCases
                isOpen={isOpenADD}
                setIsOpen={handleCloseModal}
                selectedContact={selectedContact}
                formData={formData}
                setFormData={setFormData}
                validationErrors={validationErrors}
                handleSubmit={handleSubmit}
                clearFieldError={clearFieldError}
                openSearchContact={openSearchContact}
                setOpenSearchContact={setOpenSearchContact}
                onSelectContact={onSelectContact}
                contactSearch={contactSearch}
                currentPageContact={currentPageContact}
                totalPagesContact={totalPagesContact}
                perPageContact={perPageContact}
                totalItemsContact={totalItemsContact}
                loadingContact={loadingContact}
                handleSearchContact={handleSearchContact}
                fetchPageContact={fetchPageContact}
                searchTermContact={searchTermContact}
            />

            <SearchContact
                isOpen={openSearchContact}
                setIsOpen={setOpenSearchContact}
                onSelectContact={onSelectContact}
                contactSearch={contactSearch}
                currentPageContact={currentPageContact}
                totalPagesContact={totalPagesContact}
                perPageContact={perPageContact}
                totalItemsContact={totalItemsContact}
                loadingContact={loadingContact}
                handleSearchContact={handleSearchContact}
                fetchPageContact={fetchPageContact}
                searchTermContact={searchTermContact}
            />

            {loading ? (
                <TableSkeleton rows={11} />
            ) : (
                <Table
                    columns={columns}
                    data={specialCases}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    rowsPerPage={perPage}
                    totalItems={totalItems}
                    fetchPage={(page) => fetchPage(page)}
                />
            )}
            <HistoryChanges
                isOpen={openHistory}
                onClose={() => setOpenHistory(false)}
                contact={selectedContact}
                history={history}
                loading={loadingHistory}
                currentPage={currentPageH}
                totalPages={totalPagesH}
                totalItems={totalItemsH}
                perPage={perPageH}
                onPageChange={fetchHistoryPage}
            />
        </>
    );
};

export default SpecialCases;
