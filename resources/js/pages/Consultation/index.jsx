import React from "react";
import Table from "@components/Table";
import ButtonAdd from "@components/ButtonAdd";
import FormAdd from "@components/FormAddTest";
import Loader from "@components/Loader";
import { useConsults } from "./useConsults.js";
import * as yup from "yup";
import Search from "@components/Search";

const fields = [
  { name: "reason_consultation", label: "Motivo de consulta", type: "text" },
];

const userSchema = yup.object().shape({
  reason_consultation: yup.string().required("El motivo de consulta es obligatorio"),
});

const columns = [
  { header: "ID", key: "id" },
  { header: "Motivo de consulta", key: "reason_consultation" },
];


const Consults = () => {
  const {
    fetchPage,
    handleSearch,
    consultations,
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
  } = useConsults();

  return (
    <>
      <ButtonAdd onClickButtonAdd={() => setIsOpenADD(true)} text="Agregar Consulta" />
        <div className="flex justify-end px-36 -mt-10 ">
          <Search onSearch={handleSearch} placeholder="Buscar consulta..." />
        </div>

      <h1 className="text-2xl font-bold text-center mb-4 text-purple-mid">Lista de Consultas</h1>

      <FormAdd
        isOpen={isOpenADD}
        setIsOpen={setIsOpenADD}
        title="Consultas"
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
          data={consultations}
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

export default Consults;
