import Table from "@components/tables/Table";
import ButtonAdd from "@components/ui/ButtonAdd";
import Loader from "@components/ui/Loader";
import FormAdd from "@components/forms/FormAdd";
import Search from "@components/forms/Search";
import * as yup from "yup";
import { useMonitoring } from "@modules/config/Monitoring/hooks/useMonitoring";

/* ===========================================================
 *  FORMULARIO Y VALIDACIÓN
 * =========================================================== */
const fields = [{ name: "name", label: "Seguimiento", type: "text" }];

const monitoringSchema = yup.object().shape({
  name: yup
    .string()
    .required("El nombre del seguimiento es obligatorio")
    .min(3, "Mínimo 3 caracteres"),
});

/* ===========================================================
 *  COMPONENTE PRINCIPAL
 * =========================================================== */
const Monitoring = () => {
  const {
    fetchPage,
    handleSearch,
    monitoring,
    loading,
    isOpenADD,
    setIsOpenADD,
    formData,
    setFormData,
    validationErrors,
    handleSubmit,
    currentPage,
    totalPages,
    perPage,
    totalItems,
    handleDelete,
    handleEdit,
    handleCloseModal,
  } = useMonitoring();

  const columns = [
    { header: "ID", key: "id" },
    { header: "Tipo de Seguimiento", key: "name" },
  ];

  const activeCount = monitoring.filter((m) => m.is_active === 1).length;
  const inactiveCount = totalItems - activeCount;

  return (
    <>
      {/* Cards */}
      <div className="flex justify-center gap-6 mb-4">
        {[
          { label: "Seguimientos Totales", value: totalItems },
          { label: "Seguimientos Activos", value: activeCount },
          { label: "Seguimientos Inactivos", value: inactiveCount },
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
          setFormData({ id: null, name: "", is_active: true });
          setIsOpenADD(true);
        }}
        text="Agregar seguimiento"
      />

      {/* Buscador */}
      <div className="flex justify-end px-12 -mt-10">
        <Search onSearch={handleSearch} placeholder="Buscar seguimiento..." />
      </div>

      {/* Modal */}
      <FormAdd
        isOpen={isOpenADD}
        setIsOpen={handleCloseModal}
        title="Tipo de Seguimiento"
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        loading={loading}
        validationErrors={validationErrors}
        fields={fields}
        schema={monitoringSchema}
      />

      {/* Tabla */}
      {loading ? (
        <Loader />
      ) : (
        <Table
          columns={columns}
          data={monitoring}
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

export default Monitoring;
