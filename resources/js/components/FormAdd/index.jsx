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

const FormAdd = ({ isOpen, setIsOpen, title, formData, setFormData, handleSubmit, loading, validationErrors }) => {
    const [errors, setErrors] = useState({});

    const validateField = async (field, value) => {
        try {
            await userSchema.validateAt(field, { [field]: value });
            setErrors((prevErrors) => ({ ...prevErrors, [field]: "" }));
        } catch (error) {
            setErrors((prevErrors) => ({ ...prevErrors, [field]: error.message }));
        }
    };

    const handleCloseModal = () => {
        setIsOpen(false);
        setErrors({});
        setFormData({ name: "", email: "", password: "" });
    };

    return (
        <Dialog
            open={isOpen}
            TransitionComponent={Transition}
            onClose={(event, reason) => {
                if (reason !== "backdropClick") {
                    handleCloseModal();
                }
            }}
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
                <h2 className="text-2xl font-bold mb-4">{title}</h2>

                <form onSubmit={handleSubmit}>
                    <h2 className="text-lg">Nombre</h2>
                    <InputWithIcon
                        icon={GoPerson}
                        type="text"
                        placeholder="Nombre"
                        value={formData.name}
                        onChange={(e) => {
                            setFormData({ ...formData, name: e.target.value });
                            validateField("name", e.target.value);
                        }}
                        disabled={loading}
                    />
                    {errors.name && <Alert severity="error" className="mt-2">{errors.name}</Alert>}
                    {validationErrors.name && <Alert severity="error" className="mt-2">{validationErrors.name[0]}</Alert>}

                    <h2 className="mt-5 text-lg">Correo</h2>
                    <InputWithIcon
                        icon={FiMail}
                        type="email"
                        placeholder="Correo electrónico"
                        value={formData.email}
                        onChange={(e) => {
                            setFormData({ ...formData, email: e.target.value });
                            validateField("email", e.target.value);
                        }}
                        disabled={loading}
                    />
                    {errors.email && <Alert severity="error" className="mt-2">{errors.email}</Alert>}
                    {validationErrors.email && <Alert severity="error" className="mt-2">{validationErrors.email[0]}</Alert>}

                    <h2 className="mt-5 text-lg">Contraseña</h2>
                    <InputWithIcon
                        icon={MdOutlineLock}
                        type="password"
                        placeholder="Contraseña"
                        value={formData.password}
                        onChange={(e) => {
                            setFormData({ ...formData, password: e.target.value });
                            validateField("password", e.target.value);
                        }}
                        disabled={loading}
                    />
                    {errors.password && <Alert severity="error" className="mt-2">{errors.password}</Alert>}
                    {validationErrors.password && <Alert severity="error" className="mt-2">{validationErrors.password[0]}</Alert>}

                    <Button type="submit" text="Guardar" disabled={loading} />
                </form>
            </div>
        </Dialog>
    );
};

export default FormAdd;
