import React from "react";
import Table from "@components/Table";
import ButtonAdd from "@components/ButtonAdd";
import FormAdd from "@components/FormAddTest";
import Loader from "@components/Loader";
import { useMonitoring } from "./useMonitoring.js";
import * as yup from "yup";
import Search from "@components/Search";

const fields = [
  { name: "name", label: "Seguimiento", type: "text" },
];

const userSchema = yup.object().shape({
  name: yup.string().required("El seguimiento es obligatorio").min(6, "Mínimo 6 caracteres"),
});


const TypeManagement = () => {
  const {
    fetchPage,
    handleSearch,
    monitoring,
    loading,
    isOpenADD,
    setIsOpenADD,
    formData,
    setFormData,
    validationErrors,
    handleSubmit,
    currentPage,
    totalPages,
    perPage,
    totalItems,
    handleDelete,
    handleEdit,
  } = useMonitoring();

const columns = [
  { header: "ID", key: "id" },
  { header: "Seguimiento", key: "name" },
];

  return (
    <>
      <ButtonAdd onClickButtonAdd={() => setIsOpenADD(true)} text="Agregar seguimientos" />

        <div className="flex justify-end px-12 -mt-10 ">
          <Search onSearch={handleSearch} placeholder="Buscar tipo de seguimiento..." />
        </div>

      <h1 className="text-2xl font-bold text-center mb-4 text-purple-mid">
        Lista de tipos de seguimientos
      </h1>

      <FormAdd
        isOpen={isOpenADD}
        setIsOpen={setIsOpenADD}
        title="seguimiento"
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
          columns={columns}
          data={monitoring}
          currentPage={currentPage}
          totalPages={totalPages}
          rowsPerPage={perPage}
          totalItems={totalItems}
          fetch={(page) => fetchPage(page)}
          onDelete={handleDelete}
          actions={true}
          onEdit={handleEdit}
        />
      )}
    </>
  );
};

export default TypeManagement;
