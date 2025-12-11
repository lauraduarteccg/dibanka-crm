import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  TextField,
  Button,
  Switch,
  FormHelperText,
  Alert,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import { TiContacts, TiInfoLarge } from "react-icons/ti";
import { MdOutlineFolderSpecial } from "react-icons/md";
import { BsInfoCircle } from "react-icons/bs";
import SpeedDialButton from "@components/ui/SpeedDialButton";
import seleccione_imagen from "@assets/seleccione_imagen.png";
import { useAddManagementForm } from "@modules/management/hooks/useAddManagementForm";
import { useSpecialCasesForm } from "@modules/management/hooks/useSpecialCasesForm";
import InfoField from "@modules/management/components/InfoField";
import FormSpecialCases from "@modules/management/components/FormSpecialCases";
import SearchPayroll from "@modules/management/components/SearchPayroll";
import { IoMdSearch } from "react-icons/io";
import Agent from "@modules/management/components/agent";

const AddManagement = () => {
  const {
    campaign,
    sms,
    wsp,
    selectedPayroll,
    selectedTypeManagement,
    selectedContact,
    selectedSolution,
    selectedConsultation,
    selectedSpecificConsultation,
    wolkvox_id,
    comments,
    modal,
    validationErrors,
    loadingConsultations,
    setCampaign,
    setSms,
    setWsp,
    setSelectedPayroll,
    setSelectedTypeManagement,
    setSelectedContact,
    setSelectedSolution,
    setSelectedConsultation,
    setSelectedSpecificConsultation,
    setWolkvox_id,
    setObservations,
    setModal,
    clearValidationError,
    onSave,
    handleClear,
    filteredTypeManagement,
    filteredConsultation,
    filteredSpecific,
    filteredContact,
    openSections,
    setOpenSections,
    optionsWithIndex,
  } = useAddManagementForm();

  const {
    user,
    openSpecialCases,
    setOpenSpecialCases,
    openSearchPayroll, 
    setOpenSearchPayroll,
  } = useSpecialCasesForm();

  const parsedDescription = selectedContact?.payroll?.description
  ?.replace(/{{agente}}/g, user?.name || "");

  const handleOpenInfoPopup = () => {
    const payrollId = selectedPayroll?.id || "";
    
    window.open(
      `/informacion?payroll_id=${encodeURIComponent(payrollId)}`,
      "_blank",
      "width=1000,height=700,scrollbars=yes,resizable=yes"
    );
  };


  const actions = [
    { icon: <MdOutlineFolderSpecial className="w-6 h-auto" />, name: "Caso especial", click: () => setOpenSpecialCases(true) },
    { icon: <TiInfoLarge className="w-7 h-auto" />, name: "Información", click: handleOpenInfoPopup },
  ];

  return (
    <div className="flex flex-col gap-4 text-secondary-dark px-[10%] pb-40 ">
      {/* Título */}
      <div className="flex justify-between items-center">
        <h1 className="flex justify-center items-center gap-3 text-2xl font-semibold">
          <TiContacts className="w-9 h-auto" /> Agregar Gestión
        </h1>
        <button
          onClick={handleClear}
          className=" text-gray-500 hover:text-gray-800 font-semibold"
        >
          Limpiar formulario
        </button>
      </div>
      <div className="h-0.5 bg-gray-300 rounded"></div>

      {/* Bloque de elegir cliente y mostrar imagen */}
      <div className="w-full flex gap-6 ">
        {/* Información del Cliente */}
        <div className="flex-1 bg-white shadow-lg rounded-xl p-6 border border-gray-100">
          {/* Header */}
          <div className="mb-6 pb-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">Información del cliente</h2>
          </div>

          {/* Autocomplete */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-500">Buscar Cliente</label>
            <Autocomplete
              disabled
              options={filteredContact}
              getOptionLabel={(option) =>
                `${option?.identification_number || ""} | ${option?.name || ""}`
              }
              value={selectedContact}
              onChange={(event, value) => {
                setSelectedContact(value)
                clearValidationError("contact_id");
              }}
              renderInput={(params) => (
                <div className="flex items-stretch rounded-lg overflow-hidden border border-gray-300 hover:border-blue-400 transition-all duration-200 bg-white shadow-sm">
                  <TextField
                    {...params}
                    error={!!validationErrors.contact_id}
                    helperText={validationErrors.contact_id ? validationErrors.contact_id[0] : ""}
                    className="flex-1"
                  />
                  <button
                    onClick={() => setOpenSearchPayroll(true)}
                    className="px-5 bg-blue-50 hover:bg-blue-100 border-l border-gray-300 transition-all duration-200 group"
                  >
                    <IoMdSearch className="text-blue-600 w-6 h-6 group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              )}
            />
          </div>

          {/* Grid de Información */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoField label="Campaña" value={selectedContact?.campaign.name ?? "—"} fieldName="campaign" />
            <InfoField label="Pagaduría" value={selectedContact?.payroll.name ?? "—"} fieldName="payroll" />
            <InfoField label="Nombre" value={selectedContact?.name ?? "—"} fieldName="name" />
            <InfoField label="Correo electrónico" value={selectedContact?.email ?? "—"} fieldName="email" />
            <InfoField label="Teléfono" value={selectedContact?.phone ?? "—"} fieldName="phone" />
            <InfoField label="Celular actualizado" value={selectedContact?.update_phone ?? "—"} fieldName="update_phone" />
            <InfoField label="Tipo de identificación" value={selectedContact?.identification_type ?? "—"} fieldName="identification_type" />
            <InfoField label="Número de identificación" value={selectedContact?.identification_number ?? "—"} fieldName="identification_number" />
            {loadingConsultations && (
              <div className="col-span-2 flex items-center justify-center gap-3 py-4 bg-blue-50 rounded-lg">
                <CircularProgress size={20} className="text-blue-600" />
                <span className="text-sm font-medium text-blue-700">Cargando consultas...</span>
              </div>
            )}
          </div>
        </div>

        {/* Imagen con información */}
        <div className="relative">          
          <div className="w-[320px] h-full bg-white shadow-xl rounded-2xl p-8">
            {selectedContact?.payroll?.img_payroll ? (
              <>
              <img
                src={selectedContact?.payroll?.img_payroll}
                alt={selectedContact?.payroll?.name}
                className="w-full h-64 object-contain"
              />
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 leading-relaxed">
                  {parsedDescription}
                </p>
              </div>
              </>
            ) : (
              <>
                <div className="w-full h-64 flex items-center justify-center">
                  <img
                    src={seleccione_imagen}
                    alt="Sin imagen"
                    className="opacity-60"
                  />
                </div>
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Selecciona un contacto para ver la imagen y la descripción.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
        
      <div className="grid grid-cols-2 gap-4">
        {/* Autocompletado de Tipo de gestión */}
        <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100 flex flex-col gap-3">
          <h2 className="text-2xl font-bold text-gray-800">Tipo de gestión</h2>
          <Autocomplete
            disabled={!selectedContact}
            options={filteredTypeManagement}
            getOptionLabel={(option) => option?.name || ""}
            value={selectedTypeManagement}
            onChange={(event, value) => {
              setSelectedTypeManagement(value)
              clearValidationError("type_management_id");
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Tipo de gesiton"
                error={!!validationErrors.type_management_id}
                helperText={validationErrors.type_management_id ? validationErrors.type_management_id[0] : ""}
              />
            )}
          />
        </div>

        {/* Selector de solución en primer contacto */}
        <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100 flex flex-col gap-3">
          <h2 className="text-2xl font-bold text-gray-800">Solución en el primer contacto</h2>
          <FormControl fullWidth error={!!validationErrors.solution}>
            <InputLabel id="solucion-label">Solución</InputLabel>
            <Select
              disabled={!selectedContact}
              labelId="solucion-label"
              id="solucion"
              value={selectedSolution}
              label="Solución"
              onChange={(event) => {
                setSelectedSolution(event.target.value);
                clearValidationError("solution");
              }}
            >
              <MenuItem value={true}>Sí</MenuItem>
              <MenuItem value={false}>No</MenuItem>
            </Select>
            {validationErrors.solution && (
              <FormHelperText>{validationErrors.solution[0]}</FormHelperText>
            )}
          </FormControl>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Autocompletado de motivo de consulta */}
        <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100 flex flex-col gap-3">
          <h2 className="text-2xl font-bold text-gray-800">Motivo de consulta</h2>
          <Autocomplete
            options={optionsWithIndex}
            getOptionLabel={(option) =>
              `${option?.index || ""} | ${option?.name || ""}`
            }
            value={selectedConsultation}
            onChange={(event, value) => {
              setSelectedConsultation(value)
              clearValidationError("consultation_id");
              // Resetear consulta específica cuando cambia la consulta principal
              setSelectedSpecificConsultation(null);
            }}
            disabled={!selectedContact || loadingConsultations}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Consulta"
                error={!!validationErrors.consultation_id}
                helperText={
                  !campaign 
                    ? "Selecciona una campaña primero"
                    : validationErrors.consultation_id 
                    ? validationErrors.consultation_id[0] 
                    : ""
                }
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loadingConsultations ? <CircularProgress size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        </div>

        {/* Autocompletado de motivo de consulta específica */}
        <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100 flex flex-col gap-3">
          <h2 className="text-2xl font-bold text-gray-800">Motivo específico de consulta</h2>
          <Autocomplete
            options={filteredSpecific}
            getOptionLabel={(option, index) => {
              const pos = filteredSpecific.findIndex(o => o.id === option.id);
              const numero = pos + 1;
              return `${option?.consultation?.id || ""}.${numero} | ${option?.name || ""}`;
            }}
            value={selectedSpecificConsultation}
            onChange={(event, value) => {
              setSelectedSpecificConsultation(value);
              clearValidationError("specific_id");
            }}
            disabled={!selectedContact || !campaign || loadingConsultations}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Consulta específica"
                error={!!validationErrors.specific_id}
                helperText={
                  !campaign
                    ? "Selecciona una campaña primero"
                    : validationErrors.specific_id 
                    ? validationErrors.specific_id[0] 
                    : ""
                }
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loadingConsultations ? <CircularProgress size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        </div>
      </div>

      {/* Swichs para enviar sms y wsp */}
      <div className="grid grid-cols-3 gap-4">
        {/* SMS */}
        <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100 flex flex-col gap-3">
          <h2 className="text-xl font-bold text-gray-800">Enviar SMS de canal de WhatsApp</h2>
          <Switch 
            disabled={!selectedContact} 
            checked={sms} 
            onChange={(e) => setSms(e.target.checked)} 
            inputProps={{ 'aria-label': 'Checkbox demo' }} 
          />
        </div>
          
        {/* Wolkvox id de la gestión */}
        <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100 flex flex-col gap-3">
          <p className="text-xl font-bold text-gray-800">Wolkvox_id de la gestión:</p>
          <TextField
            fullWidth
            id="wolkvox_id"
            label="Wolkvox ID"
            value={wolkvox_id}
            onChange={(e) => {
              setWolkvox_id(e.target.value);
              clearValidationError("wolkvox_id");
            }}
            multiline
            error={!!validationErrors.wolkvox_id}
            helperText={validationErrors.wolkvox_id ? validationErrors.wolkvox_id[0] : ""}
            disabled={!selectedContact}
          />
        </div>

        {/* WHATSAPP */}
        <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100 flex flex-col gap-3">
          <h2 className="text-xl font-bold text-gray-800">Enviar WhatsApp de recuperar contraseña</h2>
          <Switch
            disabled={!selectedContact}
            checked={wsp}                            
            onChange={(e) => setWsp(e.target.checked)} 
            inputProps={{ 'aria-label': 'Checkbox demo' }}
          />
        </div>
      </div>

      {/* Observaciones */}
      <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100 flex flex-col gap-3">
        <h2 className="text-2xl font-bold text-gray-800">Observaciones</h2>
        <TextField
          id="standard-multiline-static"
          label="Escriba aquí"
          value={comments}
          onChange={(e) => setObservations(e.target.value)}
          multiline
          rows={4}
          disabled={!selectedContact}
        />
      </div>

      {/* Botón Guardar */}
      <div className="flex items-center justify-center mt-10">
        <Button variant="contained" onClick={onSave} disabled={!selectedContact}>
          Guardar
        </Button>
      </div>
      
      {/* Boton flotante */}
      <div className="fixed bottom-20 right-10 z-50">
        <SpeedDialButton actions={actions} />
      </div>
      
      <Agent />

      {/* POPUP DE CASOS ESPECIALES */}
      <FormSpecialCases openSpecialCases={openSpecialCases} setOpenSpecialCases={setOpenSpecialCases} />

      {/* POPUP DE BUSCADOR PAGADURIA */}
      <SearchPayroll
        openSearchPayroll={openSearchPayroll}
        setOpenSearchPayroll={setOpenSearchPayroll}
        onSelectContact={setSelectedContact}
        selectedPayroll={selectedPayroll}
        campaign={campaign}
      />

      {/* Snackbar para alertar al agente que hay errores en el formulario */}
      <Snackbar
        open={Object.keys(validationErrors).length > 0}
        autoHideDuration={9000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity="error"
          variant="filled"
        >
          Corrige los errores del formulario
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AddManagement;