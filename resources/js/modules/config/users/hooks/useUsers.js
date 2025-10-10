import { useState, useEffect, useContext, useCallback } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "@context/AuthContext";

// Importa los servicios centralizados
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getRoles,
} from "@modules/config/users/services/usersService";

export const useUsers = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [per_page, setPer_page] = useState(10);
  const [total_users, setTotal_users] = useState(0);

  const [isOpenADD, setIsOpenADD] = useState(false);

  const [formData, setFormData] = useState({
    id: null,
    name: "",
    email: "",
    role: null,
    password: "",
  });

  /* ===========================================================
   * Fetch principal de usuarios
   * =========================================================== */
  const fetchUsers = useCallback(
    async (page = 1, search = "") => {
      setLoading(true);
      try {
        const data = await getUsers(page, search, per_page);
    
        setUsers(data.users);
        setTotalPages(data.pagination.total_pages);
        setPer_page(data.pagination.per_page);
        setTotal_users(data.pagination.total_users);
        setCurrentPage(data.pagination.current_page);
      } catch (err) {
        console.error(err);
        setError("Error al obtener la lista de usuarios.");
      } finally {
        setLoading(false);
      }
    },
    [per_page]
  );

  useEffect(() => {
    fetchUsers(1);
  }, [fetchUsers]);

  const fetchPage = useCallback(
    (page) => fetchUsers(page, searchTerm),
    [fetchUsers, searchTerm]
  );

  const handleSearch = useCallback((value) => {
    setSearchTerm(value);
    setCurrentPage(1);
    fetchUsers(1, value);
  }, [fetchUsers]);

  /* ===========================================================
   *  Obtener roles
   * =========================================================== */
  const fetchRoles = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getRoles();
      setRoles(data);
    } catch (err) {
      console.error("Error al obtener los roles:", err);
      setError("Error al obtener los roles.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  // Filtrar roles según permisos del usuario
  const filteredRoles = user.roles?.includes("Administrador")
    ? roles
    : roles.filter((r) => r.id !== 1);

  /* ===========================================================
   * Crear o actualizar usuario
   * =========================================================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setValidationErrors({});

    try {
      if (formData.id) {
        // Si está editando
        await updateUser(formData.id, formData);
        Swal.fire({
          position: "top-end",
          title: "Usuario actualizado",
          text: "Los cambios se han guardado correctamente.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        // Si está creando nuevo
        await createUser({ ...formData, is_active: true });
        Swal.fire({
          position: "top-end",
          title: "Usuario creado",
          text: "El usuario ha sido registrado correctamente.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      }

      setIsOpenADD(false);
      setFormData({ id: null, name: "", email: "", password: "", role: null });
      fetchUsers(currentPage);
    } catch (error) {
      if (error.response?.status === 422) {
        setValidationErrors(error.response.data.errors);
      } else {
        Swal.fire({
          position: "top-end",
          title: "Error",
          text: "No se pudo guardar el usuario. Intente nuevamente.",
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  /* ===========================================================
   * Eliminar usuario
   * =========================================================== */
  const handleDelete = async (id, status) => {
    const actionText = !status ? "activar" : "desactivar";

    Swal.fire({
      position: "top-end",
      title: `¿Quieres ${actionText} este usuario?`,
      text: `El usuario será marcado como ${!status ? "Activo" : "Inactivo"}.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: !status ? "#28a745" : "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: `Sí, ${actionText}`,
      cancelButtonText: "Cancelar",
      width: "350px",
      padding: "0.8em",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteUser(id);
          Swal.fire({
            position: "top-end",
            title: "Estado actualizado",
            text: `El usuario ahora está ${!status ? "Activo" : "Inactivo"}.`,
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
          fetchUsers(currentPage);
        } catch (error) {
          Swal.fire({
            position: "top-end",
            title: "Error",
            text: error.response?.data?.message || "No se pudo actualizar el usuario.",
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          });
        }
      }
    });
  };

  /* ===========================================================
   * Editar usuario
   * =========================================================== */
  const handleEdit = (user) => {
    setFormData({
      id: user.id,
      name: user.name,
      email: user.email,
      password: "",
      role: user.roles || null,
    });
    setValidationErrors({});
    setIsOpenADD(true);
  };

  return {
    filteredRoles,
    roles,
    users,
    loading,
    error,
    isOpenADD,
    setIsOpenADD,
    formData,
    setFormData,
    validationErrors,
    setValidationErrors,
    handleSubmit,
    currentPage,
    per_page,
    total_users,
    totalPages,
    handleDelete,
    handleEdit,
    handleSearch,
    fetchPage,
  };
};
