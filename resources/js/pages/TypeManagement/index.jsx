import React from "react";
import Table from "@components/Table";
import ButtonAdd from "@components/ButtonAdd";
import FormAdd from "@components/FormAddTest";
import Loader from "@components/Loader";
import { useTypeManagement } from "./useTypeManagement.js";
import * as yup from "yup";
import Search from "@components/Search";

const fields = [
  { name: "payroll_id", label: "Pagaduría", type: "select", options: [] },
  { name: "name", label: "Tipo de gestión", type: "text" },
];

const userSchema = yup.object().shape({
  payroll_id: yup
    .number()
    .required("La pagaduría es obligatoria")
    .typeError("Debes seleccionar una pagaduría"),
  name: yup.string().required("El nombre es obligatorio").min(6, "Mínimo 6 caracteres"),
});


const TypeManagement = () => {
  const {
    fetchPage,
    payroll,
    handleSearch,
    typeManagement,
    loading,
    isOpenADD,
    setIsOpenADD,
    formData,
    setFormData,
    validationErrors,
    handleSubmit,
    currentPage,
    totalPages,
    handleDelete,
    handleEdit,
  } = useTypeManagement();

const columns = [
  { header: "ID", key: "id" },
  { header: "Pagaduría", key: "payrolls.name" },
  { header: "Tipo de gestión", key: "name" },
];

  return (
    <>
      <ButtonAdd onClickButtonAdd={() => setIsOpenADD(true)} text="Agregar tipo de gestión" />

        <div className="flex justify-end px-36 -mt-10 ">
          <Search onSearch={handleSearch} placeholder="Buscar tipo de gestion..." />
        </div>

      <h1 className="text-2xl font-bold text-center mb-4 text-purple-mid">
        Lista de Tipos de gestiones
      </h1>

      <FormAdd
        isOpen={isOpenADD}
        setIsOpen={setIsOpenADD}
        title="Tipos de gestiónes"
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
          data={typeManagement}
          currentPage={currentPage}
          fetch={(page) => fetchPage(page)}
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
