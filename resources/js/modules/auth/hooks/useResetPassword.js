import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { resetPassword } from "@modules/auth/services/authService";

const useResetPassword = (onResetSuccess) => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage("");
    setLoading(true);

    if (password !== passwordConfirm) {
      setErrors({ confirm: ["Las contraseñas no coinciden."] });
      setLoading(false);
      return;
    }

    try {
      const response = await resetPassword({
        token,
        email,
        password,
        password_confirmation: passwordConfirm,
      });

      setSuccessMessage(
        response.message || "Tu contraseña ha sido restablecida correctamente."
      );

      if (onResetSuccess) onResetSuccess();
    } catch (error) {
      if (error.response?.data) {
        if (error.response.data.errors) setErrors(error.response.data.errors);
        else if (error.response.data.message)
          setErrors({ general: [error.response.data.message] });
      } else {
        setErrors({ general: ["Error de conexión. Inténtalo de nuevo."] });
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    password,
    setPassword,
    passwordConfirm,
    setPasswordConfirm,
    errors,
    loading,
    successMessage,
    handleSubmit,
  };
};

export default useResetPassword;
