import { useState } from "react";
import axios from "axios";

const useLogin = (onLoginSuccess) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({}); 
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setLoading(true);

        try {
            const response = await axios.post("/api/login", {
                email,
                password,
            });

            if (response.status === 200) {
                localStorage.setItem("token", response.data.token);
                onLoginSuccess(response.data.data);
            }
        } catch (err) {
            if (err.response) {
                if (err.response.status === 422) {
                    setErrors(err.response.data.errors || {}); 
                } else if (err.response.status === 429) {
                    setErrors({ general: err.response.data.message });
                } else if (err.response.status === 403) {
                    setErrors({ general: err.response.data.message });
                } else {
                    setErrors({ general: "El usuario no existe." });
                }
            } else {
                setErrors({ general: "Error de conexión. Inténtalo de nuevo." });
            }
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return {
        email,
        setEmail,
        password,
        setPassword,
        errors,
        loading,
        handleSubmit,
    };
};

export default useLogin;