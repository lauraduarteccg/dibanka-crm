import { useState } from "react";
import Table from "@components/tables/Table";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import ButtonAdd from "@components/ui/ButtonAdd";
import FormAdd from "@components/forms/FormAdd";
import Loader from "@components/ui/Loader";
import Search from "@components/forms/Search";
import { useConsultSpecificsAliados } from "@modules/config/ConsultationSpecific/hooks/useConsultSpecificsAliados";
import { useConsultSpecificsAfiliados } from "@modules/config/ConsultationSpecific/hooks/useConsultSpecificsAfiliados";
import * as yup from "yup";

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
const ConsultationSpecific = () => {
  // Hook independiente para Aliados
  const aliadosHook = useConsultSpecificsAliados();
  
  // Hook independiente para Afiliados
  const afiliadosHook = useConsultSpecificsAfiliados();

  const [value, setValue] = useState(0);

  const handleChange = (_, newValue) => {
    setValue(newValue);
  };

  // Datos compartidos entre ambos tabs
  const {
    specificAliados,
    specificAfiliados,
    loadingAliados,
    loadingAfiliados,
    currentPage,
    totalPages,
    perPage,
    totalItems,
  } = { ...aliadosHook, ...afiliadosHook };

  // Usar el hook activo según el tab seleccionado
  const activeConsultationNoSpecific = value === 0 ? aliadosHook.consultationNoSpecific : afiliadosHook.consultationNoSpecific;
  const activeFormData = value === 0 ? aliadosHook.formData : afiliadosHook.formData;
  const activeSetFormData = value === 0 ? aliadosHook.setFormData : afiliadosHook.setFormData;
  const activeValidationErrors = value === 0 ? aliadosHook.validationErrors : afiliadosHook.validationErrors;
  const activeIsOpenADD = value === 0 ? aliadosHook.isOpenADD : afiliadosHook.isOpenADD;
  const activeHandleOpenForm = value === 0 ? aliadosHook.handleOpenForm : afiliadosHook.handleOpenForm;
  const activeHandleCloseModal = value === 0 ? aliadosHook.handleCloseModal : afiliadosHook.handleCloseModal;
  const activeHandleSave = value === 0 ? aliadosHook.handleSaveAliados : afiliadosHook.handleSaveAfiliados;
  const activeHandleDelete = value === 0 ? aliadosHook.handleDeleteAliados : afiliadosHook.handleDeleteAfiliados;
  const activeHandleEdit = value === 0 ? aliadosHook.handleEditAliados : afiliadosHook.handleEditAfiliados;
  const activeHandleSearch = value === 0 ? aliadosHook.handleSearchAliados : afiliadosHook.handleSearchAfiliados;
  const activeFetchPage = value === 0 ? aliadosHook.fetchPageAliados : afiliadosHook.fetchPageAfiliados;

  // Datos del tab activo con valores por defecto
  const activeData = value === 0 ? (specificAliados || []) : (specificAfiliados || []);
  const activeLoading = value === 0 ? loadingAliados : loadingAfiliados;

  const activeCount = activeData?.filter((c) => c.is_active === 1).length || 0;
  const inactiveCount = (totalItems || 0) ;

  return (
    <>
      {/* Cards */}
      <div className="flex justify-center gap-6 mb-4">
        {[
          { label: "Consultas Específicas Totales", value: totalItems || 0 },
          { label: "Consultas Específicas Activas", value: activeCount },
          { label: "Consultas Específicas Inactivas", value: inactiveCount },
        ].map((stat, i) => (
          <div key={i} className="bg-white shadow-md rounded-lg px-6 py-4 w-64">
            <div className="flex justify-between items-center">
              <p className="text-sm text-black font-bold">{stat.label}</p>
              <p className="text-2xl font-bold text-primary-dark">
                {stat.value}
              </p>
            </div>
          </div>
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
            <Tab label="Consultas Específicas de Aliados" {...a11yProps(0)} />
            <Tab label="Consultas Específicas de Afiliados" {...a11yProps(1)} />
          </Tabs>
        </Box>

        <TabPanel value={value} index={0}>
          <ButtonAdd
            onClickButtonAdd={activeHandleOpenForm}
            text="Agregar Consulta Específica"
          />

          <div className="flex justify-end px-12 -mt-10">
            <Search onSearch={activeHandleSearch} placeholder="Buscar consulta específica..." />
          </div>

          <FormAdd
            isOpen={activeIsOpenADD}
            setIsOpen={activeHandleCloseModal}
            title="Consultas Específicas de Aliados"
            formData={activeFormData}
            setFormData={activeSetFormData}
            handleSubmit={activeHandleSave}
            loading={activeLoading}
            validationErrors={activeValidationErrors}
            fields={fields.map((f) => {
              if (f.name === "consultation_id") {
                const uniqueOptions = (activeConsultationNoSpecific || []).map((c) => ({
                  value: c.id,
                  label: c.name,
                }));

                return { ...f, options: uniqueOptions };
              }
              return f;
            })}
            schema={schema}
          />

          {activeLoading ? (
            <Loader />
          ) : (
            <Table
              columns={columns}
              data={activeData}
              currentPage={currentPage}
              totalPages={totalPages}
              rowsPerPage={perPage}
              totalItems={totalItems}
              fetchPage={(page) => activeFetchPage(page)}
              onDelete={activeHandleDelete}
              actions
              onEdit={activeHandleEdit}
            />
          )}
        </TabPanel>

        <TabPanel value={value} index={1}>
          <ButtonAdd
            onClickButtonAdd={activeHandleOpenForm}
            text="Agregar Consulta Específica"
          />

          <div className="flex justify-end px-12 -mt-10">
            <Search onSearch={activeHandleSearch} placeholder="Buscar consulta específica..." />
          </div>

          <FormAdd
            isOpen={activeIsOpenADD}
            setIsOpen={activeHandleCloseModal}
            title="Consultas Específicas de Afiliados"
            formData={activeFormData}
            setFormData={activeSetFormData}
            handleSubmit={activeHandleSave}
            loading={activeLoading}
            validationErrors={activeValidationErrors}
            fields={fields.map((f) => {
              if (f.name === "consultation_id") {
                const uniqueOptions = (activeConsultationNoSpecific || []).map((c) => ({
                  value: c.id,
                  label: c.name,
                }));

                return { ...f, options: uniqueOptions };
              }
              return f;
            })}
            schema={schema}
          />

          {activeLoading ? (
            <Loader />
          ) : (
            <Table
              columns={columns}
              data={activeData}
              currentPage={currentPage}
              totalPages={totalPages}
              rowsPerPage={perPage}
              totalItems={totalItems}
              fetchPage={(page) => activeFetchPage(page)}
              onDelete={activeHandleDelete}
              actions
              onEdit={activeHandleEdit}
            />
          )}
        </TabPanel>
      </Box>
    </>
  );
};

export default ConsultationSpecific;