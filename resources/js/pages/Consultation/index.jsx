import React from "react";
import Table from "@components/Table";
import ButtonAdd from "@components/ButtonAdd";
import FormAdd from "@components/FormAddTest";
import Loader from "@components/Loader";
import { useConsults } from "./useConsults.js";
import * as yup from "yup";
import { FaRegComment, FaBullseye } from "react-icons/fa6";

const fields = [
{
  name: "specific_reason",
  label: "Motivo específico",
  type: "checklist",
  icon: FaBullseye,
  options: ({ consultationSpecifics }) =>
    (consultationSpecifics || []).map((c) => ({ label: c.specific_reason, value: c.id })),
},
  { name: "reason_consultation", label: "Motivo de consulta", type: "text", icon: FaRegComment },
];

const userSchema = yup.object().shape({
  specific_reason: yup.array().of(yup.number().required()).min(1, "El motivo específico es obligatorio"),
  reason_consultation: yup.string().required("El motivo de consulta es obligatorio"),
});

const columns = [
  { header: "ID", key: "id" },
  { header: "Motivo de consulta", key: "reason_consultation" },
  { header: "Motivo específico", key: "specific_names", render: (row) => row.specific_names ?? "-" },
];


const Consults = () => {
  const {
    consultationSpecifics,
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

  // Normaliza la selección del checklist a array de ids antes de guardar en formData
const handleSetSelectedChecklist = (selected) => {
  if (!selected) {
    setFormData((prev) => ({ ...prev, specific_id: [] }));
    return;
  }

  if (Array.isArray(selected) && selected.length > 0) {
    const first = selected[0];
    if (typeof first === "object") {
      const ids = selected.map((s) => s.value ?? s.id ?? s);
      setFormData((prev) => ({ ...prev, specific_id: ids }));
    } else {
      setFormData((prev) => ({ ...prev, specific_id: selected }));
    }
  } else {
    setFormData((prev) => ({ ...prev, specific_id: [] }));
  }
};

  return (
    <>
      <ButtonAdd onClickButtonAdd={() => setIsOpenADD(true)} text="Agregar Consulta" />
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
        checklist={consultationSpecifics}
        selectedChecklist={formData.specific_reason || []}
        setSelectedChecklist={handleSetSelectedChecklist}
      />

      {loading ? (
        <Loader />
      ) : (
        <Table
          columns={columns}
          data={consultations}
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

export default Consults;
