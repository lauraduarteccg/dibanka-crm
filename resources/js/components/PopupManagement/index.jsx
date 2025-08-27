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
  payroll = [], 
  typeManagement = [],
  contact = [],
  consultation = [],
  onClick = null,
}) {
  const [afiliados_aliados, setAfiliados_aliados] = useState("");
  const [selectedPayroll, setSelectedPayroll] = useState(null); 
  const [selectedTypeManagement, setSelectedTypeManagement] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [selectedSolution, setSelectedSolution] = useState(""); // '' | true | false
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [selectedSpecificConsultation, setSelectedSpecificConsultation] =
    useState(null);
  const [observations, setObservations] = useState("");
  const [filteredTypeManagement, setFilteredTypeManagement] =
    useState(typeManagement);

  useEffect(() => {
    if (!selectedPayroll) {
      setFilteredTypeManagement(typeManagement);
      return;
    }

    const filtered = typeManagement.filter((tm) =>
      (tm.payroll_array || []).some((c) => c.id === selectedPayroll.id)
    );

    setFilteredTypeManagement(filtered);

    if (
      selectedTypeManagement &&
      !filtered.some((t) => t.id === selectedTypeManagement.id)
    ) {
      setSelectedTypeManagement(null);
    }
  }, [selectedPayroll, typeManagement, selectedTypeManagement]);

  useEffect(() => {
    const apiValue = 0;
    if (apiValue === 10) setAfiliados_aliados("Aliados");
    else if (apiValue === 20) setAfiliados_aliados("Afiliados");
    else setAfiliados_aliados("");
  }, []);

  useEffect(() => {
    const apiValue = 0;
    if (apiValue === 10) setSelectedSolution(true);
    else if (apiValue === 20) setSelectedSolution(false);
    else setSelectedSolution("");
  }, []);

  const resetForm = () => {
    setAfiliados_aliados("");
    setSelectedPayroll(null);
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
    if (!selectedPayroll) {
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

    const solucion_normalizada =
      selectedSolution === "" ? null : Boolean(selectedSolution);

    const payload = {
      Pagaduría: afiliados_aliados || null,
      payroll_id: selectedPayroll?.id ?? null, 
      type_management_id: selectedTypeManagement?.id ?? null,
      contact_id: selectedContact?.id ?? null,
      consultation_id: selectedConsultation?.id ?? null,
      specific_consultation_id: selectedSpecificConsultation?.id ?? null,
      solucion_primer_contacto: solucion_normalizada,
      observations: observations?.trim() || null,
    };

    try {
      if (onClick && typeof onClick === "function") {
        const maybePromise = onClick(payload);
        if (maybePromise && typeof maybePromise.then === "function") {
          await maybePromise;
        }
      } else {
        await axios.post("/api/managements", payload);
      }

      Swal.fire({
        title: "Guardado",
        text: "La gestión se registró correctamente.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      resetForm();
      onClose();
    } catch (error) {
      console.error("Error guardando gestión:", error);
      const message =
        error.response?.data?.message ||
        error.message ||
        "No se pudo guardar la gestión.";
      if (error.response?.status === 422 && error.response.data?.errors) {
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

        {/* Selector de pagaduria */}
        <div className="bg-white shadow-md rounded-lg p-5 flex flex-col gap-3">
          <h2 className="text-xl font-semibold">Pagaduría</h2>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Pagaduría</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={afiliados_aliados}
              label="Pagaduría"
              onChange={(event) => setAfiliados_aliados(event.target.value)}
            >
              <MenuItem value={"Aliados"}>Aliados</MenuItem>
              <MenuItem value={"Afiliados"}>Afiliados</MenuItem>
            </Select>
          </FormControl>
        </div>

        {/* Autocompletado de Pagaduría */}
        <div className="bg-white shadow-md rounded-lg p-5 flex flex-col gap-3">
          <h2 className="text-xl font-semibold">Pagaduría</h2>
          <Autocomplete
            options={payroll}
            getOptionLabel={(option) => option.name}
            value={selectedPayroll}
            onChange={(event, value) => {
              setSelectedPayroll(value);
            }}
            renderInput={(params) => <TextField {...params} label="Pagaduría" />}
          />
        </div>

        {/* Autocompletado de Tipo de gestión */}
        <div className="bg-white shadow-md rounded-lg p-5 flex flex-col gap-3">
          <h2 className="text-xl font-semibold">Tipo de gestión</h2>
          <Autocomplete
            options={filteredTypeManagement}
            getOptionLabel={(option) => option.name}
            value={selectedTypeManagement}
            onChange={(event, value) => {
              setSelectedTypeManagement(value);
            }}
            renderInput={(params) => (
              <TextField {...params} label="Tipo de gestión" />
            )}
          />
        </div>

        {/* Autocompletado de Cliente/Contacto */}
        <div className="bg-white shadow-md rounded-lg p-5 flex flex-col gap-3">
          <h2 className="text-xl font-semibold">Información del cliente</h2>
          <Autocomplete
            options={contact}
            getOptionLabel={(option) =>
              option?.identification_number + " | " + option?.name
            }
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
              Tipo de identificación:{" "}
              <span>{selectedContact?.identification_type ?? "—"}</span>
            </h3>
            <h3>
              Número de identificación:{" "}
              <span>{selectedContact?.identification_number ?? "—"}</span>
            </h3>
          </div>
        </div>

        {/* Selector de solución en primer contacto */}
        <div className="bg-white shadow-md rounded-lg p-5 flex flex-col gap-3">
          <h2 className="text-xl font-semibold">
            Solución en el primer contacto{" "}
          </h2>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Solución</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectedSolution}
              label="Pagaduría"
              onChange={(event) => setSelectedSolution(event.target.value)}
            >
              <MenuItem value={true}>Sí</MenuItem>
              <MenuItem value={false}>No</MenuItem>
            </Select>
          </FormControl>
        </div>

        {/* Autocompletado de motivo de consulta */}
        <div className="bg-white shadow-md rounded-lg p-5 flex flex-col gap-3">
          <h2 className="text-xl font-semibold">Motivo de consulta</h2>
          <Autocomplete
            options={consultation}
            getOptionLabel={(option) =>
              option?.id + " | " + option?.reason_consultation
            }
            value={selectedConsultation}
            onChange={(event, value) => {
              setSelectedConsultation(value);
            }}
            renderInput={(params) => <TextField {...params} label="Consulta" />}
          />
        </div>

        {/* Autocompletado de motivo de consulta específica */}
        <div className="bg-white shadow-md rounded-lg p-5 flex flex-col gap-3">
          <h2 className="text-xl font-semibold">Motivo específico de consulta</h2>
          <Autocomplete
            options={consultation}
            getOptionLabel={(option) => option?.id + " | " + option?.specific_reason}
            value={selectedSpecificConsultation}
            onChange={(event, value) => {
              setSelectedSpecificConsultation(value);
            }}
            renderInput={(params) => (
              <TextField {...params} label="Consulta específica" />
            )}
          />
        </div>

        {/* Observaciones */}
        <div className="bg-white shadow-md rounded-lg p-5 flex flex-col gap-3">
          <h2 className="text-xl font-semibold">Observaciones</h2>
          <TextField
            id="standard-multiline-static"
            label="Escriba aquí"
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
