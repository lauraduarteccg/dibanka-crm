import React, { useState } from "react";
import { FiMail } from "react-icons/fi";
import Button from "@components/ui/Button";
import axios from "axios";

const RecoverForm = ({ onRecoverSuccess }) => {
    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setSuccessMessage("");
        setLoading(true);

        try {
            const response = await axios.post("/api/forgot-password", { email });

            if (response.status === 200) {
                setSuccessMessage(response.data.message || "Se ha enviado un enlace a tu correo.");
                if (onRecoverSuccess) onRecoverSuccess(); 
            }
        } catch (error) {
            if (error.response?.data) {
                if (error.response.data.errors) {
                    setErrors(error.response.data.errors);
                } else if (error.response.data.message) {
                    setErrors({ general: error.response.data.message });
                }
            } else {
                setErrors({ general: "Error de conexión. Inténtalo de nuevo." });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-2 text-purple-mid">
                Recuperar contraseña
            </h2>
            <span className="text-sm text-gray-500">Ingrese su correo</span>

            {errors.general && (
                <p className="text-red-500 mt-2">{errors.general}</p>
            )}
            {successMessage && (
                <p className="text-green-600 mt-2">{successMessage}</p>
            )}

            <form className="mt-4" onSubmit={handleSubmit}>
                <div className={`flex items-center border rounded-md px-4 py-2 ${errors.email ? "border-red-500" : ""}`}>
                    <FiMail className="text-secondary-dark mr-2" />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Correo"
                        className="w-full focus:outline-none disabled:bg-gray-100"
                        required
                        disabled={loading}
                    />
                </div>
                {errors.email &&
                    errors.email.map((errorMsg, index) => (
                        <p key={index} className="text-red-500 text-sm mt-1">
                            {errorMsg}
                        </p>
                    ))}

                <Button
                    text={loading ? "Cargando..." : "Recuperar contraseña"}
                    type="submit"
                    color="bg-purple-mid"
                    className="mt-3 w-full"
                    disabled={loading}
                />
            </form>
        </div>
    );
};

export default RecoverForm;
