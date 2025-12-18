import { useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { useCan } from "@hooks/useCan";
import Drawer from '@mui/material/Drawer';
import { TextField, FormControl, Autocomplete, Tabs, Tab, Box } from "@mui/material";
import { useManagement } from "@modules/management/hooks/useManagement.js";
import TableSkeleton from "@components/tables/TableSkeleton";
import Table from "@components/tables/Table";
import ButtonAdd from "@components/ui/ButtonAdd";
import Button from "@components/ui/Button";
import FilterSearch from "@components/ui/FilterSearch";
import HistoryChanges from "@components/ui/HistoryChanges";

const columns = [
  { header: "ID", key: "id" },
  { header: "Agente", key: "user.name" },
  { header: "Pagaduría", key: "contact.payroll.name" },
  { header: "Nombre de cliente", key: "contact.name" },
  { header: "Identificación", key: "contact.identification_number" },
  { header: "Celular", key: "contact.phone" },
  { header: "Consulta", key: "consultation.name" },
  { header: "Consulta Especifica", key: "specific.name" },
  { header: "Tipo de gestión", key: "type_management.name" },
  { header: "Fecha de creación", key: "created_at" },
];

// Opciones de filtro para Management
const filterOptions = [
  { value: "identification_number", label: "Número de identificación" },
  { value: "name", label: "Nombre de cliente" },
  { value: "phone", label: "Celular" },
  { value: "payroll", label: "Pagaduría" },
  { value: "consultation", label: "Consulta" },
  { value: "user", label: "Agente" },
  { value: "wolkvox_id", label: "Wolkvox_id" },
  { value: "consultation", label: "Consulta" },
  { value: "specific", label: "Consulta Especifica" },
  { value: "type_management", label: "Tipo de gestión" },
  { value: "solution_date", label: "Fecha de solución" },
  { value: "created_at", label: "Fecha de creación" },
];

const P = ({ text1, text2 }) => {
  let displayValue = text2;

  if (typeof text2 === 'object' && text2 !== null) {
    displayValue = text2.name || JSON.stringify(text2);
  }

  return (
    <p className="text-gray-600 leading-relaxed">
      <strong className="text-gray-700">{text1}</strong>
      <span className="text-gray-900 ml-1">{displayValue}</span>
    </p>
  );
};

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

const Management = ({ idView, idMonitoring, idSearchManagement, idAddManagement }) => {
  const {
    handleSubmit,
    monitoring,
    onMonitoring,
    setOnMonitoring,
    management,
    view,
    setView,
    formData,
    loading,
    setFormData,
    currentPage,
    totalPages,
    perPage,
    totalItems,
    fetchPage,
    handleSearch,
    searchTerm,
    handleClearSearch,
    setCampaign,
    campaign,
    managementCountAliados,
    managementCountAfiliados,
    filterColumn,

    // Historial Aliados
    openHistoryAliados,
    setOpenHistoryAliados,
    historyAliados,
    loadingHistoryAliados,
    currentPageAliados,
    totalPagesAliados,
    perPageAliados,
    totalItemsAliados,
    handleOpenHistoryAliados,
    fetchHistoryPageAliados,
    selectedManagement,
    
    //Historial Afiliados
    openHistoryAfiliados,
    setOpenHistoryAfiliados,
    historyAfiliados,
    loadingHistoryAfiliados,
    currentPageAfiliados,
    totalPagesAfiliados,
    perPageAfiliados,
    totalItemsAfiliados,
    handleOpenHistoryAfiliados,
    fetchHistoryPageAfiliados,
  } = useManagement();

  const { can } = useCan();
  const navigate = useNavigate();

  const [tabValue, setTabValue] = useState(campaign === "Aliados" ? 0 : 1);

  useEffect(() => {
    setTabValue(campaign === "Aliados" ? 0 : 1);
  }, [campaign]);

  const handleTabChange = (_, newValue) => {
    setTabValue(newValue);
    setCampaign(newValue === 0 ? "Aliados" : "Afiliados");
  };

  const handleView = (item) => {
    setFormData(item);
    setView(true);
  };

  const handleMonitoring = (item) => {
    setFormData({
      ...item,
      solution_date: item.solution_date || "",
      monitoring_id: item.monitoring?.id || "",
    });
    setOnMonitoring(true);
  };

  const handleFilterSearch = (searchValue, filterColumn) => {
    let column = filterColumn;

    // Normalizar filtros para backend
    if (filterColumn === "contact.payroll.name") column = "payroll";
    if (filterColumn === "consultation.name") column = "consultation";
    if (filterColumn === "user.name") column = "user";
    if (filterColumn === "contact.name") column = "name";
    if (filterColumn === "contact.identification_number") column = "identification_number";
    if (filterColumn === "contact.phone") column = "phone";
    if (filterColumn === "wolkvox_id") column = "wolkvox_id";

    handleSearch(searchValue, column);
  };

  const activeData = management || [];

  return (
    <>
      {/* Tabs con totales separados */}
      <Box sx={{ width: "100%", mb: 4, margin: "auto" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            centered
            aria-label="gestiones tabs"
          >
            <Tab label={`Gestiones de Aliados (${managementCountAliados})`} {...a11yProps(0)} />
            <Tab label={`Gestiones de Afiliados (${managementCountAfiliados})`} {...a11yProps(1)} />
          </Tabs>
        </Box>

        {/* Tab Panel - Aliados */}
        <TabPanel value={tabValue} index={0}>

          {can("management.create") && (
            <ButtonAdd
              id={idAddManagement}
              onClickButtonAdd={() => {
                //console.log("Navigating to add management with search term:", searchTerm);
                navigate(`/gestiones/añadir?identification_number=${searchTerm}`)
              }}
              text="Agregar Gestión"
            />
          )}

          <div className="flex justify-end px-12 mb-4 gap-2 -mt-10">
            <FilterSearch
              id={idSearchManagement}
              onFilter={handleFilterSearch}
              placeholder="Buscar gestión de aliados..."
              filterOptions={filterOptions}
              initialSearchValue={searchTerm}
              initialSelectedFilter={filterColumn}
            />
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="bg-red-500 text-white h-[50%] px-4 py-2 rounded hover:bg-red-600 transition-colors"
              >
                Limpiar filtro
              </button>
            )}
          </div>

          <h1 className="text-2xl font-bold text-center mb-4 text-purple-mid">
            Lista de gestiones - Aliados
          </h1>

          {loading ? (
            <TableSkeleton rows={11} />
          ) : (
            <Table
              width="90%"
              columns={columns}
              data={activeData}
              currentPage={currentPage}
              totalPages={totalPages}
              rowsPerPage={perPage}
              totalItems={totalItems}
              fetchPage={fetchPage}
              actions={true}
              history={true}
              onHistory={(item) => handleOpenHistoryAliados(item)}
              view={true}
              onView={(item) => handleView(item)}
              edit={false}
              monitoring={true}
              onMonitoring={(item) => handleMonitoring(item)}
              onActiveOrInactive={false}
              idView={idView}
              idMonitoring={idMonitoring}
            />
          )}
          
            <HistoryChanges
                isOpen={openHistoryAliados}
                onClose={() => setOpenHistoryAliados(false)}
                contact={selectedManagement} 
                history={historyAliados}
                loading={loadingHistoryAliados}
                currentPage={currentPageAliados}
                totalPages={totalPagesAliados}
                totalItems={totalItemsAliados}
                perPage={perPageAliados}
                onPageChange={fetchHistoryPageAliados}
            />
        </TabPanel>

        {/* Tab Panel - Afiliados */}
        <TabPanel value={tabValue} index={1}>

          {can("management.create") && (
            <ButtonAdd
              id={idAddManagement}
              onClickButtonAdd={() => {
                console.log("Navigating to add management with search term:", searchTerm);
                navigate(`/gestiones/añadir?identification_number=${searchTerm}`)
              }} 
              text="Agregar Gestión"
            />
          )}
          <div className="flex justify-end px-12 mb-4 gap-2 -mt-10">
            <FilterSearch
              id={idSearchManagement}
              onFilter={handleFilterSearch}
              placeholder="Buscar gestión de afiliados..."
              filterOptions={filterOptions}
              initialSearchValue={searchTerm}
              initialSelectedFilter={filterColumn}
            />
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="bg-red-500 h-[50%] text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
              >
                Limpiar filtro
              </button>
            )}
          </div>

          <h1 className="text-2xl font-bold text-center mb-4 text-purple-mid">
            Lista de gestiones - Afiliados
          </h1>

          {loading ? (
            <TableSkeleton rows={columns.length} />
          ) : (
            <Table
              columns={columns}
              data={activeData}
              currentPage={currentPage}
              totalPages={totalPages}
              rowsPerPage={perPage}
              totalItems={totalItems}
              fetchPage={fetchPage}
              actions={true}
              history={true}
              onHistory={(item) => handleOpenHistoryAfiliados(item)}
              view={true}
              onView={(item) => handleView(item)}
              edit={false}
              monitoring={true}
              onMonitoring={(item) => handleMonitoring(item)}
              onActiveOrInactive={false}
              idView={idView}
              idMonitoring={idMonitoring}
            />
          )}          
            <HistoryChanges
                isOpen={openHistoryAfiliados}
                onClose={() => setOpenHistoryAfiliados(false)}
                contact={selectedManagement} 
                history={historyAfiliados}
                loading={loadingHistoryAfiliados}
                currentPage={currentPageAfiliados}
                totalPages={totalPagesAfiliados}
                totalItems={totalItemsAfiliados}
                perPage={perPageAfiliados}
                onPageChange={fetchHistoryPageAfiliados}
            />
        </TabPanel>
      </Box>

      {/* Drawer de Vista */}
      <Drawer
        open={view}
        onClose={() => setView(false)}
        anchor="right"
        PaperProps={{
          sx: {
            backgroundColor: "#f3f3f3",
            width: 500,
            padding: 3,
          },
        }}
      >
        <div className="flex flex-col gap-4">
          <button
            onClick={() => setView(false)}
            className="self-end text-gray-500 hover:text-gray-800 font-semibold"
          >
            ✕ Cerrar
          </button>

          <div className="bg-white shadow-md rounded-lg p-5 flex flex-col gap-3">
            <P text1="Agente: " text2={formData.user?.name ?? "Usuario sin nombre"} />
          </div>

          <div className="bg-white shadow-md rounded-lg p-5 flex flex-col gap-3">
            <P text1="Pagaduría: " text2={formData.contact?.payroll?.name ?? "Sin pagaduría"} />
            <P text1="Campaña: " text2={formData.contact?.campaign ?? "Sin campaña"} />
          </div>

          <div className="bg-white shadow-md rounded-lg p-5 flex flex-col gap-3">
            <P text1="Nombre del cliente: " text2={formData.contact?.name ?? "Sin Nombre"} />
            <P text1="Teléfono: " text2={formData.contact?.phone ?? "No tiene teléfono"} />
            <P text1="Tipo de identificación: " text2={formData.contact?.identification_type ?? "Sin tipo de identificación"} />
            <P text1="Número de identificación: " text2={formData.contact?.identification_number ?? "Sin número de identificación"} />
            <P text1="Celular actualizado: " text2={formData.contact?.update_phone ?? "No tiene celular actualizado"} />
            <P text1="Correo: " text2={formData.contact?.email ?? "No tiene correo electronico"} />
          </div>

          <div className="bg-white shadow-md rounded-lg p-5 flex flex-col gap-3">
            <P text1="Consulta: " text2={formData.consultation?.name ?? "Sin consulta"} />
            <P text1="Consulta específica: " text2={formData.specific?.name ?? "Sin consulta especifica"} />
            <P text1="Wolkvox_id: " text2={formData.wolkvox_id ?? "Sin wolkvox_id"} />
          </div>

          <div className="bg-white shadow-md rounded-lg p-5 flex flex-col gap-3">
            <P text1="Solución en primer contacto: " text2={formData.solution ? "Sí" : "No"} />
            <P text1="Observaciones: " text2={formData.comments ?? "Sin observaciones"} />
            <P text1="Fecha de solución: " text2={formData.solution_date ?? "Sin fecha de solución"} />
            <P text1="Seguimiento: " text2={formData.monitoring?.name ?? "Sin seguimiento"} />
          </div>

          <div className="bg-white shadow-md rounded-lg p-5 flex flex-col gap-3">
            <P text1="Fecha de creación: " text2={formData.created_at ?? "No registra fecha"} />
          </div>
        </div>
      </Drawer>

      {/* Drawer de Seguimiento */}
      <Drawer
        open={onMonitoring}
        onClose={() => setOnMonitoring(false)}
        anchor="right"
        PaperProps={{
          sx: {
            width: 500,
            padding: 3,
            borderRadius: "12px 0 0 12px",
          },
        }}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <button
            onClick={() => setOnMonitoring(false)}
            className="self-end text-gray-500 hover:text-gray-800 font-semibold"
          >
            ✕
          </button>

          <h2 className="text-xl font-bold text-gray-800 ml-5">Agregar Seguimiento</h2>

          <div className="p-5 flex flex-col gap-4">
            <TextField
              label="Fecha de seguimiento"
              type="date"
              InputLabelProps={{ shrink: true }}
              fullWidth
              value={formData.solution_date || ""}
              onChange={(e) =>
                setFormData({ ...formData, solution_date: e.target.value })
              }
            />

            <FormControl fullWidth>
              <Autocomplete
                id="monitoring-select"
                options={monitoring || []}
                getOptionLabel={(option) => option.name}
                value={monitoring?.find(m => m.id === formData.monitoring_id) || null}
                onChange={(event, newValue) => {
                  setFormData({
                    ...formData,
                    monitoring_id: newValue ? newValue.id : "",
                  });
                }}
                renderInput={(params) => <TextField {...params} label="Seguimiento" />}
              />
            </FormControl>

            <div>
              <Button type="submit" text="Guardar" />
            </div>
          </div>
        </form>
      </Drawer>
    </>
  );
};

export default Management;