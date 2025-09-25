import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "@context/AuthContext";
import seleccione_imagen from "../../../assets/seleccione_imagen.png"
import { useAddManagement } from "./useAddManagement.js";
import { useLocation, useNavigate } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";
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
  Box,
} from "@mui/material";

import { TiContacts } from "react-icons/ti";


const AddManagement = () => {

  const navigate = useNavigate();

  const {
    modal,
    setModal,
    payroll,
    contact,
    consultation,
    typeManagement,
    specific,
    handleSubmit,
    validationErrors,
    clearValidationError,
    clearAllValidationErrors,
  } = useAddManagement();

  const { user } = useContext(AuthContext);
  const location = useLocation();
  const [formData, setFormData] = useState({
    campaign: "",
    payroll: "",
  });

  // Estados para los errores
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  // Reemplaza {{agente}} por el nombre del agente y detecta los saltos delinea
  const renderDescription = (text, agente) => {
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
  // Estados locales para controlar inputs
  const [campaign, setCampaign] = useState("");
  const [ sms, setSms ] = useState(false);
  const [ wsp, setWsp ] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState(null);
  const [selectedTypeManagement, setSelectedTypeManagement] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [selectedSolution, setSelectedSolution] = useState("");
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [wolkvox_id, setWolkvox_id] = useState("");
  const [selectedSpecificConsultation, setSelectedSpecificConsultation] =
    useState(null);
  const [comments, setObservations] = useState("");

  // JSON de la gestion creada
  const buildPayload = () => {
    return {
      user_id: user?.id,
      payroll_id: selectedPayroll?.id ?? null,
      type_management_id: selectedTypeManagement?.id ?? null,
      contact_id: selectedContact?.id ?? null,
      solution: selectedSolution,
      consultation_id: selectedConsultation?.id ?? null,
      specific_id: selectedSpecificConsultation?.id ?? null,
      wolkvox_id: wolkvox_id ?? null,
      comments,
      monitoring_id: null,
      solution_date: null,
      wsp: wsp ? 1 : 0,
      sms: sms ? 1 : 0,
    };
  };

  // Listas dependiente a la pagaduria
  const filteredTypeManagement = selectedPayroll
  ? typeManagement.filter(
      (item) => item?.payrolls?.id === selectedPayroll?.id
    )
  : typeManagement;

  // Lista de consultas específicas dependiente de la consulta seleccionada
  const filteredSpecific = selectedConsultation
    ? specific.filter(
        (item) => item?.consultation?.id === selectedConsultation?.id
      )
    : specific;


  // Lista de contactos dependiente de la campaña
  const filteredContact = contact.filter((item) => {
    const matchesCampaign = !campaign || item?.campaign === campaign;
    const matchesPayroll = !selectedPayroll || item?.payroll?.id === selectedPayroll.id;
    return matchesCampaign && matchesPayroll;
  });

  //Limpia el formulario
  const handleClear = () => {
    setCampaign("");
    setSelectedPayroll(null);
    setSelectedTypeManagement("");
    setSelectedContact(null);
    setSelectedSolution("");
    setSelectedConsultation(null);
    setSelectedSpecificConsultation(null);
    setObservations("");
    setWolkvox_id("");
    setSms(false);
    setWsp(false);
    setFormData({
      campaign: "",
      payroll: "",
      typemanagement: "",
      solution: "",
    });
  };

  // Guarda la nueva gestion y limpia el formulario
  const onSave = () => {
    const payload = buildPayload();
    console.log("Payload que se manda:", payload);
    handleSubmit(payload); // ahora sí mandas la data
    handleClear();
    navigate("/gestiones/añadir")
  };

  // Detecta espacios y convierte a minuscula todo para hacer la busqueda del campo
  const capitalizeWords = (str) =>
    str
      ? str
          .split(" ")
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(" ")
      : "";

  // UseEffect para detectar la campaña, pagaduria, cliente y wolkvox_id de los parametros del enlace
  useEffect(() => {
    const params = new URLSearchParams(location.search);

    // Campaña
    setCampaign(capitalizeWords(params.get("campaign")));

    // Pagaduría
    const foundPayroll = payroll.find(
      (p) => p.name === capitalizeWords(params.get("payroll"))
    ) || null;
    setSelectedPayroll(foundPayroll);

    // Numero de identificacion del cliente
    const idNumberParam = params.get("identification_number");
    if (idNumberParam) {
      const foundContact = contact.find(
        (c) => c.identification_number === idNumberParam
      ) || null;
      setSelectedContact(foundContact);
    }
    
    setWolkvox_id(capitalizeWords(params.get("wolkvox_id")));

  }, [location.search, payroll, typeManagement, contact]);

 // Ejemplo de enlace con parametros para autocompletar los campos
 // http://localhost:8000/gestiones/a%C3%B1adir?campaign=aliados&payroll=educame&identification_number=12345678&wolkvox_id=8465416524132355456

  return (
    <div className="flex flex-col gap-4 text-secondary-dark px-40 pb-40 ">
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
        {console.log(validationErrors)}

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
      <button className="flex items-center justify-end ml-5" onClick={() => setModal(true)}>
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
          onChange={(value) => {
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
            onChange={(value) => {
              setSelectedContact(value)
              clearValidationError("type_management_id");
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Cliente"
                error={!!validationErrors.type_management_id}
                helperText={validationErrors.type_management_id ? validationErrors.type_management_id[0] : ""}
              />
            )}
          />
        </div>

        {/* Selector de solución en primer contacto */}
        <div className="bg-white shadow-md rounded-lg p-5 flex flex-col gap-3">
          <h2 className="text-xl font-semibold">Solución en el primer contacto</h2>
          <FormControl fullWidth>
            <InputLabel id="solucion-label">Solución</InputLabel>
            <Select
              labelId="solucion-label"
              id="solucion"
              value={selectedSolution}
              label="Solución"
              onChange={(event) => setSelectedSolution(event.target.value)}
            >
              <MenuItem value={true}>Sí</MenuItem>
              <MenuItem value={false}>No</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>
      
    <div className="grid grid-cols-2 gap-4">
      {/* Autocompletado de motivo de consulta */}
      <div className="bg-white shadow-md rounded-lg p-5 flex flex-col gap-3">
        <h2 className="text-xl font-semibold">Motivo de consulta</h2>
        <Autocomplete
          options={consultation}
          getOptionLabel={(option) =>
            `${option?.id || ""} | ${option?.name || ""}`
          }
          value={selectedConsultation}
          onChange={(event, value) => setSelectedConsultation(value)}
          renderInput={(params) => <TextField {...params} label="Consulta" />}
        />
      </div>

      {/* Autocompletado de motivo de consulta específica */}
      <div className="bg-white shadow-md rounded-lg p-5 flex flex-col gap-3">
        <h2 className="text-xl font-semibold">Motivo específico de consulta</h2>
        <Autocomplete
          options={filteredSpecific}
          getOptionLabel={(option) => `${option?.consultation.id || ""} | ${option?.name || ""}`}
          value={selectedSpecificConsultation}
          onChange={(event, value) => setSelectedSpecificConsultation(value)}
          renderInput={(params) => (
            <TextField {...params} label="Consulta específica" />
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
        <div className="flex flex-col">
          <p className="text-xl font-semibold pb-3">Wolkvox_id de la gestión:</p>
            <TextField
              fullWidth
              id="standard-multiline-static"
              disabled
              value={wolkvox_id}
              onChange={(e) => setWolkvox_id(e.target.value)}
              multiline
            />
        </div>
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
        <Dialog onClose={() => setModal(false)} open={modal}  >
          <DialogTitle><p className="mr-12">Descripcion de la pagaduría</p></DialogTitle>
          <button onClick={() => setModal(false)} className="absolute right-10 top-5"> X </button>
          <DialogContent dividers>
            {selectedPayroll?.name ? (
              <h1>{renderDescription(selectedPayroll.description)}</h1>
            ) : (
              <>Seleccione una pagaduria</>
            )}
          </DialogContent>
        </Dialog>

      {/* Snackbar para alertar al agente que hay errores en el formulario */}
        <Snackbar
          open={Object.keys(validationErrors).length > 0}
          autoHideDuration={40000}
          onClose={Object.keys(validationErrors).length < 0}

          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert 
            onClose={() => setSnackbar({ ...snackbar, open: false })}
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