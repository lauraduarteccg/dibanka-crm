import { FiMail, FiLock } from "react-icons/fi";
import Button from "@components/ui/Button";
import useLogin from "./useLogin"; // Importamos el hook

const LoginForm = ({ onLoginSuccess }) => {
    const {
        email,
        setEmail,
        password,
        setPassword,
        errors,
        loading,
        handleSubmit,
    } = useLogin(onLoginSuccess);

    return (
        <div className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-2 text-primary-accent">
                Iniciar sesión
            </h2>
            <span className="text-sm text-gray-500">
                Use su correo y contraseña
            </span>

            {errors.general && (
                <p className="text-red-500 mt-2">{errors.general}</p>
            )}

            <form className="mt-4" onSubmit={handleSubmit}>
                <div className="flex items-center border rounded-md px-4 py-2">
                    <FiMail className="text-secondary-dark mr-2" />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Correo"
                        className="w-full focus:outline-none"
                        required
                    />
                </div>
                {errors.email &&
                    errors.email.map((errorMsg, index) => (
                        <p key={index} className="text-red-500 text-sm mt-1">
                            {errorMsg}
                        </p>
                    ))}

                <div className="flex items-center border rounded-md px-4 py-2 mt-2">
                    <FiLock className="text-secondary-dark mr-2" />
                    <input
                        type="password"
                        autoComplete="on"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Contraseña"
                        className="w-full focus:outline-none"
                        required
                    />
                </div>
                {errors.password &&
                    errors.password.map((errorMsg, index) => (
                        <p key={index} className="text-red-500 text-sm mt-1">
                            {errorMsg}
                        </p>
                    ))}
         
                <Button
                    text={loading ? "Cargando..." : "Iniciar Sesión"}
                    type="submit"
                    className="mt-2 w-full"
                    disabled={loading}
                />
            </form>
        </div>
    );
};

export default LoginForm;
