import React, { useState, useContext, useEffect } from "react";
import LoginForm from "@components/LoginForm";
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
                <div className="w-1/2 h-full flex items-center justify-center transition-transform duration-500 ease-in-out">
                    <LoginForm
                        onLoginSuccess={(user) => {
                            setUser(user);

                            navigate("/home");
                        }}
                    />
                </div>
                <div
                    className="w-1/2 h-full flex items-center justify-center transition-all duration-500 ease-in-out text-white p-6 
                        bg-primary-light rounded-l-[250px]"
                >
                    <div className="text-center text-white p-8">
                        <h3 className="text-2xl font-bold mb-2">Bienvenido</h3>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
