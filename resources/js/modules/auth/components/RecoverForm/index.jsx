import React from "react";
import { FiMail } from "react-icons/fi";
import Button from "@components/ui/Button";
import useRecoverPassword from "@modules/auth/hooks/useRecoverPassword";

const RecoverForm = ({ onRecoverSuccess }) => {
  const {
    email,
    setEmail,
    errors,
    loading,
    successMessage,
    handleSubmit,
  } = useRecoverPassword(onRecoverSuccess);

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
        <div
          className={`flex items-center border rounded-md px-4 py-2 ${
            errors.email ? "border-red-500" : ""
          }`}
        >
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
