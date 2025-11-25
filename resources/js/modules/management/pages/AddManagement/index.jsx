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
} from "@mui/material";
import { TiContacts, TiInfoLarge } from "react-icons/ti";
import { MdOutlineFolderSpecial } from "react-icons/md";
import { BsInfoCircle } from "react-icons/bs";
import SpeedDialButton from "@components/ui/SpeedDialButton";
import seleccione_imagen from "@assets/seleccione_imagen.png";
import { useAddManagementForm } from "@modules/management/hooks/useAddManagementForm";
import { useSpecialCasesForm } from "@modules/management/hooks/useSpecialCasesForm";
import FormSpecialCases from "@modules/management/components/FormSpecialCases";
import PopupLittlePayroll from "@modules/management/components/PopupLittlePayroll";
import SearchPayroll from "@modules/management/components/SearchPayroll";
import { IoMdSearch } from "react-icons/io";
import Agent from "@modules/management/components/agent";


const AddManagement = () => {


  const {
    isPopupOpen,
    setIsPopupOpen,
    payroll,
    consultation,
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

  const handleOpenInfoPopup = () => {

    const payrollId = selectedPayroll?.id || "";
    
    window.open(
      `http://localhost:8000/informacion?payroll_id=${encodeURIComponent(payrollId)}`,
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

      {/* Bloque de campaña y pagaduria con imagen */}
    <div className="flex gap-1 ">
      <div className="w-11/12 grid gap-10">
        {/* Selector de campaña */}
        <div className="bg-white shadow-md rounded-lg p-5 flex flex-col gap-3">
          <h2 className="text-xl font-semibold">Campaña</h2>
          <FormControl fullWidth>
            <InputLabel id="campania-label">Campaña</InputLabel>
            <Select
              labelId="campania-label"
              id="campania"
              value={campaign}
              label="Campaña"
              onChange={(event) => setCampaign(event.target.value)}
            >
              <MenuItem value="Aliados">Aliados</MenuItem>
              <MenuItem value="Afiliados">Afiliados</MenuItem>
            </Select>
          </FormControl>
        </div>

        {/* Autocompletado de Pagaduría */}
        <div className="bg-white shadow-md rounded-lg p-5 flex flex-col gap-3">
          <h2 className="text-xl font-semibold">Pagaduría</h2>
          <Autocomplete
            options={payroll || []}
            getOptionLabel={(option) => option?.name || ""}
            value={selectedPayroll}
            onChange={(event, value) => {
                setSelectedPayroll(value);
                clearValidationError("payroll_id");
              }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Pagaduría"
                error={!!validationErrors.payroll_id}
                helperText={validationErrors.payroll_id ? validationErrors.payroll_id[0] : ""}
          />
            )}
          />
        </div>
      </div>
      {/* Imagen */}
      <button
        className="relative ml-5"
        onClick={() => setModal(true)}
      >
        {/* Ícono en la esquina superior izquierda */}
        <BsInfoCircle className="absolute top-6 left-6 text-2xl text-primary-strong z-10" />

        {/* Imagen */}
        {selectedPayroll?.img_payroll ? (
          <img
            src={selectedPayroll.img_payroll}
            alt={selectedPayroll.name}
            className="w-[390px] bg-white shadow-xl rounded-xl p-8"
          />
        ) : (
          <img
            src={seleccione_imagen}
            alt="Sin imagen"
            className="w-[390px] bg-white shadow-xl rounded-xl p-8"
          />
        )}
      </button>
    </div>

      {/* Autocompletado de Cliente/Contacto */}
      <div className="bg-white shadow-md rounded-lg p-5 flex flex-col gap-3">
        <h2 className="text-xl font-semibold">Información del cliente</h2>
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
            <div className="flex items-center w-full bg-gray-50 border border-gray-200  overflow-hidden shadow-sm">
              <TextField
                {...params}
                label="Cliente"
                error={!!validationErrors.contact_id}
                helperText={validationErrors.contact_id ? validationErrors.contact_id[0] : ""}
              />
              <button
                onClick={() => setOpenSearchPayroll(true)}
                className="px-4 border-l border-gray-200 hover:bg-gray-100 transition-colors duration-200"
              >
                <IoMdSearch className="text-primary-strong w-6 h-6" />
              </button>
            </div>
          )}
        />
        {/* Información del cliente */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <div className="flex flex-col">
            <p className="text-sm font-medium text-gray-500">Nombre:</p>
            <p className="text-lg font-normal text-gray-800">{selectedContact?.name ?? "—"}</p>
          </div>

          <div className="flex flex-col">
            <p className="text-sm font-medium text-gray-500">Correo:</p>
            <p className="text-lg font-normal text-gray-800">{selectedContact?.email ?? "—"}</p>
          </div>

          <div className="flex flex-col">
            <p className="text-sm font-medium text-gray-500">Teléfono:</p>
            <p className="text-lg font-normal text-gray-800">{selectedContact?.phone ?? "—"}</p>
          </div>

          <div className="flex flex-col">
            <p className="text-sm font-medium text-gray-500">Celular actualizado:</p>
            <p className="text-lg font-normal text-gray-800">{selectedContact?.update_phone ?? "—"}</p>
          </div>

          <div className="flex flex-col">
            <p className="text-sm font-medium text-gray-500">Tipo de identificación:</p>
            <p className="text-lg font-normal text-gray-800">{selectedContact?.identification_type ?? "—"}</p>
          </div>

          <div className="flex flex-col">
            <p className="text-sm font-medium text-gray-500">Número de identificación:</p>
            <p className="text-lg font-normal text-gray-800">{selectedContact?.identification_number ?? "—"}</p>
          </div>
        </div>
      </div>
        
      <div className="grid grid-cols-2 gap-4">
        {/* Autocompletado de Tipo de gestión */}
        <div className="bg-white shadow-md rounded-lg p-5 flex flex-col gap-3">
          <h2 className="text-xl font-semibold">Tipo de gestión</h2>
          <Autocomplete
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
        <div className="bg-white shadow-md rounded-lg p-5 flex flex-col gap-3">
          <h2 className="text-xl font-semibold">Solución en el primer contacto</h2>
          <FormControl fullWidth error={!!validationErrors.solution}>
            <InputLabel id="solucion-label">Solución</InputLabel>
            <Select
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
      <div className="bg-white shadow-md rounded-lg p-5 flex flex-col gap-3">
        <h2 className="text-xl font-semibold">Motivo de consulta</h2>
        <Autocomplete
          options={optionsWithIndex}
          getOptionLabel={(option) =>
            `${option?.index || ""} | ${option?.name || ""}`
          }
          value={selectedConsultation}
            onChange={(event, value) => {
              setSelectedConsultation(value)
              clearValidationError("consultation_id");
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Consulta"
                error={!!validationErrors.consultation_id}
                helperText={validationErrors.consultation_id ? validationErrors.consultation_id[0] : ""}
              />
            )}
        />
      </div>

      {/* Autocompletado de motivo de consulta específica */}
      <div className="bg-white shadow-md rounded-lg p-5 flex flex-col gap-3">
        <h2 className="text-xl font-semibold">Motivo específico de consulta</h2>
          <Autocomplete
            options={filteredSpecific}
            getOptionLabel={(option, index) => {
              // Encuentra el índice de la opción dentro del arreglo filtrado
              const pos = filteredSpecific.findIndex(o => o.id === option.id);
              const numero = pos + 1; // empieza desde 1
              return `${option?.consultation?.id || ""}.${numero} | ${option?.name || ""}`;
            }}
            value={selectedSpecificConsultation}
            onChange={(event, value) => {
              setSelectedSpecificConsultation(value);
              clearValidationError("specific_id");
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Consulta específica"
                error={!!validationErrors.specific_id}
                helperText={validationErrors.specific_id ? validationErrors.specific_id[0] : ""}
              />
            )}
          />

      </div>
    </div>
    {/* Swichs para enviar sms y wsp */}
    <div className="grid grid-cols-3 gap-4">
      {/* SMS */}
        <div className="bg-white shadow-md rounded-lg p-5 flex flex-col gap-3">
          <h2 className="text-xl font-semibold">Enviar SMS de canal de WhatsApp</h2>
          <Switch 
            checked={sms} 
            onChange={(e) => setSms(e.target.checked)} 
            inputProps={{ 'aria-label': 'Checkbox demo' }} 
          />
        </div>
          
      {/* Wolkvox id de la gestión */}
      <div className="bg-white shadow-md rounded-lg p-5 flex flex-col gap-3">
        <p className="text-xl font-semibold pb-3">Wolkvox_id de la gestión:</p>
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
          error={!!validationErrors.wolkvox_id} // 👈 muestra el borde rojo
          helperText={validationErrors.wolkvox_id ? validationErrors.wolkvox_id[0] : ""} // 👈 muestra el mensaje
        />
      </div>

      {/* WHATSAPP */}
        <div className="bg-white shadow-md rounded-lg p-5 flex flex-col gap-3">
          <h2 className="text-xl font-semibold">Enviar WhatsApp de recuperar contraseña</h2>
          <Switch
            checked={wsp}                            
            onChange={(e) => setWsp(e.target.checked)} 
            inputProps={{ 'aria-label': 'Checkbox demo' }}
          />
        </div>
    </div>


      {/* Observaciones */}
      <div className="bg-white shadow-md rounded-lg p-5 flex flex-col gap-3">
        <h2 className="text-xl font-semibold">Observaciones</h2>
        <TextField
          id="standard-multiline-static"
          label="Escriba aquí"
          value={comments}
          onChange={(e) => setObservations(e.target.value)}
          multiline
          rows={4}
        />
      </div>

      {/* Botón Guardar */}
      <div className="flex items-center justify-center mt-10">
        <Button variant="contained" onClick={onSave}>
          Guardar
        </Button>
      </div>

      {/* Popup para mostrar la descripcion de la pagaduria */}
      <PopupLittlePayroll modal={modal} setModal={setModal} selectedPayroll={selectedPayroll} user={user} />
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
        onSelectContact={setSelectedContact} // 👈 envía el contacto seleccionado
        selectedPayroll={selectedPayroll}
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