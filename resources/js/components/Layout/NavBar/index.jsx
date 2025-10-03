import { useState, useContext } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import {
    Tooltip,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    IconButton,
} from "@mui/material";
import { FaUserCircle } from "react-icons/fa";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoIosLogOut } from "react-icons/io";
import { AuthContext } from "@context/AuthContext";
import { HiOutlineRectangleGroup } from "react-icons/hi2";
import { MdOutlineFolderSpecial } from "react-icons/md";
import { HiOutlineIdentification } from "react-icons/hi2";

import { VscTools } from "react-icons/vsc";
import logo from "@assets/logo.png";

const NavBar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isOpenMenu, setIsOpenMenu] = useState(false);
    const location = useLocation();

    return (
        <div className="flex w-full h-full">
            <motion.div
                initial={{ width: "2.5rem" }}
                animate={{ width: isOpenMenu ? "16rem" : "3.5rem" }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="h-screen fixed flex flex-col left-0 top-0  
                    bg-gradient-secondary text-white z-50 shadow-custom"
                onMouseEnter={() => setIsOpenMenu(true)}
                onMouseLeave={() => setIsOpenMenu(false)}
            >
                {/* Botón para abrir/cerrar el menú */}
                <button
                    className="mb-7 mt-2 px-4 flex items-center"
                    onClick={() => setIsOpenMenu((prev) => !prev)}
                >
                    <RxHamburgerMenu className="w-6 h-auto" />
                </button>

                {/* Lista de opciones del menú */}
                <List className="flex flex-col justify-around h-full">
                    <div>
                        {/* Contactos */}
                        <ListItem disablePadding>
                            <ListItemButton
                                onClick={() => navigate("/contactos")}
                                selected={location.pathname === "/contactos"}
                            >
                                <Tooltip title="Contactos">
                                    <ListItemIcon>
                                        <HiOutlineIdentification className="text-white w-6 h-auto" />
                                    </ListItemIcon>
                                </Tooltip>
                                {isOpenMenu && (
                                    <ListItemText primary="Contactos" />
                                )}
                            </ListItemButton>
                        </ListItem>

                        {/* Gestiones */}
                        <ListItem disablePadding>
                            <ListItemButton
                                onClick={() => navigate("/gestiones")}
                                selected={location.pathname === "/gestiones"}
                            >
                                <Tooltip title="Gestiones">
                                    <ListItemIcon>
                                        <HiOutlineRectangleGroup className="text-white w-6 h-auto" />
                                    </ListItemIcon>
                                </Tooltip>
                                {isOpenMenu && (
                                    <ListItemText primary="Gestiones" />
                                )}
                            </ListItemButton>
                        </ListItem>

                        {/* casos especiales */}
                        <ListItem disablePadding>
                            <ListItemButton
                                onClick={() => navigate("/casos_especiales")}
                                selected={
                                    location.pathname === "/casos_especiales"
                                }
                            >
                                <Tooltip title="Casos especiales">
                                    <ListItemIcon>
                                        <MdOutlineFolderSpecial className="text-white w-6 h-auto" />
                                    </ListItemIcon>
                                </Tooltip>
                                {isOpenMenu && (
                                    <ListItemText primary="Casos especiales" />
                                )}
                            </ListItemButton>
                        </ListItem>
                    </div>

                    {/* Configuracion de roles */}
                    <ListItem disablePadding>
                        <ListItemButton
                            onClick={() => navigate("/configuraciones")}
                            selected={location.pathname === "/configuraciones"}
                        >
                            <Tooltip title="Configuración">
                                <ListItemIcon>
                                    <VscTools className="text-white w-6 h-auto" />
                                </ListItemIcon>
                            </Tooltip>
                            {isOpenMenu && (
                                <ListItemText primary="Configuración" />
                            )}
                        </ListItemButton>
                    </ListItem>
                </List>
            </motion.div>

            <header
                className="bg-gradient-primary m-6 h-[3.5rem] w-full
                            rounded-[4vw] flex justify-between ml-20
                            items-center px-6 text-white pl-10 pr-10"
            >
                <button onClick={() => navigate("/home")}>
                    <img className="w-24" src={logo} alt="Logo" />
                </button>

                <div className="flex items-center space-x-10">
                    <button className="flex items-center space-x-2">
                        <FaUserCircle className="w-6 h-6 text-white" />
                        <h2 className="text-lg font-semibold">
                            {user?.name ?? "Usuario indefinido"}
                        </h2>
                    </button>
                    <div className="flex items-center w-8 h-8">
                        <Tooltip title="Cerrar Sesión">
                            <IconButton
                                onClick={() => {
                                    logout();
                                    navigate("/login");
                                }}
                                size="small"
                            >
                                <IoIosLogOut className="w-7 h-7 text-white" />
                            </IconButton>
                        </Tooltip>
                    </div>
                </div>
            </header>
        </div>
    );
};

export default NavBar;
