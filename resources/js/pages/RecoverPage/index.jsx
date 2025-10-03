import React, { useState, useContext, useEffect } from "react";

import ResetPasswordForm from "@components/forms/ResetPasswordForm";

import { AuthContext } from "@context/AuthContext";
import { useNavigate } from "react-router-dom";

const RecoverPage = () => {
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
            <div
                className="relative w-full max-w-4xl h-[500px] bg-white rounded-lg shadow-2xl 
            overflow-hidden flex transition-all duration-500 ease-in-out"
            >
                <div
                    className="w-1/2 h-full flex flex-col items-center justify-center transition-transform 
                duration-500 ease-in-out px-6"
                >
                    <ResetPasswordForm
                        onLoginSuccess={(user) => {
                            setUser(user);
                            navigate("/home");
                        }}
                    />
                    <div className="flex gap-4 mt-4 w-full justify-end">
                        <a
                            className="text-sm text-gray-500 cursor-pointer hover:text-primary-accent"
                            onClick={() => navigate("/home")}
                        >
                            ← Volver a iniciar sesión
                        </a>
                    </div>
                </div>

                <div
                    className="w-1/2 h-full flex items-center justify-center transition-all 
                duration-500 ease-in-out text-white p-6 t rounded-l-[250px] bg-purple-mid "
                >
                    <div className="text-center text-white p-8">
                        <h3 className="text-2xl font-bold mb-2">
                            Recuperar contraseña
                        </h3>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecoverPage;
