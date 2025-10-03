import React, { useState, useContext, useEffect } from "react";
import LoginForm from "@components/forms/LoginForm";
import RecoverForm from "@components/forms/RecoverForm";
import { AuthContext } from "@context/AuthContext";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
    const { user, setUser } = useContext(AuthContext);
    const [showRecover, setShowRecover] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        if (user) {
            navigate("/home");
        }
    }, [user, navigate]);

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
            <div className="relative w-full max-w-4xl h-[500px] bg-white rounded-lg shadow-2xl overflow-hidden flex transition-all duration-500 ease-in-out">
                <div className="w-1/2 h-full flex flex-col items-center justify-center transition-transform duration-500 ease-in-out px-6">
                    {!showRecover ? (
                        <>
                            <LoginForm
                                onLoginSuccess={(user) => {
                                    setUser(user);
                                    navigate("/home");
                                }}
                            />
                            <div className="flex gap-4 mt-4 w-full justify-end">
                                <a
                                    className="text-sm text-gray-500 cursor-pointer hover:text-primary-accent"
                                    onClick={() => setShowRecover(true)}
                                >
                                  Recuperar contraseña
                                </a>
                            </div>
                        </>
                    ) : (
                        <>
                            <RecoverForm
                                onRecoverSucess={() => {
                                    setShowRecover(false);
                                }}
                            />
                            <div className="flex gap-4 mt-4 w-full justify-end">
                                <a
                                    className="text-sm text-gray-500 cursor-pointer hover:text-purple-mid"
                                    onClick={() => setShowRecover(false)}
                                >
                                    ← Volver a iniciar sesión
                                </a>
                            </div>
                        </>
                    )}
                </div>

                <div
                    className={`w-1/2 h-full flex items-center justify-center transition-all 
                duration-500 ease-in-out text-white p-6 t rounded-l-[250px] ${
                    showRecover ? "bg-purple-mid" : "bg-primary-light"
                }`}
                >
                    <div className="text-center text-white p-8">
                        <h3 className="text-2xl font-bold mb-2">
                            {showRecover ? "Recupera tu acceso" : "Bienvenido"}
                        </h3>
                        <p className="text-sm">
                            {showRecover
                                ? "Te enviaremos un enlace para restablecer la contraseña"
                                : ""}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
