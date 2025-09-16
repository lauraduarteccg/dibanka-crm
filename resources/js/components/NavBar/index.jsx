import { useState, useContext } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { Tooltip, List, ListItem, ListItemButton, ListItemIcon, ListItemText,IconButton } from "@mui/material";
import { FaUserCircle } from "react-icons/fa"; 
import { RxHamburgerMenu } from "react-icons/rx";
import { IoDocumentTextOutline } from "react-icons/io5"
import { IoIosLogOut } from "react-icons/io";
import { AuthContext } from "@context/AuthContext";
import { AiOutlineFileSearch } from "react-icons/ai";
import { HiOutlineRectangleGroup } from "react-icons/hi2";
import { HiOutlineCollection } from "react-icons/hi";
import { MdOutlineFolderSpecial } from "react-icons/md";
import { HiOutlineIdentification } from "react-icons/hi2";
import { LuMegaphone } from "react-icons/lu";
import { FiUsers } from "react-icons/fi";

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
                <List>
                    {/* Usuarios */}
                    <ListItem disablePadding>
                        <ListItemButton
                            onClick={() => navigate("/usuarios")}
                            selected={location.pathname === "/usuarios"}
                        >
                            <Tooltip title="Usuarios">
                                <ListItemIcon>
                                    <FiUsers className="text-white w-6 h-auto" />
                                </ListItemIcon>
                            </Tooltip>
                            {isOpenMenu && <ListItemText primary="Usuarios" />}
                        </ListItemButton>
                    </ListItem>

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
                            {isOpenMenu && <ListItemText primary="Contactos" />}
                        </ListItemButton>
                    </ListItem>

                    {/* Campañas */}
                    <ListItem disablePadding>
                        <ListItemButton 
                            onClick={() => navigate("/pagadurias")}
                            selected={location.pathname === "/pagadurias"}
                        >
                            <Tooltip title="pagadurías">
                                <ListItemIcon>
                                    <LuMegaphone className="text-white w-6 h-auto" />
                                </ListItemIcon>
                            </Tooltip>
                            {isOpenMenu && <ListItemText primary="Pagadurías" />}
                        </ListItemButton>
                    </ListItem>

                    {/* Consultas */}
                    <ListItem disablePadding>
                        <ListItemButton 
                            onClick={() => navigate("/consultas")}
                            selected={location.pathname === "/consultas"}
                        >
                            <Tooltip title="Consultas">
                                <ListItemIcon>
                                    <IoDocumentTextOutline className="text-white w-6 h-auto" />
                                </ListItemIcon>
                            </Tooltip>
                            {isOpenMenu && <ListItemText primary="Tipo Consultas" />}
                        </ListItemButton>
                    </ListItem>

                    {/* Consultas especificas */}
                    <ListItem disablePadding>
                        <ListItemButton 
                            onClick={() => navigate("/consultas_especificas")}
                            selected={location.pathname === "/consultas_especificas"}
                        >
                            <Tooltip title="Consultas especificas">
                                <ListItemIcon>
                                    <AiOutlineFileSearch className="text-white w-6 h-auto" />
                                </ListItemIcon>
                            </Tooltip>
                            {isOpenMenu && <ListItemText primary="Consultas especificas" />}
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
                            {isOpenMenu && <ListItemText primary="Gestiones" />}
                        </ListItemButton>
                    </ListItem>

                    {/* Tipo de Gestiones */}
                    <ListItem disablePadding>
                        <ListItemButton 
                            onClick={() => navigate("/tipo_de_gestiones")}
                            selected={location.pathname === "/tipo_de_gestiones"}    
                        >
                            <Tooltip title="Tipo de gestiones">
                                <ListItemIcon>
                                    <HiOutlineCollection className="text-white w-6 h-auto" />
                                </ListItemIcon>
                            </Tooltip>
                            {isOpenMenu && <ListItemText primary="Tipo de gestiones" />}
                        </ListItemButton>
                    </ListItem>

                    {/* casos especiales */}
                    <ListItem disablePadding>
                        <ListItemButton 
                            onClick={() => navigate("/casos_especiales")}
                            selected={location.pathname === "/casos_especiales"}
                        >
                            <Tooltip title="Casos especiales">
                                <ListItemIcon>
                                    <MdOutlineFolderSpecial className="text-white w-6 h-auto" />
                                </ListItemIcon>
                            </Tooltip>
                            {isOpenMenu && <ListItemText primary="Casos especiales" />}
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
