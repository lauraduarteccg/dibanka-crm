import Table from "@components/tables/Table";
import ButtonAdd from "@components/ui/ButtonAdd";
import FormAdd from "@components/forms/FormAdd";
import Loader from "@components/ui/Loader";
import Search from "@components/forms/Search";
import * as yup from "yup";
import { useConsultSpecifics } from "@modules/config/consultationSpecific/hooks/useConsultSpecifics";

/* ===========================================================
 *  CAMPOS DEL FORMULARIO
 * =========================================================== */
const fields = [
  { name: "consultation_id", label: "Motivo consulta", type: "autocomplete", options: [] },
  { name: "name", label: "Motivo específico", type: "text" },
];

/* ===========================================================
 *  VALIDACIÓN
 * =========================================================== */
const schema = yup.object().shape({
  name: yup.string().required("El motivo específico es obligatorio"),
  consultation_id: yup
    .number()
    .required("El motivo general es obligatorio")
    .typeError("Debes seleccionar un motivo general"),
});

/* ===========================================================
 *  COLUMNAS DE TABLA
 * =========================================================== */
const columns = [
  { header: "ID", key: "id" },
  { header: "Pagaduría", key: "payroll" },
  { header: "Motivo General", key: "consultation" },
  { header: "Motivo Específico", key: "name" },
];

/* ===========================================================
 *  COMPONENTE PRINCIPAL 
 * =========================================================== */
const ConsultationSpecific = () => {
  const {
    fetchPage,
    handleSearch,
    handleOpenForm,
    consultationNoSpecific,
    consultation,
    loading,
    isOpenADD,
    setIsOpenADD,
    formData,
    setFormData,
    validationErrors,
    handleSubmit,
    perPage,
    totalItems,
    currentPage,
    totalPages,
    handleDelete,
    handleEdit,
    handleCloseModal,
  } = useConsultSpecifics();

  const activeCount = consultation.filter((c) => c.is_active === 1).length;
  const inactiveCount = totalItems - activeCount;

  return (
    <>
      {/* Cards */}
      <div className="flex justify-center gap-6 mb-4">
        {[
          { label: "Consultas Totales", value: totalItems },
          { label: "Consultas Activas", value: activeCount },
          { label: "Consultas Inactivas", value: inactiveCount },
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
      <ButtonAdd onClickButtonAdd={handleOpenForm} text="Agregar Consulta Específica" />

      {/* Buscador */}
      <div className="flex justify-end px-12 -mt-10">
        <Search onSearch={handleSearch} placeholder="Buscar consulta específica..." />
      </div>

      {/* Modal Form */}
      <FormAdd
        isOpen={isOpenADD}
        setIsOpen={handleCloseModal}
        title="Consultas Específicas"
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        loading={loading}
        validationErrors={validationErrors}
        fields={fields.map((f) => {
          if (f.name === "consultation_id") {
            // 🔹 Filtramos solo activos y evitamos duplicados por nombre + pagaduría
            const uniqueOptions = [];
            const seen = new Set();

            consultationNoSpecific.forEach((c) => {
              const key = `${c.payrolls?.name || "Sin pagaduría"}-${c.name}`;
              if (!seen.has(key)) {
                seen.add(key);
                uniqueOptions.push({
                  value: c.id,
                  label: `${c.payrolls?.name || "Sin pagaduría"} - ${c.name}`,
                });
              }
            });

            return { ...f, options: uniqueOptions };
          }
          return f;
        })}
        schema={schema}
      />

      {/* Tabla */}
      {loading ? (
        <Loader />
      ) : (
        <Table
          columns={columns}
          data={consultation}
          currentPage={currentPage}
          totalPages={totalPages}
          rowsPerPage={perPage}
          totalItems={totalItems}
          fetchPage={(page) => fetchPage(page)}
          onDelete={handleDelete}
          actions
          onEdit={handleEdit}
        />
      )}
    </>
  );
};

export default ConsultationSpecific;
