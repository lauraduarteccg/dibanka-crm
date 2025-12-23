import Table from "@components/tables/Table";
import ButtonAdd from "@components/ui/ButtonAdd";
import TableSkeleton from "@components/tables/TableSkeleton";
import FormAdd from "@components/forms/FormAdd";
import Search from "@components/forms/Search";
import StatCard from "@components/ui/StatCard";
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
    active,
    inactive,
  } = useMonitoring();

  const columns = [
    { header: "ID", key: "id" },
    { header: "Tipo de Seguimiento", key: "name" },
  ];

  const statsCards = [
    { title: "Seguimientos Totales", value: totalItems },
    { title: "Seguimientos Activos", value: active },
    { title: "Seguimientos Inactivos", value: inactive },
  ]
  return (
    <>
      {/* Cards */}
      <div className="flex justify-center gap-6 mb-4">
        {statsCards.map((stat, index) => (
          <StatCard key={index} stat={stat} loading={loading} />
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
        <TableSkeleton rows={3} />
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
