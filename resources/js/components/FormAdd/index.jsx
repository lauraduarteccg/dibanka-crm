import React, { useState, forwardRef } from "react";
import Button from "../Button";
import Alert from "@mui/material/Alert";
import * as yup from "yup";
import { Dialog, Slide } from "@mui/material";
import InputWithIcon from "@components/InputWithIcon";
import { GoPerson } from "react-icons/go";
import { FiMail } from "react-icons/fi";
import { MdOutlineLock } from "react-icons/md";

const userSchema = yup.object().shape({
  name: yup.string().required("El nombre es obligatorio").min(6, "Mínimo 6 caracteres"),
  email: yup.string().email("Correo no válido").required("El correo es obligatorio"),
  password: yup.string().min(8, "Debe tener al menos 8 caracteres").required("La contraseña es obligatoria"),
});

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
  validationErrors = {},
}) => {
  const [errors, setErrors] = useState({});

  const validateField = async (field, value) => {
    try {
      await userSchema.validateAt(field, { [field]: value });
      setErrors((prev) => ({ ...prev, [field]: "" }));
    } catch (error) {
      setErrors((prev) => ({ ...prev, [field]: error.message }));
    }
  };

  const handleCloseModal = () => {
    // Asegura que no quede foco dentro antes de cerrar
    if (document.activeElement && typeof document.activeElement.blur === "function") {
      document.activeElement.blur();
    }
    setIsOpen(false);
    setErrors({});
    setFormData({ name: "", email: "", password: "" });
  };

  const titleId = "formadd-title";
  const descId = "formadd-desc";

  return (
    <Dialog
      open={isOpen}
      TransitionComponent={Transition}
      onClose={handleCloseModal}
      keepMounted={false}              // evita modales ocultos montados
      disableEnforceFocus={false}      // mantiene foco dentro del modal
      disableRestoreFocus={false}      // devuelve el foco al cerrar
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descId}
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
          outline: 0,
        },
      }}
    >
      <div className="relative flex flex-col justify-center p-10 w-full text-secondary-dark">
        <button
          type="button"
          aria-label="Cerrar"
          className="absolute right-14 top-10"
          onClick={handleCloseModal}
        >
          <span className="w-8 h-8 font-semibold" aria-hidden="true">×</span>
        </button>

        <h2 id={titleId} className="text-2xl font-bold mb-1">{title}</h2>
        <p id={descId} className="sr-only">Formulario para crear o editar usuario</p>

        <form onSubmit={handleSubmit} noValidate>
          <h3 className="text-lg">Nombre</h3>
          <InputWithIcon
            icon={GoPerson}
            type="text"
            placeholder="Nombre"
            value={formData?.name ?? ""}
            onChange={(e) => {
              const v = e.target.value;
              setFormData({ ...formData, name: v });
              validateField("name", v);
            }}
            disabled={loading}
            autoFocus                 // enfoca al abrir
          />
          {errors.name && <Alert severity="error" className="mt-2">{errors.name}</Alert>}
          {validationErrors.name && <Alert severity="error" className="mt-2">{validationErrors.name[0]}</Alert>}

          <h3 className="mt-5 text-lg">Correo</h3>
          <InputWithIcon
            icon={FiMail}
            type="email"
            placeholder="Correo electrónico"
            value={formData?.email ?? ""}
            onChange={(e) => {
              const v = e.target.value;
              setFormData({ ...formData, email: v });
              validateField("email", v);
            }}
            disabled={loading}
          />
          {errors.email && <Alert severity="error" className="mt-2">{errors.email}</Alert>}
          {validationErrors.email && <Alert severity="error" className="mt-2">{validationErrors.email[0]}</Alert>}

          <h3 className="mt-5 text-lg">Contraseña</h3>
          <InputWithIcon
            icon={MdOutlineLock}
            type="password"
            placeholder="Contraseña"
            value={formData?.password ?? ""}
            onChange={(e) => {
              const v = e.target.value;
              setFormData({ ...formData, password: v });
              validateField("password", v);
            }}
            disabled={loading}
          />
          {errors.password && <Alert severity="error" className="mt-2">{errors.password}</Alert>}
          {validationErrors.password && <Alert severity="error" className="mt-2">{validationErrors.password[0]}</Alert>}

          <div className="mt-6">
            <Button type="submit" text="Guardar" disabled={loading} />
          </div>
        </form>
      </div>
    </Dialog>
  );
};

export default FormAdd;
