import { usePayrolls } from "./usePayrolls";
import Table from "@components/Table";
import ButtonAdd from "@components/ButtonAdd";
import FormAdd from "@components/FormAddTest";
import Loader from "@components/Loader";
import * as yup from "yup";
import Search from "@components/Search";

const fields = [
  { name: "name", label: "Nombre", type: "text", },
  { name: "description", label: "Descripción", type: "longtext" },
  { name: "img_payroll", label: "Imagen de pagaduría", type: "file", withLabel: false }
];

const payrollSchema = yup.object().shape({
  name: yup.string().required("El nombre es obligatorio"),
  description: yup.string().required("La descripción es obligatoria"),img_payroll: yup
  .mixed()
  .test("required", "La imagen de la pagaduría es obligatoria", (value) => {
    // ✅ Acepta cuando viene como URL string (imagen guardada en BD)
    if (typeof value === "string" && value.trim() !== "") return true;

    // ✅ Acepta cuando es un File nuevo
    if (value instanceof File) return true;

    return false;
  }),
});

const Payrolls = () => {
  const {
    fetchPage,
    handleSearch,
    payrolls, 
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
    totalItems,
    perPage,
  } = usePayrolls();

  return (
    <>
      <ButtonAdd onClickButtonAdd={() => setIsOpenADD(true)} text="Agregar pagaduría" />

      <div className="flex justify-end px-12 -mt-10 ">
          <Search onSearch={handleSearch} placeholder="Buscar pagaduria..." />
      </div>

      <h1 className="text-2xl font-bold text-center mb-4 text-purple-mid">
        Lista de pagadurías
      </h1>

      <FormAdd
        isOpen={isOpenADD}
        setIsOpen={setIsOpenADD}
        title="Pagaduría"
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
          columns={[
            { header: "ID", key: "id" },
            { header: "Pagaduría", key: "name" },
            { header: "Imagen", key: "img_payroll" },
          ]}
          data={payrolls}
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

export default Payrolls;
