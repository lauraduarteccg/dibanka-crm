import { useState } from "react";
import Table from "@components/tables/Table";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import ButtonAdd from "@components/ui/ButtonAdd";
import FormAdd from "@components/forms/FormAdd";
import TableSkeleton from "@components/tables/TableSkeleton";
import Search from "@components/forms/Search";
import StatCard from "@components/ui/StatCard";
import { useConsultsAliados } from "@modules/config/Consultation/hooks/useConsultsAliados";
import { useConsultsAfiliados } from "@modules/config/Consultation/hooks/useConsultsAfiliados";
import * as yup from "yup";

/* ===========================================================
 *  CAMPOS DEL FORMULARIO
 * =========================================================== */
const fields = [
  { name: "payroll_ids", label: "Pagadurías", type: "multiselect", options: [] },
  { name: "name", label: "Motivo de consulta", type: "text" },
];

/* ===========================================================
 *  VALIDACIÓN
 * =========================================================== */
const consultSchema = yup.object().shape({
  name: yup.string().required("El motivo de consulta es obligatorio"),
  payroll_ids: yup.array().min(1, "Debe seleccionar al menos una pagaduría").required("Las pagadurías son obligatorias"),
});

/* ===========================================================
 *  COLUMNAS DE LA TABLA
 * =========================================================== */
const columns = [
  { header: "ID", key: "id" },
  {
    header: "Pagadurías",
    key: "payrolls",
    render: (row) => {
      if (!row.payrolls || (Array.isArray(row.payrolls) && row.payrolls.length === 0)) return "Sin relaciones";

      // Si es un array de pagadurías 
      if (Array.isArray(row.payrolls)) {
        return row.payrolls.map(p => p.name).join(", ");
      }

      // Si es un objeto único
      return row.payrolls.name || "—";
    }
  },
  { header: "Motivo de consulta", key: "name" },
];

/* ===========================================================
 *  TAB PANEL (JSX friendly)
 * =========================================================== */
function TabPanel({ children, value, index }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tab-panel-${index}`}
      aria-labelledby={`tab-${index}`}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `tab-${index}`,
    "aria-controls": `tab-panel-${index}`,
  };
}

/* ===========================================================
 *  COMPONENTE PRINCIPAL
 * =========================================================== */
const Consultation = () => {
  // Hook independiente para Aliados
  const aliadosHook = useConsultsAliados();

  // Hook independiente para Afiliados
  const afiliadosHook = useConsultsAfiliados();

  const [value, setValue] = useState(0);

  const handleChange = (_, newValue) => {
    setValue(newValue);
  };

  // Seleccionar el hook activo según el tab
  const activeHook = value === 0 ? aliadosHook : afiliadosHook;

  const {
    consultations,
    payroll,
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
    handleSearch,
    fetchPage,
    handleCloseModal,
  } = activeHook;

  const activeConsults = consultations.filter((u) => u.is_active === 1).length;
  const inactiveConsults = totalItems - activeConsults;
  const statsCards = [
    { title: "Consultas Totales", value: totalItems },
    { title: "Consultas Activas", value:activeConsults },
    { title: "Consultas Inactivas", value: inactiveConsults },
  ]
  return (
    <>
      {/* Cards */}
        <div className="flex justify-center gap-6 mb-4">
                {statsCards.map((stat, index) => (
                    <StatCard key={index} stat={stat} loading={loading} />
                ))}
            </div>


      {/* Tabs */}
      <Box sx={{ width: "80%", mb: 4, textAlign: "center", margin: "auto" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            centered
            aria-label="basic tabs example"
          >
            <Tab label="Consultas de Aliados" {...a11yProps(0)} />
            <Tab label="Consultas de Afiliados" {...a11yProps(1)} />
          </Tabs>
        </Box>

        <TabPanel value={value} index={0}>
          {/* Botón + */}
          <ButtonAdd
            onClickButtonAdd={() => {
              setFormData({ id: null, name: "", payroll_ids: [], is_active: true });
              setIsOpenADD(true);
            }}
            text="Agregar consulta"
          />

          {/* Buscador */}
          <div className="flex justify-end px-12 -mt-10">
            <Search onSearch={handleSearch} placeholder="Buscar consulta..." />
          </div>

          {/* Modal */}
          <FormAdd
            isOpen={isOpenADD}
            setIsOpen={handleCloseModal}
            title="Consultas de Aliados"
            formData={formData}
            setFormData={setFormData}
            handleSubmit={handleSubmit}
            loading={loading}
            validationErrors={validationErrors}
            fields={fields.map((f) =>
              f.name === "payroll_ids"
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
            <TableSkeleton rows={4} />

          ) : (
            <Table
              columns={columns}
              data={consultations}
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
        </TabPanel>
        <TabPanel value={value} index={1}>
          {/* Botón + */}
          <ButtonAdd
            onClickButtonAdd={() => {
              setFormData({ id: null, name: "", payroll_ids: [], is_active: true });
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
            title="Consultas de Afiliados"
            formData={formData}
            setFormData={setFormData}
            handleSubmit={handleSubmit}
            loading={loading}
            validationErrors={validationErrors}
            fields={fields.map((f) =>
              f.name === "payroll_ids"
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
            <TableSkeleton rows={4} />

          ) : (
            <Table
              columns={columns}
              data={consultations}
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
        </TabPanel>
      </Box>
    </>
  );
};

export default Consultation;
