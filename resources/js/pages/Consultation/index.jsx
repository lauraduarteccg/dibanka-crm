import Table from "@components/Table";
import ButtonAdd from "@components/ButtonAdd";
import FormAdd from "@components/FormAddTest";
import Loader from "@components/Loader";
import { useConsults } from "./useConsults.js";
import * as yup from "yup";
import Search from "@components/Search";

const fields = [
  { name: "payroll_id", label: "Pagaduría", type: "select", options: [] },
  { name: "name", label: "Motivo de consulta", type: "text" },
];

const userSchema = yup.object().shape({
  name: yup.string().required("El motivo de consulta es obligatorio"),
  payroll_id: yup.string().required("La pagaduría es obligatoria"),
});

const columns = [
  { header: "ID", key: "id" },
  { header: "Pagaduría", key: "payrolls.name" },
  { header: "Motivo de consulta", key: "name" },
];


const Consults = () => {
  const {
    totalItems,
    perPage,
    payroll,
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
    handleCloseModal,
  } = useConsults();

  return (
    <>
      <ButtonAdd onClickButtonAdd={() => setIsOpenADD(true)} text="Agregar Consulta" />
        <div className="flex justify-end px-12 -mt-10 ">
          <Search onSearch={handleSearch} placeholder="Buscar consulta..." />
        </div>

      <h1 className="text-2xl font-bold text-center mb-4 text-purple-mid">Lista de Consultas</h1>

      <FormAdd
        isOpen={isOpenADD}
        setIsOpen={handleCloseModal}
        title="Consultas"
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
          data={consultations}
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

export default Consults;
