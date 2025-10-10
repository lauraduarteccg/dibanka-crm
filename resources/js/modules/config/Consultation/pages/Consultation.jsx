import Table from "@components/tables/Table";
import ButtonAdd from "@components/ui/ButtonAdd";
import FormAdd from "@components/forms/FormAdd";
import Loader from "@components/ui/Loader";
import Search from "@components/forms/Search";
import { useConsults } from "@modules/config/Consultation/hooks/useConsults";
import * as yup from "yup";

/* ===========================================================
 *  CAMPOS DEL FORMULARIO
 * =========================================================== */
const fields = [
  { name: "payroll_id", label: "Pagaduría", type: "select", options: [] },
  { name: "name", label: "Motivo de consulta", type: "text" },
];

/* ===========================================================
 *  VALIDACIÓN
 * =========================================================== */
const consultSchema = yup.object().shape({
  name: yup.string().required("El motivo de consulta es obligatorio"),
  payroll_id: yup.string().required("La pagaduría es obligatoria"),
});

/* ===========================================================
 *  COLUMNAS DE LA TABLA
 * =========================================================== */
const columns = [
  { header: "ID", key: "id" },
  { header: "Pagaduría", key: "payrolls.name" },
  { header: "Motivo de consulta", key: "name" },
];

/* ===========================================================
 *  COMPONENTE PRINCIPAL
 * =========================================================== */
const Consultation = () => {
  const {
    totalItems,
    perPage,
    payroll,
    fetchPage,
    handleSearch,
    consultations,
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
    handleCloseModal,
  } = useConsults();

  const activeConsults = consultations.filter((u) => u.is_active === 1).length;
  const inactiveConsults = totalItems - activeConsults;

  return (
    <>
      {/* Cards */}
      <div className="flex justify-center gap-6 mb-4">
        {[
          { label: "Consultas Totales", value: totalItems },
          { label: "Consultas Activas", value: activeConsults },
          { label: "Consultas Inactivas", value: inactiveConsults },
        ].map((stat, i) => (
          <div key={i} className="bg-white shadow-md rounded-lg px-6 py-4 w-64">
            <div className="flex justify-between items-center">
              <p className="text-sm text-black font-bold">{stat.label}</p>
              <p className="text-2xl font-bold text-primary-dark">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Botón + */}
      <ButtonAdd
        onClickButtonAdd={() => {
          setFormData({ id: null, name: "", payroll_id: "", is_active: true });
          setIsOpenADD(true);
        }}
        text="Agregar Consulta"
      />

      {/* Buscador */}
      <div className="flex justify-end px-12 -mt-10">
        <Search onSearch={handleSearch} placeholder="Buscar consulta..." />
      </div>

      {/* Modal */}
      <FormAdd
        isOpen={isOpenADD}
        setIsOpen={handleCloseModal}
        title="Consultas"
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        loading={loading}
        validationErrors={validationErrors}
        fields={fields.map((f) =>
          f.name === "payroll_id"
            ? {
                ...f,
                options: payroll.map((p) => ({
                  value: p.id,
                  label: p.name,
                })),
              }
            : f
        )}
        schema={consultSchema}
      />

      {/* Tabla */}
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
          actions
          onEdit={handleEdit}
        />
      )}
    </>
  );
};

export default Consultation;
