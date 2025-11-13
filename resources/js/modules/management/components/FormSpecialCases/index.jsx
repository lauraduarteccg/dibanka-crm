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
  Drawer,
  DialogTitle,
  DialogContent,
  FormHelperText,
} from "@mui/material";
import { useSpecialCasesForm } from "@modules/management/hooks/useSpecialCasesForm";

export default function FormSpecialCases({openSpecialCases,setOpenSpecialCases}) {
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
    } = useSpecialCasesForm();


  return (
      <Drawer
        open={openSpecialCases}
        onClose={() => setOpenSpecialCases(false)}
        anchor="right"
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
              onClick={() => setOpenSpecialCases(false)}
            >
              Cancelar
            </Button>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Guardar caso especial
            </Button>
          </div>
        </DialogContent>
        </div>
      </Drawer>
  )
}
