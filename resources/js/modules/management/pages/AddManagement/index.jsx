import React, {useState, forwardRef} from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  TextField,
  Button,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  FormHelperText,
  Alert,
  Snackbar,
  Slide
} from "@mui/material";
import { TiContacts, TiInfoLarge } from "react-icons/ti";
import { MdOutlineFolderSpecial } from "react-icons/md";
import { BsInfoCircle } from "react-icons/bs";
import SpeedDialButton from "@components/ui/SpeedDialButton";
import seleccione_imagen from "@assets/seleccione_imagen.png";
import { useAddManagementForm } from "@modules/management/hooks/useAddManagementForm";
import { useSpecialCasesForm } from "@modules/management/hooks/useSpecialCasesForm";
import PopupInfoPayroll from "@components/ui/PopupInfoPayroll";
import { motion } from "framer-motion";

const AddManagement = () => {


  const {
    infoItems,
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
    payrollSpecial,
    contact,
    selectedPayrollSpecial,
    setSelectedPayrollSpecial,
    selectedContactSpecial,
    setSelectedContactSpecial,
    formData,
    setFormData,
    validationErrorsSpecial,
    handleSubmit,
    clearFieldError,
    openSpecialCases,
    setOpenSpecialCases,
    onClose,
  } = useSpecialCasesForm();

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const renderDescription = (text) => {
    if (!text) return null;

    // 1️⃣ Reemplazar {{agente}} por el nombre del agente
    const replacedText = text.replaceAll("{{agente}}", user.name ?? "");

    // 2️⃣ Separar por saltos de línea
    const lines = replacedText.split("\n");

    // 3️⃣ Renderizar cada línea con <br />
    return lines.map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  }; 

  const actions = [
    { icon: <MdOutlineFolderSpecial className="w-6 h-auto" />, name: "Caso especial", click: () => setOpenSpecialCases(true) },
    { icon: <TiInfoLarge className="w-7 h-auto" />, name: "Información", click: () => setIsPopupOpen(true) },
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
            <TextField
              {...params}
              label="Cliente"
              error={!!validationErrors.contact_id}
              helperText={validationErrors.contact_id ? validationErrors.contact_id[0] : ""}
            />
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
    <Dialog onClose={() => setModal(false)} open={modal} className="max-w-3xl mx-auto">
        <DialogTitle className="border-b border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 pb-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold bg-primary-strong bg-clip-text text-transparent"
              >
                Descripción de la pagaduría
              </motion.p>
            </div>
          </div>
        </DialogTitle>
        <DialogContent dividers className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 min-h-[200px]">
          {selectedPayroll?.name ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-start gap-3">
                  <div className="w-1 h-full bg-gradient-to-b from-blue-500 via-indigo-500 to-blue-400 rounded-full min-h-[60px]"></div>
                  <div className="flex-1">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="prose prose-blue max-w-none"
                    >
                      <div className="text-slate-700 leading-relaxed text-base">
                        {renderDescription(selectedPayroll.description)}
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 rounded-lg px-4 py-2 border border-blue-100"
              >
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                <span className="font-medium">{selectedPayroll.name}</span>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center justify-center min-h-[200px] gap-4"
            >
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1
                }}
                className="w-20 h-20 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg"
              >
                <span className="text-4xl">📝</span>
              </motion.div>
              <p className="text-slate-400 text-lg font-medium">
                Seleccione una pagaduría
              </p>
              <div className="flex gap-2 mt-2">
                <span className="w-2 h-2 bg-blue-300 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-indigo-300 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                <span className="w-2 h-2 bg-blue-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
              </div>
            </motion.div>
          )}
        </DialogContent>
    </Dialog>
      {/* Boton flotante */}
      <div className="fixed bottom-10 right-10 z-50">
        <SpeedDialButton actions={actions} />
      </div>

      {/* POPUP DE CASOS ESPECIALES */}
      <Dialog
        open={openSpecialCases}
        onClose={onClose}
        sx={{
          "& .MuiDialog-paper": {
            position: "fixed",
            right: 0,
            top: 0,
            height: "100vh",
            maxHeight: "100vh",
            width: "36%",
            maxWidth: "none",
            margin: 0,
            borderRadius: "12px 0 0 12px",
          },
        }}
      >
      <div className="flex flex-col items-right justify-center p-10 w-full text-secondary-dark">
        <DialogTitle className="flex justify-between items-center">
          <p className="text-2xl font-semibold">Agregar caso especial</p>
          <button
            onClick={() => setOpenSpecialCases(false)}
            className="text-xl font-bold p-2 hover:bg-gray-200 rounded-full"
          >
            X
          </button>
        </DialogTitle>

        <DialogContent dividers className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {/* AGENTE */}
            <TextField
              label="Agente"
              value={user?.name || ""}
              fullWidth
              disabled
            />

            {/* PAGADURÍA */}
            <Autocomplete
              options={payrollSpecial || []}
              getOptionLabel={(option) => option?.name || ""}
              value={selectedPayrollSpecial || null}
              onChange={(e, value) => {
                setSelectedPayrollSpecial(value);
                clearFieldError("payroll_id");
                setFormData((prev) => ({
                  ...prev,
                  payroll_id: value?.id || "",
                  contact_id: "",
                }));
                setSelectedContactSpecial(null);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Pagaduría"
                  error={!!validationErrorsSpecial?.payroll_id}
                  helperText={
                    validationErrorsSpecial?.payroll_id
                      ? validationErrorsSpecial.payroll_id[0]
                      : ""
                  }
                  fullWidth
                />
              )}
            />

            {/* CLIENTE */} 
            <Autocomplete
              options={
                Array.isArray(contact) && selectedPayrollSpecial
                  ? contact.filter((c) => c?.payroll?.id === selectedPayrollSpecial?.id)
                  : contact || []
              }
              getOptionLabel={(option) =>
                `${option.identification_number} | ${option.name}`
              }
              value={selectedContactSpecial || null}
              onChange={(e, value) => {
                setSelectedContactSpecial(value);
                clearFieldError("contact_id");
                setFormData((prev) => ({
                  ...prev,
                  contact_id: value?.id || "",
                }));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Cliente"
                  error={!!validationErrorsSpecial?.contact_id}
                  helperText={
                    validationErrorsSpecial?.contact_id
                      ? validationErrorsSpecial.contact_id[0]
                      : ""
                  }
                  fullWidth
                />
              )}
            />

            {/* GESTIÓN DE MESSI */}
            <FormControl
              fullWidth
              error={!!validationErrorsSpecial?.management_messi}
            >
              <InputLabel>Gestión de Messi</InputLabel>
              <Select
                value={formData?.management_messi || ""}
                onChange={(e) => {
                  clearFieldError("management_messi");
                  setFormData((prev) => ({
                    ...prev,
                    management_messi: e.target.value,
                  }));
                }}
                label="Gestión de Messi"
              >
                <MenuItem value="">Seleccione</MenuItem>
                <MenuItem value="Nota creada">Nota creada</MenuItem>
              </Select>
              {validationErrorsSpecial?.management_messi && (
                <FormHelperText>
                  {validationErrorsSpecial.management_messi[0]}
                </FormHelperText>
              )}
            </FormControl>

            {/* ID LLAMADA */}
            <TextField
              label="ID de la llamada"
              value={formData?.id_call || ""}
              onChange={(e) => {
                clearFieldError("id_call");
                setFormData((prev) => ({
                  ...prev,
                  id_call: e.target.value,
                }));
              }}
              error={!!validationErrorsSpecial?.id_call}
              helperText={
                validationErrorsSpecial?.id_call
                  ? validationErrorsSpecial.id_call[0]
                  : ""
              }
              fullWidth
            />

            {/* ID MESSI */}
            <TextField
              label="ID Messi"
              value={formData?.id_messi || ""}
              onChange={(e) => {
                clearFieldError("id_messi");
                setFormData((prev) => ({
                  ...prev,
                  id_messi: e.target.value,
                }));
              }}
              error={!!validationErrorsSpecial?.id_messi}
              helperText={
                validationErrorsSpecial?.id_messi
                  ? validationErrorsSpecial.id_messi[0]
                  : ""
              }
              fullWidth
            />
          </div>

          {/* BOTONES */}
          <div className="flex justify-end gap-4 mt-6">
            <Button
              variant="outlined"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Guardar caso especial
            </Button>
          </div>
        </DialogContent>
        </div>
      </Dialog>

      {/* POPUP DE INFORMACIÓN DE LA PAGADURIA */}
      <PopupInfoPayroll isOpen={isPopupOpen} setIsOpen={setIsPopupOpen} infoItems={infoItems} />
      
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