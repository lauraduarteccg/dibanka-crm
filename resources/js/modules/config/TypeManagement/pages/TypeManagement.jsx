import React from "react";
import Table from "@components/tables/Table";
import ButtonAdd from "@components/ui/ButtonAdd";
import FormAdd from "@components/forms/FormAdd";
import TableSkeleton from "@components/tables/TableSkeleton";
import Search from "@components/forms/Search";
import StatCard from "@components/ui/StatCard";
import * as yup from "yup";
import { useTypeManagement } from "@modules/config/TypeManagement/hooks/useTypeManagement";

/* ===========================================================
 *  FORMULARIO Y VALIDACIÓN
 * =========================================================== */
const fields = [
  { name: "payrolls", label: "Pagadurías", type: "multiselect", options: [] },
  { name: "name", label: "Tipo de gestión", type: "text" },
];

const typeManagementSchema = yup.object().shape({
  payrolls: yup
    .array()
    .min(1, "Debe seleccionar al menos una pagaduría")
    .required("Las pagadurías son obligatorias"),
  name: yup
    .string()
    .required("El nombre es obligatorio")
    .min(3, "Mínimo 3 caracteres"),
});

/* ===========================================================
 *  COMPONENTE PRINCIPAL
 * =========================================================== */
const TypeManagement = () => {
  const {
    fetchPage,
    handleSearch,
    payroll,
    typeManagement,
    loading,
    isOpenADD,
    setIsOpenADD,
    formData,
    setFormData,
    validationErrors,
    handleSubmit,
    totalItems,
    perPage,
    currentPage,
    totalPages,
    handleDelete,
    handleEdit,
    handleCloseModal,
    active,
    inactive,
  } = useTypeManagement();

  const columns = [
    { header: "ID", key: "id" },
    {
      header: "Pagadurías", key: "payrolls", render: (row) => {
        if (!row.payrolls || (Array.isArray(row.payrolls) && row.payrolls.length === 0)) return "Sin relaciones";

        // Si es un array de pagadurías
        if (Array.isArray(row.payrolls)) {
          return row.payrolls.map(p => p.name).join(", ");
        }

        // Si es un objeto único
        return row.payrolls.name || "—";
      }
    },
    { header: "Tipo de gestión", key: "name" },
  ];
  const statsCards = [
    { title: "Tipos de Gestión Totales", value: totalItems },
    { title: "Tipos de Gestión Activos", value: active },
    { title: "Tipos de Gestión Inactivos", value: inactive },
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
          setFormData({ id: null, name: "", payrolls: [], is_active: true });
          setIsOpenADD(true);
        }}
        text="Agregar tipo de gestión"
      />

      {/* Buscador */}
      <div className="flex justify-end px-12 -mt-10">
        <Search onSearch={handleSearch} placeholder="Buscar tipo de gestión..." />
      </div>

      {/* Modal */}
      <FormAdd
        isOpen={isOpenADD}
        setIsOpen={handleCloseModal}
        title="Tipos de Gestión"
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        loading={loading}
        validationErrors={validationErrors}
        fields={fields.map((field) =>
          field.name === "payrolls"
            ? {
              ...field,
              options: payroll.map((p) => ({
                value: p.id,
                label: p.name,
              })),
            }
            : field
        )}
        schema={typeManagementSchema}
      />

      {/* Tabla */}
      {loading ? (
        <TableSkeleton rows={4} />
      ) : (
        <Table
          columns={columns}
          data={typeManagement}
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

export default TypeManagement;
