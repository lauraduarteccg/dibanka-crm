import { useNavigate } from "react-router-dom";

import { IoIosLogOut } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import logo from "@assets/logo.png";

const Header = ({ userName }) => {

    const navigate = useNavigate();

    const goHome = () => {
        navigate("/home");
    };

    return (
        <header
            className="bg-gradient-primary m-6 h-[3.5rem] 
                        rounded-[4vw] flex justify-between 
                        items-center px-6 text-white pl-10 pr-10"
        >
            <button onClick={goHome}>
                <img className="w-24" src={logo} alt="Logo" />
            </button>

            <div className="flex items-center space-x-10">
                {/* Ícono de usuario y nombre */}
                <button
                    onClick={goHome}
                    className="flex items-center space-x-2"
                >
                    <FaUserCircle className="w-6 h-6 text-white" />
                    <h2 className="text-lg font-semibold">
                        {userName ?? "Usuario indefinido"}
                    </h2>
                </button>

                {/* Botón de Cerrar Sesión */}
                <div className="flex items-center">
                    <Tooltip title="Cerrar Sesión">
                        <IconButton
                            onClick={() => {
                                logout();
                                navigate("/");
                            }}
                            size="small"
                            aria-controls={
                                open ? "account-menu" : undefined
                            }
                            aria-haspopup="true"
                            aria-expanded={open ? "true" : undefined}
                        >
                            <IoIosLogOut className="w-7 h-7 text-white" />
                        </IconButton>
                    </Tooltip>
                </div>
            </div>
        </header>
    );
};

export default Header;
