import React from "react";
import Table from "@components/tables/Table";
import ButtonAdd from "@components/ui/ButtonAdd";
import FormAdd from "@components/forms/FormAdd";
import Loader from "@components/ui/Loader";
import Search from "@components/forms/Search";
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
  } = useTypeManagement();

  const activeCount = typeManagement.filter((u) => u.is_active === 1).length;
  const inactiveCount = totalItems - activeCount;

  const columns = [
    { header: "ID", key: "id" },
    { header: "Pagadurías", key: "payrolls", render: (row) => {
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

  return (
    <>
      {/* Cards */}
      <div className="flex justify-center gap-6 mb-4">
        {[
          { label: "Gestiones Totales", value: totalItems },
          { label: "Gestiones Activas", value: activeCount },
          { label: "Gestiones Inactivas", value: inactiveCount },
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
        <Loader />
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
