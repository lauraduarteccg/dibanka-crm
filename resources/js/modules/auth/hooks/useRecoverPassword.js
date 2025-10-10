import { useState } from "react";
import { forgotPassword } from "@modules/auth/services/authService";

const useRecoverPassword = (onRecoverSuccess) => {
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
      const response = await forgotPassword(email);

      setSuccessMessage(
        response.message || "Hemos enviado un enlace a tu correo."
      );

      if (onRecoverSuccess) onRecoverSuccess();
    } catch (error) {
      if (error.response?.data) {
        if (error.response.data.errors) setErrors(error.response.data.errors);
        else if (error.response.data.message)
          setErrors({ general: error.response.data.message });
      } else {
        setErrors({ general: "Error de conexión. Inténtalo de nuevo." });
      }
    } finally {
      setLoading(false);
    }
  };

  return { email, setEmail, errors, loading, successMessage, handleSubmit };
};

export default useRecoverPassword;
