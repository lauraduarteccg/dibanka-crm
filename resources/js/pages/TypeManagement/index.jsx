import React from "react";
import Table from "@components/Table";
import ButtonAdd from "@components/ButtonAdd";
import FormAdd from "@components/FormAddTest";
import Loader from "@components/Loader";
import { useTypeManagement } from "./useTypeManagement.js";
import * as yup from "yup";
import { FaRegComment } from "react-icons/fa6";
import { HiOutlineMail } from "react-icons/hi";

const fields = [
  {
    name: "payroll", label: "Pagaduría", type: "checklist", icon: FaRegComment,
    options: ({ payroll }) => (payroll || []).map((p) => ({ label: p.name, value: p.id })),
  },
  { name: "name", label: "Tipo de gestión", type: "text", icon: HiOutlineMail },
];

const userSchema = yup.object().shape({
  payroll: yup.array().of(yup.number().required()).min(1, "La pagaduría es obligatoria"),
  name: yup.string().required("El nombre es obligatorio").min(6, "Mínimo 6 caracteres"),
});

const columns = [
  { header: "ID", key: "id" },
  { header: "Pagaduría", key: "payroll_names" },
  { header: "Tipo de gestión", key: "name" },
];

const TypeManagement = () => {
  const {
    payroll,
    typemanagement,
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
  } = useTypeManagement();

  // Normaliza la selección del checklist a array de ids antes de guardar en formData
  const handleSetSelectedChecklist = (selected) => {
    if (!selected) {
      setFormData((prev) => ({ ...prev, payroll: [] }));
      return;
    }

    if (Array.isArray(selected) && selected.length > 0) {
      const first = selected[0];
      if (typeof first === "object") {
        const ids = selected.map((s) => s.value ?? s.id ?? s);
        setFormData((prev) => ({ ...prev, payroll: ids }));
      } else {
        setFormData((prev) => ({ ...prev, payroll: selected }));
      }
    } else {
      setFormData((prev) => ({ ...prev, payroll: [] }));
    }
  };

  return (
    <>
      <ButtonAdd onClickButtonAdd={() => setIsOpenADD(true)} text="Agregar tipo de gestión" />
      <h1 className="text-2xl font-bold text-center mb-4 text-purple-mid">
        Lista de Tipos de gestiones
      </h1>

      <FormAdd
        isOpen={isOpenADD}
        setIsOpen={setIsOpenADD}
        title="Tipos de gestión"
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        loading={loading}
        validationErrors={validationErrors}
        fields={fields}
        schema={userSchema}
        checklist={payroll}
        selectedChecklist={formData.payroll || []}
        setSelectedChecklist={handleSetSelectedChecklist}
      />

      {loading ? (
        <Loader />
      ) : (
        <Table
          columns={columns}
          data={typemanagement}
          currentPage={currentPage}
          fetch={fetchConsultation}
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
