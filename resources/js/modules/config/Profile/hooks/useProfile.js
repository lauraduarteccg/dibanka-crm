import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import {
  getRoles,
  getPermissions,
  createRole,
  updateRole,
  deleteRole,
} from "@modules/config/profile/services/profileService";

export const useProfile = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [isOpenADD, setIsOpenADD] = useState(false);

  const [formData, setFormData] = useState({
    id: null,
    name: "",
    permissions: [],
  });

  /* ===========================================================
   *  Obtener roles
   * =========================================================== */
  const fetchRoles = useCallback(async (page = 1, search = "") => {
    setLoading(true);
    try {
      const data = await getRoles(page, search);
      setRoles(data.roles);
      setTotalPages(data.pagination.total_pages);
      setCurrentPage(data.pagination.current_page);
      setPerPage(data.pagination.per_page);
      setTotalItems(data.pagination.total_roles);
    } catch (err) {
      console.error(err);
      setError("Error al obtener los roles.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoles(1);
  }, [fetchRoles]);

  const fetchPage = useCallback(
    (page) => fetchRoles(page, searchTerm),
    [fetchRoles, searchTerm]
  );

  const handleSearch = useCallback(
    (value) => {
      setSearchTerm(value);
      setCurrentPage(1);
      fetchRoles(1, value);
    },
    [fetchRoles]
  );

  /* ===========================================================
   *  Obtener permisos
   * =========================================================== */
  const fetchPermissions = useCallback(async () => {
    try {
      const data = await getPermissions();
      setPermissions(data);
    } catch (err) {
      setError("Error al obtener los permisos.");
    }
  }, []);

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  /* ===========================================================
   *  Crear o actualizar rol
   * =========================================================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setValidationErrors({});

    try {
      if (formData.id) {
        await updateRole(formData.id, formData);
        Swal.fire("Rol actualizado", "Cambios guardados correctamente.", "success");
      } else {
        await createRole(formData);
        Swal.fire("Rol creado", "El nuevo rol se ha registrado correctamente.", "success");
      }

      setIsOpenADD(false);
      fetchRoles(currentPage);
    } catch (error) {
      if (error.response?.status === 422) {
        setValidationErrors(error.response.data.errors);
      } else {
        Swal.fire("Error", "Hubo un problema al guardar el rol.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  /* ===========================================================
   *  Editar rol
   * =========================================================== */
  const handleEdit = (role) => {
    setFormData({
      id: role.id,
      name: role.name,
      permissions: role.permissions?.map((p) => p.id) || [],
    });
    setValidationErrors({});
    setIsOpenADD(true);
  };

  /* ===========================================================
   *  Eliminar / desactivar rol
   * =========================================================== */
  const handleDelete = async (id) => {
    Swal.fire({
      position: "top-end",
      title: "¿Deseas eliminar este rol?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteRole(id);
          Swal.fire("Eliminado", "El rol se ha eliminado correctamente.", "success");
          fetchRoles(currentPage);
        } catch {
          Swal.fire("Error", "No se pudo eliminar el rol.", "error");
        }
      }
    });
  };

  const handleCloseModal = () => {
    setIsOpenADD(false);
    setValidationErrors({});
  };

  return {
    roles,
    permissions,
    loading,
    error,
    isOpenADD,
    setIsOpenADD,
    formData,
    setFormData,
    validationErrors,
    currentPage,
    totalPages,
    totalItems,
    perPage,
    fetchPage,
    handleSearch,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleCloseModal,
  };
};
