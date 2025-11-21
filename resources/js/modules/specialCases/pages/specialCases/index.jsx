import { useContext, useEffect } from "react";
import { useCan } from "@hooks/useCan";
import { useSpecialCases } from "@modules/specialCases/hooks/useSpecialCases";

import Table from "@components/tables/Table";
import ButtonAdd from "@components/ui/ButtonAdd";
import FormAdd from "@components/forms/FormAdd";
import Loader from "@components/ui/Loader";
import * as yup from "yup";
import Search from "@components/forms/Search";

import { AuthContext } from "@context/AuthContext";

const fields = [
  { name: "user_id", label: "Agente", type: "select", options: [] },
  { name: "payroll_id", label: "Pagaduría", type: "select", options: [] },
  { name: "contact_id", label: "Contacto", type: "autocomplete", options: [] },
  { name: "management_messi", label: "Gestión de messi", type: "select", options: [{ value: "Nota creada", label: "Nota Creada" }] },
  { name: "id_call", label: "ID Llamada", type: "text" },
  { name: "id_messi", label: "ID Messi", type: "text" }
];

const payrollSchema = yup.object().shape({
  user_id: yup.string().required("El agente es obligatorio"),
  payroll_id: yup.string().required("La pagaduria es obligatorio"),
  management_messi: yup.string().required("La gestión de Messi es obligatoria"),
  contact_id: yup.string().required("El cliente es obligatorio"),
  id_call: yup.string().required("El ID de la llamada es obligatorio"),
  id_messi: yup.string().required("El ID Messi es obligatorio")
});

const SpecialCases = ({ idAddSpecialCase, idSearchSpecialCase }) => {
  const { user } = useContext(AuthContext);
  const {
    users,
    contact,
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
  } = useSpecialCases();
  const { can, canAny } = useCan();

  const selectedPayroll = formData?.payroll_id;

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
    { header: "Campaña", key: "contact.campaign" },
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
      <FormAdd
        isOpen={isOpenADD}
        setIsOpen={handleCloseModal}
        title="Caso especial"
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        loading={loading}
        validationErrors={validationErrors}
        fields={fields.map(field => {
          if (field.name === "payroll_id") {
            return {
              ...field,
              options: payroll ? payroll.map(p => ({
                value: p.id,
                label: p.name
              })) : []
            };
          } else if (field.name === "contact_id") {
            // Filtrar contactos por pagaduría seleccionada
            const filteredContacts = contact
              ? contact.filter(c => c.payroll.id === selectedPayroll)
              : [];

            return {
              ...field,
              options: filteredContacts.map(p => ({
                value: p.id,
                label: `${p.identification_number} | ${p.name}`
              }))
            };
          } else if (field.name === "user_id") {
            return {
              ...field,
              options: users ? users.map(p => ({
                value: p.id,
                label: p.name
              })) : [],
              disabled: true
            };
          }
          return field;
        })}
        schema={payrollSchema}
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
