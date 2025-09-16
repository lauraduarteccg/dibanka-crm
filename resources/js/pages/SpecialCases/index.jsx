import React from "react";
import { useSpecialCases } from "./useSpecialCases";
import Table from "@components/Table";
import ButtonAdd from "@components/ButtonAdd";
import FormAdd from "@components/FormAddTest";
import Loader from "@components/Loader";
import * as yup from "yup";
import { GoPerson } from "react-icons/go";
import { MdOutlineCategory } from "react-icons/md";
import Search from "@components/Search";

const fields = [
  { name: "name", label: "Nombre", type: "text", icon: GoPerson },
  { name: "type", label: "Tipo", type: "text", icon: MdOutlineCategory }
];

const payrollSchema = yup.object().shape({
  name: yup.string().required("El nombre es obligatorio"),
  type: yup.string().required("El tipo es obligatorio")
});

const SpecialCases = () => {
  const {
    fetchPage,
    handleSearch,
    specialCases, 
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
    fetchSpecialCases,    
    handleDelete,
    handleEdit,
  } = useSpecialCases();

  const columns = [
            { header: "ID", key: "id" },
            { header: "Agente", key: "user.name" },
            { header: "Campaña", key: "contact.campaign" },
            { header: "Pagaduria", key: "contact.payroll" },
            { header: "Identificación", key: "contact.identification_number" },
            { header: "Cliente", key: "contact.name" },
            { header: "ID llamada", key: "id_call" },
            { header: "ID Messi", key: "id_messi" },
          ]

  return (
    <>
      <ButtonAdd onClickButtonAdd={() => setIsOpenADD(true)} text="Agregar caso especial" />

      <div className="flex justify-end px-36 -mt-10 ">
          <Search onSearch={handleSearch} placeholder="Buscar caso especial..." />
      </div>

      <h1 className="text-2xl font-bold text-center mb-4 text-purple-mid">
        Lista de casos especiales
      </h1>

      <FormAdd
        isOpen={isOpenADD}
        setIsOpen={setIsOpenADD}
        title="Caso especial"
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        loading={loading}
        validationErrors={validationErrors}
        fields={fields}
        schema={payrollSchema}
      />

      {loading ? (
        <Loader />
      ) : (
        <Table
          columns={columns}
          data={specialCases}
          currentPage={currentPage}
          fetch={(page) => fetchPage(page)}
          onDelete={handleDelete}
          totalPages={totalPages}
          onEdit={handleEdit}
        />
      )}
    </>
  );
};

export default SpecialCases;
