import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import { TiContacts } from "react-icons/ti";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import Swal from "sweetalert2";
import axios from "axios";

export default function PopupManagement({
  open,
  onClose,
  campaign = [],
  typeManagement = [],
  contact = [],
  consultation = [],
  onClick = null, // opcional: si el padre quiere manejar el envío
}) {
  const [afiliados_aliados, setAfiliados_aliados] = useState("");
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [selectedTypeManagement, setSelectedTypeManagement] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [selectedSolution, setSelectedSolution] = useState(""); // '' | true | false
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [selectedSpecificConsultation, setSelectedSpecificConsultation] = useState(null);
  const [observations, setObservations] = useState("");

  useEffect(() => {
    const apiValue = 0;
    if (apiValue === 10) setAfiliados_aliados("Aliados");
    else if (apiValue === 20) setAfiliados_aliados("Afiliados");
    else setAfiliados_aliados("");
  }, []);

  useEffect(() => {
    const apiValue = 0; // 10 => true, 20 => false, otro => ''
    if (apiValue === 10) setSelectedSolution(true);
    else if (apiValue === 20) setSelectedSolution(false);
    else setSelectedSolution("");
  }, []);

  const resetForm = () => {
    setAfiliados_aliados("");
    setSelectedCampaign(null);
    setSelectedContact(null);
    setSelectedTypeManagement(null);
    setSelectedSolution("");
    setSelectedConsultation(null);
    setSelectedSpecificConsultation(null);
    setObservations("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validateBeforeSend = () => {
    // Reglas mínimas: campaña, tipo gestión, contacto y motivo de consulta (ajusta según negocio)
    if (!selectedCampaign) {
      Swal.fire("Falta información", "Selecciona la pagaduría.", "warning");
      return false;
    }
    if (!selectedTypeManagement) {
      Swal.fire("Falta información", "Selecciona el tipo de gestión.", "warning");
      return false;
    }
    if (!selectedContact) {
      Swal.fire("Falta información", "Selecciona el contacto/cliente.", "warning");
      return false;
    }
    if (!selectedConsultation) {
      Swal.fire("Falta información", "Selecciona el motivo de la consulta.", "warning");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateBeforeSend()) return;

    // Normalizar selectedSolution a null|true|false
    const solucion_normalizada =
      selectedSolution === "" ? null : Boolean(selectedSolution);

    // Construimos payload con IDs planos que tu backend normalmente espera
    const payload = {
      // campo extra (opcional) que tenías en UI (Aliados/Afiliados)
      campaña: afiliados_aliados || null,

      // IDs planos
      campaign_id: selectedCampaign?.id ?? null,
      type_management_id: selectedTypeManagement?.id ?? null,
      contact_id: selectedContact?.id ?? null,
      consultation_id: selectedConsultation?.id ?? null,
      specific_consultation_id: selectedSpecificConsultation?.id ?? null,

      // solución y observaciones
      solucion_primer_contacto: solucion_normalizada, // null | true | false
      observations: observations?.trim() || null,
    };

    try {
      if (onClick && typeof onClick === "function") {
        // si el padre quiere manejar el envío, le pasamos el payload
        const maybePromise = onClick(payload);
        if (maybePromise && typeof maybePromise.then === "function") {
          await maybePromise;
        }
      } else {
        // por defecto hacemos POST directo
        // Ajusta la ruta si tu backend usa otra (por ejemplo '/api/management' o '/api/gestions')
        await axios.post("/api/managements", payload);
      }

      Swal.fire({
        title: "Guardado",
        text: "La gestión se registró correctamente.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      // Reiniciar y cerrar
      resetForm();
      onClose();
    } catch (error) {
      console.error("Error guardando gestión:", error);
      const message =
        error.response?.data?.message ||
        error.message ||
        "No se pudo guardar la gestión.";
      // Si el backend devuelve errores de validación (422) puedes mapearlos aquí
      if (error.response?.status === 422 && error.response.data?.errors) {
        // ejemplo: mostrar primer error
        const firstKey = Object.keys(error.response.data.errors)[0];
        const firstMessage = error.response.data.errors[firstKey][0];
        Swal.fire("Error de validación", firstMessage, "error");
      } else {
        Swal.fire("Error", message, "error");
      }
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={false}
      PaperProps={{
        sx: {
          backgroundColor: "#f3f3f3",
          width: 1000,
          height: 1000,
          padding: 3,
          borderRadius: 3,
        },
      }}
    >
      <div className="flex flex-col gap-4 text-secondary-dark px-20 pb-40 ">
        {/* Título */}
        <div className="flex justify-between items-center">
          <h1 className="flex justify-center items-center gap-3 text-2xl font-semibold">
            <TiContacts className="w-9 h-auto" /> Agregar Gestión
          </h1>
          <button
            onClick={onClose}
            className=" text-gray-500 hover:text-gray-800 font-semibold"
          >
            ✕
          </button>
        </div>
        <div className="h-0.5 bg-gray-300 rounded"></div>

        {/* Selector de campaña */}
        <div className="bg-white shadow-md rounded-lg p-5 flex flex-col gap-3">
          <h2 className="text-xl font-semibold">Campaña</h2>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Campaña</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={afiliados_aliados}
              label="Campaña"
              onChange={(event) => setAfiliados_aliados(event.target.value)}
            >
              <MenuItem value={"Aliados"}>Aliados</MenuItem>
              <MenuItem value={"Afiliados"}>Afiliados</MenuItem>
            </Select>
          </FormControl>
        </div>

        {/* Autocompletado de Pagaduria */}
        <div className="bg-white shadow-md rounded-lg p-5 flex flex-col gap-3">
          <h2 className="text-xl font-semibold">Pagaduria</h2>
          <Autocomplete
            options={campaign}
            getOptionLabel={(option) => option.name}
            value={selectedCampaign}
            onChange={(event, value) => {
              setSelectedCampaign(value);
            }}
            renderInput={(params) => <TextField {...params} label="Pagaduria" />}
          />
        </div>

        {/*Autocompletado de Tipo de gestión */}
        <div className="bg-white shadow-md rounded-lg p-5 flex flex-col gap-3">
          <h2 className="text-xl font-semibold">Tipo de gestión</h2>
          <Autocomplete
            options={typeManagement}
            getOptionLabel={(option) => option.name}
            value={selectedTypeManagement}
            onChange={(event, value) => {
              setSelectedTypeManagement(value);
            }}
            renderInput={(params) => <TextField {...params} label="Tipo de gestion" />}
          />
        </div>

        {/*Autocompletado de Cliente/Contacto */}
        <div className="bg-white shadow-md rounded-lg p-5 flex flex-col gap-3">
          <h2 className="text-xl font-semibold">Información del cliente</h2>
          <Autocomplete
            options={contact}
            getOptionLabel={(option) => option?.identification_number + " | " + option?.name}
            value={selectedContact}
            onChange={(event, value) => {
              setSelectedContact(value);
            }}
            renderInput={(params) => <TextField {...params} label="Contacto" />}
          />
          <div>
            <h3>
              Nombre: <span>{selectedContact?.name ?? "—"}</span>
            </h3>
            <h3>
              Correo: <span>{selectedContact?.email ?? "—"}</span>
            </h3>
            <h3>
              Teléfono: <span>{selectedContact?.phone ?? "—"}</span>
            </h3>
            <h3>
              Celular actualizado: <span>{selectedContact?.update_phone ?? "—"}</span>
            </h3>
            <h3>
              Tipo de identificación: <span>{selectedContact?.identification_type ?? "—"}</span>
            </h3>
            <h3>
              Número de identificación: <span>{selectedContact?.identification_number ?? "—"}</span>
            </h3>
          </div>
        </div>

        {/* Selector de solucion en primer contacto */}
        <div className="bg-white shadow-md rounded-lg p-5 flex flex-col gap-3">
          <h2 className="text-xl font-semibold">Solución en el primer contacto </h2>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Solución</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectedSolution}
              label="Campaña"
              onChange={(event) => setSelectedSolution(event.target.value)}
            >
              <MenuItem value={true}>Sí</MenuItem>
              <MenuItem value={false}>No</MenuItem>
            </Select>
          </FormControl>
        </div>

        {/*Autocompletado de motivo de consulta */}
        <div className="bg-white shadow-md rounded-lg p-5 flex flex-col gap-3">
          <h2 className="text-xl font-semibold">Motivo de consulta</h2>
          <Autocomplete
            options={consultation}
            getOptionLabel={(option) => option?.id + " | " + option?.reason_consultation}
            value={selectedConsultation}
            onChange={(event, value) => {
              setSelectedConsultation(value);
            }}
            renderInput={(params) => <TextField {...params} label="Consulta" />}
          />
        </div>

        {/*Autocompletado de motivo de consulta especifica */}
        <div className="bg-white shadow-md rounded-lg p-5 flex flex-col gap-3">
          <h2 className="text-xl font-semibold">Motivo especifico de consulta</h2>
          <Autocomplete
            options={consultation}
            getOptionLabel={(option) => option?.id + " | " + option?.specific_reason}
            value={selectedSpecificConsultation}
            onChange={(event, value) => {
              setSelectedSpecificConsultation(value);
            }}
            renderInput={(params) => <TextField {...params} label="Consulta especifica" />}
          />
        </div>

        {/*Observaciones */}
        <div className="bg-white shadow-md rounded-lg p-5 flex flex-col gap-3">
          <h2 className="text-xl font-semibold">Observaciones</h2>
          <TextField
            id="standard-multiline-static"
            label="Escriba aqui"
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
            multiline
            rows={4}
          />
        </div>

        <div className="flex items-center justify-center mt-10">
          <Button variant="contained" onClick={handleSave}>
            Guardar
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
