import React, { useState } from "react";
import { FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import Button from "@components/ui/Button";
import useResetPassword from "@modules/auth/hooks/useResetPassword";

const ResetPasswordForm = ({ onResetSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const {
    password,
    setPassword,
    passwordConfirm,
    setPasswordConfirm,
    errors,
    loading,
    successMessage,
    handleSubmit,
  } = useResetPassword(onResetSuccess);

  return (
    <div className="p-8 text-center">
      <h2 className="text-2xl font-bold mb-2 text-purple-mid">
        Restablecer contraseña
      </h2>
      <span className="text-sm text-gray-500">Ingresa tu nueva contraseña</span>

      {errors.general &&
        errors.general.map((msg, i) => (
          <p key={i} className="text-red-500 mt-2">
            {msg}
          </p>
        ))}

      {successMessage && (
        <p className="text-green-600 mt-2">{successMessage}</p>
      )}

      <form className="mt-4" onSubmit={handleSubmit}>
        {/* Nueva contraseña */}
        <div
          className={`flex items-center border rounded-md px-4 py-2 ${
            errors.password ? "border-red-500" : ""
          }`}
        >
          <FiLock className="text-secondary-dark mr-2" />
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Nueva contraseña"
            className="w-full focus:outline-none disabled:bg-gray-100"
            required
            disabled={loading}
          />
          <button
            type="button"
            className="ml-2 text-gray-500 focus:outline-none"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>
        {errors.password &&
          errors.password.map((msg, i) => (
            <p key={i} className="text-red-500 text-sm mt-1">
              {msg}
            </p>
          ))}

        {/* Confirmar contraseña */}
        <div
          className={`flex items-center border rounded-md px-4 py-2 mt-3 ${
            errors.confirm ? "border-red-500" : ""
          }`}
        >
          <FiLock className="text-secondary-dark mr-2" />
          <input
            type={showPasswordConfirm ? "text" : "password"}
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            placeholder="Confirmar contraseña"
            className="w-full focus:outline-none disabled:bg-gray-100"
            required
            disabled={loading}
          />
          <button
            type="button"
            className="ml-2 text-gray-500 focus:outline-none"
            onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
          >
            {showPasswordConfirm ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>
        {errors.confirm &&
          errors.confirm.map((msg, i) => (
            <p key={i} className="text-red-500 text-sm mt-1">
              {msg}
            </p>
          ))}

        {/* Errores de token/email */}
        {errors.token &&
          errors.token.map((msg, i) => (
            <p key={i} className="text-red-500 text-sm mt-1">
              {msg}
            </p>
          ))}
        {errors.email &&
          errors.email.map((msg, i) => (
            <p key={i} className="text-red-500 text-sm mt-1">
              {msg}
            </p>
          ))}

        <Button
          text={loading ? "Cargando..." : "Cambiar contraseña"}
          type="submit"
          color="bg-purple-mid"
          className="mt-3 w-full"
          disabled={loading}
        />
      </form>
    </div>
  );
};

export default ResetPasswordForm;
