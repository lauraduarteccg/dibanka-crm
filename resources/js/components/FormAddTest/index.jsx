import React, { useState, forwardRef } from "react";
import Button from "../Button";
import Alert from "@mui/material/Alert";
import { Dialog, Slide } from "@mui/material";
import InputWithIcon from "@components/InputWithIcon";

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
    schema // ✅ Recibimos el esquema Yup como prop
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
        setFormData(Object.fromEntries(fields.map(f => [f.name, f.type === "checkbox" ? false : ""])));
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
                <button
                    className="absolute right-14 top-10"
                    onClick={handleCloseModal}
                >
                    <h1 className="w-8 h-8 font-semibold">X</h1>
                </button>
                <h2 className="text-2xl font-bold mb-4">{formData?.id ? "Editar" : "Agregar"} {title}</h2>

                <form onSubmit={handleSubmit}>
                    {fields.map((field) => {
                        // ❌ Ocultar "type" si estamos editando
                        if (formData?.id && field.name === "is_active") {
                            return null;
                        }

                        return (
                            <div key={field.name} className="mb-4">
                                <h2 className="text-lg">{field.label}</h2>

                                {/* ✅ Render dinámico según tipo */}
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
                                ) : (
                                    <InputWithIcon
                                        icon={field.icon}
                                        type={field.type}
                                        placeholder={field.label}
                                        value={formData[field.name] || ""}
                                        onChange={(e) => {
                                            setFormData({ ...formData, [field.name]: e.target.value });
                                            validateField(field.name, e.target.value);
                                        }}
                                        disabled={loading}
                                    />
                                )}

                                {/* ✅ Errores */}
                                {errors[field.name] && (
                                    <Alert severity="error" className="mt-2">{errors[field.name]}</Alert>
                                )}
                                {validationErrors[field.name] && (
                                    <Alert severity="error" className="mt-2">{validationErrors[field.name][0]}</Alert>
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
