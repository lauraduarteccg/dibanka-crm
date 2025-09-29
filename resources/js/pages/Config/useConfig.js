import { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { AuthContext } from "@context/AuthContext";

export const useConfig = () => {
    const { token } = useContext(AuthContext);

    const [permissions, setPermissions] = useState([]);
    const [roles, setRoles] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(1);
    const [totalItems, setTotalItems] =useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedRoleId, setSelectedRoleId] = useState(null);

    const jsonPermissions = [
        { id: 1 , name : "Usuarios",                key: "user",            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", },
        { id: 2 , name : "Contactos",               key: "contact",         description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", },
        { id: 3 , name : "Pagadurías",              key: "payroll",         description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", },
        { id: 4 , name : "Consultas",               key: "consultation",    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", },,
        { id: 5 , name : "Consultas especificas",   key: "specific",        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", },
        { id: 6 , name : "Gestiones",               key: "management",      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", },
        { id: 7 , name : "Tipos de gestiones",      key: "typemanagement",  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", },
        { id: 8 , name : "Casos especiales",        key: "special_cases",   description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", },
        { id: 9 , name : "Seguimientos",            key: "monitoring",      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", },
    ]
   
    const fetchPermissions = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get(`/api/permissions`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            //setPermissions(res.data.permissions);
            //console.log("Roles =>", res.data.roles);
        } catch (err) {
            setError("Error al obtener las pagadurias.");
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchPermissions(1);
    }, [fetchPermissions]);

    // -----------------------------------------------------------
    // Lista de roles
    const fetchRoles = useCallback(
        async () => {
            setLoading(true);
            try {
                const res = await axios.get(`/api/roles-permissions`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setRoles(res.data.roles);
                setTotalPages(data.last_page ?? 1);
                setCurrentPage(data.current_page ?? 1);
                setPerPage(data.pagination.per_page);
                setTotalItems(data.pagination.total_roles);
                //console.log("Roles =>", res.data.roles);
            } catch (err) {
                setError("Error al obtener las pagadurias.");
            } finally {
                setLoading(false);
            }
        },
        [token]
    );

    useEffect(() => {
        fetchRoles(1);
    }, [fetchRoles]);


    return {
        selectedRoleId,
        setSelectedRoleId,
        totalPages,
        currentPage,
        perPage,
        totalItems,
        roles,
        jsonPermissions,
        fetchPermissions,
        permissions
    }
};
