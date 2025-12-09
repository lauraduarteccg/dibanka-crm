import { useContext, useEffect } from "react";
import { useCan } from "@hooks/useCan";
import { useSpecialCases } from "@modules/specialCases/hooks/useSpecialCases";

import Table from "@components/tables/Table";
import ButtonAdd from "@components/ui/ButtonAdd";
import FormSpecialCasesDrawer from "@modules/specialCases/components/FormSpecialCasesDrawer";
import Loader from "@components/ui/Loader";
import Search from "@components/forms/Search";

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
    handleDelete,
    handleEdit,
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
  } = useSpecialCases();
  const { can, canAny } = useCan();

  // Cuando se abre el modal, asigna el user actual como predeterminado
  useEffect(() => {
    if (isOpenADD && user) {
      setFormData(prev => ({
        ...prev,
        user_id: user.id
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
        <Search id={idSearchSpecialCase} onSearch={handleSearch} placeholder="Buscar caso especial..." />
      </div>

      <h1 className="text-2xl font-bold text-center mb-4 text-purple-mid">
        Lista de casos especiales
      </h1>
      <FormSpecialCasesDrawer
        isOpen={isOpenADD}
        setIsOpen={handleCloseModal}
        user={user}
        payroll={payroll}
        selectedPayroll={selectedPayroll}
        setSelectedPayroll={setSelectedPayroll}
        selectedContact={selectedContact}
        setSelectedContact={setSelectedContact}
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
        fetchContactsSearch={fetchContactsSearch}
        handleSearchContact={handleSearchContact}
        fetchPageContact={fetchPageContact}
      />

      {loading ? (
        <Loader />
      ) : (
        <Table
          columns={columns}
          data={specialCases}
          currentPage={currentPage}
          totalPages={totalPages}
          rowsPerPage={perPage}
          totalItems={totalItems}
          fetchPage ={(page) => fetchPage(page)}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      )}
    </>
  );
};

export default SpecialCases;
