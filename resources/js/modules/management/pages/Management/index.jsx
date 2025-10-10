import { useNavigate } from "react-router-dom";
import { useCan } from "@hooks/useCan";
import Drawer from '@mui/material/Drawer';
import { TextField, FormControl, Autocomplete } from "@mui/material";

import { useManagement } from "@modules/management/hooks/useManagement.js";

import Table from "@components/tables/Table";
import ButtonAdd from "@components/ui/ButtonAdd";
import Loader from "@components/ui/Loader";
import Button from "@components/ui/Button"
import SearchBar from "@components/forms/Search";



const columns = [
  { header: "ID", key: "id" },
  { header: "Agente", key: "user.name" },
  { header: "Pagaduría", key: "payroll.name" },
  { header: "Consulta", key: "consultation.name" },
  { header: "Nombre de cliente", key: "contact.name" },
  { header: "Identificación", key: "contact.identification_number" },
  { header: "Celular", key: "contact.phone" },
  { header: "Fecha de creación", key: "created_at" },
];


const P = ({ text1, text2 }) => (
  <p className="text-gray-600 leading-relaxed">
    <strong className="text-gray-700">{text1}</strong>
    <span className="text-gray-900 ml-1">{text2}</span>
  </p>
);

const Management = () => {
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
  } = useManagement();
  const { can, canAny } = useCan();

  const handleView = (item) => {
    setFormData(item);
    setView(true);
  };

  const handleMonitoring = (item) => {
    // Establecer los valores predeterminados desde la gestión
    setFormData({
      ...item,
      solution_date: item.solution_date || "", // Usar la fecha de solución del monitoring si existe
      monitoring_id: item.monitoring?.id || "", // Usar el ID del monitoring si existe
    });
    setOnMonitoring(true);
  };

  const navigate = useNavigate();

  return (
    <>
      {can("management.create") && (

        <ButtonAdd
          onClickButtonAdd={() => navigate("/gestiones/añadir")}
          text="Agregar Gestión"
        />)}

      <div className="flex justify-end px-12 -mt-10 ">
        <SearchBar onSearch={handleSearch} placeholder="Buscar gestión..." />
      </div>

      <h1 className="text-2xl font-bold text-center mb-4 text-purple-mid">
        Lista de gestiones
      </h1>

      {loading ? (
        <Loader />
      ) : (
        <Table
          columns={columns}
          data={management ?? []}
          currentPage={currentPage}
          totalPages={totalPages}
          rowsPerPage={perPage}
          totalItems={totalItems}
          fetch={(page) => fetchPage(page)}
          actions={true}
          view={true}
          onView={(item) => handleView(item)}
          edit={false}
          monitoring={true}
          onMonitoring={(item) => handleMonitoring(item)}
          onActiveOrInactive={false}
        />
      )}

      {/* Drawer de Vista (sin cambios) */}
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
            <P text1="Pagaduría: " text2={formData.payroll?.name ?? "Sin pagaduría"} />
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
            <P text1="Consulta específica: " text2={formData.specific?.name ?? "Sin consulta"} />
            <P text1="Wolkvox_id: " text2={formData.wolkvox_id ?? "Sin wolkvox_id"} />
          </div>

          <div className="bg-white shadow-md rounded-lg p-5 flex flex-col gap-3">
            <P text1="Solución en primer contacto: " text2={formData.solution ? "Sí" : "No"} />
            <P text1="Observaciones: " text2={formData.comments ?? "Sin consulta"} />
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
                options={monitoring || []}            // Lista de opciones
                getOptionLabel={(option) => option.name} // Cómo mostrar cada opción
                value={monitoring?.find(m => m.id === formData.monitoring_id) || null} // Selección actual
                onChange={(event, newValue) => {
                  setFormData({
                    ...formData,
                    monitoring_id: newValue ? newValue.id : "", // Guardar el id
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
