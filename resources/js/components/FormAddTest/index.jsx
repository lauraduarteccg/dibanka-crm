import React, { useState, forwardRef } from "react";
import Button from "../Button";
import Alert from "@mui/material/Alert";
import { Dialog, Slide } from "@mui/material";
import InputWithIcon from "@components/InputWithIcon";
import { Autocomplete, TextField } from "@mui/material";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const FormAdd = ({
  isOpen,
  setIsOpen,
  title,
  formData,
  setFormData,
  handleSubmit,
  loading,
  validationErrors,
  fields,
  schema,
  checklist,
  selectedChecklist,
  setSelectedChecklist, // <-- lo recibimos ahora
}) => {
  const [errors, setErrors] = useState({});

  // ✅ Validación dinámica usando el esquema recibido
  const validateField = async (field, value) => {
    if (!schema) return;
    try {
      await schema.validateAt(field, { [field]: value });
      setErrors((prevErrors) => ({ ...prevErrors, [field]: "" }));
    } catch (error) {
      setErrors((prevErrors) => ({ ...prevErrors, [field]: error.message }));
    }
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setErrors({});
    // Reset a estado consistente — adapta si tienes más campos persistentes
    setFormData({ id: null, reason_consultation: "", specific_reason: [], is_active: true });
    if (typeof setSelectedChecklist === "function") setSelectedChecklist([]);
  };

  // --- Helpers para checklist: normalizar selectedChecklist a objetos para Autocomplete.value
  const checklistArray = Array.isArray(checklist) ? checklist : [];

  const selectedChecklistObjects = Array.isArray(selectedChecklist)
    ? selectedChecklist.map((item) => {
        // si ya es objeto con id/name
        if (item && typeof item === "object") {
          // puede venir { id, name } o { label, value } o { id, specific_reason }
          const id = item.id ?? item.value;
          const found = checklistArray.find((c) => c.id === id || String(c.id) === String(id));
          if (found) return found;
          // si no encontramos, devolver un objeto compatible
          return { id: id, name: item.name ?? item.label ?? item.specific_reason ?? String(id) };
        }

        // si viene como id (number or string)
        const found = checklistArray.find((c) => String(c.id) === String(item));
        if (found) return found;
        return { id: item, name: String(item) };
      })
    : [];

  // onChange handler: recibe array de objetos (opciones). Guardamos ids en formData y le pasamos ids al padre.
  const onChecklistChange = (event, newValue) => {
    // newValue = [{...}, {...}]
    const ids = Array.isArray(newValue) ? newValue.map((v) => v?.id ?? v) : [];
    // Actualizamos el formData con ids en specific_reason
    setFormData((prev) => ({ ...prev, specific_reason: ids }));
    // También notificamos al padre
    if (typeof setSelectedChecklist === "function") {
      setSelectedChecklist(ids);
    }
  };

  return (
    <Dialog
      open={isOpen}
      TransitionComponent={Transition}
      onClose={handleCloseModal}
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
        <button className="absolute right-14 top-10" onClick={handleCloseModal}>
          <h1 className="w-8 h-8 font-semibold">X</h1>
        </button>

        <h2 className="text-2xl font-bold mb-4">
          {formData?.id ? "Editar" : "Agregar"} {title}
        </h2>

        <form onSubmit={handleSubmit}>
          {fields.map((field) => {
            // ❌ Ocultar "is_active" si estamos editando (igual que antes)
            if (formData?.id && field.name === "is_active") {
              return null;
            }

            return (
              <div key={field.name} className="mb-4">
                <h2 className="text-lg">{field.label}</h2>

                {/* Render dinámico según tipo */}
                {field.type === "checkbox" ? (
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={!!formData[field.name]}
                      onChange={(e) => {
                        const value = e.target.checked;
                        setFormData({ ...formData, [field.name]: value });
                        validateField(field.name, value);
                      }}
                      disabled={loading}
                    />
                    <span>{field.label}</span>
                  </label>
                ) : field.type === "boolean-select" ? (
                  <select
                    className="border rounded p-2 w-full"
                    value={formData[field.name] ? "true" : "false"}
                    onChange={(e) => {
                      const value = e.target.value === "true";
                      setFormData({ ...formData, [field.name]: value });
                      validateField(field.name, value);
                    }}
                    disabled={loading}
                  >
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                  </select>
                ) : field.type === "checklist" ? (
                  <Autocomplete
                    multiple
                    id={`autocomplete-${field.name}`}
                    options={checklistArray}
                    // Autocomplete espera los objetos completos para mostrar label
                    value={selectedChecklistObjects}
                    getOptionLabel={(option) =>
                      option?.name ?? option?.specific_reason ?? String(option ?? "")
                    }
                    isOptionEqualToValue={(option, value) => {
                      return String(option?.id ?? option) === String(value?.id ?? value);
                    }}
                    onChange={onChecklistChange}
                    renderInput={(params) => (
                      <TextField {...params} variant="standard" placeholder={field.label} />
                    )}
                  />
                ) : (
                  <InputWithIcon
                    icon={field.icon}
                    type={field.type}
                    placeholder={field.label}
                    value={formData[field.name] ?? ""}
                    onChange={(e) => {
                      setFormData({ ...formData, [field.name]: e.target.value });
                      validateField(field.name, e.target.value);
                    }}
                    disabled={loading}
                  />
                )}

                {/* Errores */}
                {errors[field.name] && (
                  <Alert severity="error" className="mt-2">
                    {errors[field.name]}
                  </Alert>
                )}
                {validationErrors[field.name] && (
                  <Alert severity="error" className="mt-2">
                    {validationErrors[field.name][0]}
                  </Alert>
                )}
              </div>
            );
          })}

          <Button type="submit" text="Guardar" disabled={loading} />
        </form>
      </div>
    </Dialog>
  );
};

export default FormAdd;
