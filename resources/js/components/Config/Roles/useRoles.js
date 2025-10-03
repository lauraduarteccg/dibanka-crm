import { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { AuthContext } from "@context/AuthContext";

export const useRoles = () => {
    const { token } = useContext(AuthContext);
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(false);

    // Paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [per_page, setPerPage] = useState(10);
    const [total_roles, setTotalRoles] = useState(0);

    // Modal y formulario
    const [isOpenADD, setIsOpenADD] = useState(false);
    const [formData, setFormData] = useState({
        id: null,
        name: "",
        description: "",
        permissions: [],
    });
    const [validationErrors, setValidationErrors] = useState({});
    const [selectedRole, setSelectedRole] = useState(null);

    const handleViewPermissions = async (roleId) => {
        const role = await fetchRolePermissions(roleId);
        setSelectedRole(role);
    };
    // 🔹 Cargar roles desde la API
    const fetchRoles = async (page = 1) => {
        setLoading(true);
        try {
            const { data } = await axios.get(
                `/api/roles?page=${page}&per_page=${per_page}`
            );

            setRoles(data.roles);
            setTotalRoles(data.total);
            setTotalPages(data.last_page);
            setCurrentPage(data.current_page);
        } catch (error) {
            console.error("Error cargando roles:", error);
        } finally {
            setLoading(false);
        }
    };

    // 🔹 Cargar permisos disponibles
    const fetchPermissions = async () => {
        try {
            const { data } = await axios.get(`/api/permissions`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPermissions(data.permissions);
        } catch (error) {
            console.error("Error cargando permisos:", error);
        }
    };
    const fetchRolePermissions = async (roleId) => {
        try {
            const { data } = await axios.get(
                `/api/role/${roleId}/permissions`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            return data.role;
        } catch (error) {
            console.error("Error cargando permisos del rol:", error);
        }
    };
    const togglePermission = async (roleId, permissionId, assign) => {
        try {
            await axios.put(
                `/api/roles/${roleId}/permissions`,
                {
                    permissions: [permissionId],
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            return fetchRolePermissions(roleId);
        } catch (error) {
            console.error("Error actualizando permiso:", error);
        }
    };

    // 🔹 Crear o editar rol
    const handleSubmit = async () => {
        setLoading(true);
        try {
            if (formData.id) {
                // Editar rol
                await axios.put(`/api/roles/${formData.id}`, formData);
            } else {
                // Crear rol
                await axios.post(`/api/roles`, formData);
            }
            setIsOpenADD(false);
            fetchRoles(currentPage);
        } catch (error) {
            if (error.response?.data?.errors) {
                setValidationErrors(error.response.data.errors);
            }
            console.error("Error guardando rol:", error);
        } finally {
            setLoading(false);
        }
    };

    // 🔹 Eliminar rol
    const handleDelete = async (id) => {
        if (!confirm("¿Seguro que deseas eliminar este rol?")) return;
        setLoading(true);
        try {
            await axios.delete(`/api/roles/${id}`);
            fetchRoles(currentPage);
        } catch (error) {
            console.error("Error eliminando rol:", error);
        } finally {
            setLoading(false);
        }
    };

    // 🔹 Editar rol
    const handleEdit = (role) => {
        setFormData({
            id: role.id,
            name: role.name,
            description: role.description,
            permissions: role.permissions?.map((p) => p.id) || [],
        });
        setValidationErrors({});
        setIsOpenADD(true);
    };

    // 🔹 Buscar roles
    const handleSearch = async (query) => {
        setLoading(true);
        try {
            const { data } = await axios.get(`/api/roles?search=${query}`);
            setRoles(data.data);
            setTotalRoles(data.total);
            setTotalPages(data.last_page);
        } catch (error) {
            console.error("Error buscando roles:", error);
        } finally {
            setLoading(false);
        }
    };

    // 🔹 Cambio de página
    const fetchPage = (page) => {
        fetchRoles(page);
    };

    useEffect(() => {
        fetchRoles();
        fetchPermissions();
    }, []);

    return {
        roles,
        loading,
        permissions,
        isOpenADD,
        setIsOpenADD,
        formData,
        setFormData,
        validationErrors,
        setValidationErrors,
        handleSubmit,
        handleDelete,
        handleEdit,
        handleSearch,
        fetchPage,
        currentPage,
        totalPages,
        per_page,
        total_roles,
        handleViewPermissions,
        selectedRole, 
        setSelectedRole,
        togglePermission
    };
};
