import { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { AuthContext } from "@context/AuthContext";
import Swal from "sweetalert2";

export const useMonitoring = () => {
  const { token } = useContext(AuthContext);

  const [monitoring, ssetMonitoring] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(1);
  const [totalItems, setTotalItems] =useState(1);
  const [isOpenADD, setIsOpenADD] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    is_active: true,
  });

  // ---------------------------------------------------------
  // Traer lista de tipos de gestion
  const fetchMonitoring = useCallback(
    async (page = 1, search = "") => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/monitorings?page=${page}&search=${encodeURIComponent(search)}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        ssetMonitoring(res.data.monitorings);
        setTotalPages(res.data.pagination?.total_pages || res.data.meta?.last_page || 1);
        setCurrentPage(res.data.pagination?.current_page || page);
        setPerPage(res.data.pagination.per_page);
        setTotalItems(res.data.pagination.total_monitorings)
      } catch (err) {
        console.error(err);
        setError("Error al obtener los tipos de gestiones.");
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

    const fetchPage = useCallback(
        (page) => fetchMonitoring(page, searchTerm),
        [fetchMonitoring, searchTerm]
    );
    
    console.log(formData)

    const handleSearch = useCallback((value) => {
        setSearchTerm(value);
        setCurrentPage(1);
    }, []);

    useEffect(() => {
        fetchMonitoring(currentPage, searchTerm);
    }, [currentPage, searchTerm, fetchMonitoring]);
  
  // ---------------------------------------------------------
// ---------------------------------------------------------
// Manejar la edición de una consulta (rellenar form)
const handleEdit = (row) => {
  setFormData({
    id: row.id ?? null,
    name: row.name ?? "", 
    is_active: row.is_active ?? true,
  });
  setValidationErrors({});
  setIsOpenADD(true);
};

  // ---------------------------------------------------------
// Crear o actualizar consulta
const handleSubmit = async (e) => {
  if (e && e.preventDefault) e.preventDefault();
  setLoading(true);
  setValidationErrors({});

  try {
    // Normalizar payload
    const payload = {
      name: formData.name,
    };

    let response;
    if (formData.id) {
      response = await axios.put(`/api/monitorings/${formData.id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } else {
      response = await axios.post("/api/monitorings", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }

    if (response.status === 200 || response.status === 201) {
      Swal.fire({
        title: formData.id ? "Tipo de gestión actualizado" : "Tipo de gestión creado",
        text: "Los cambios han sido guardados correctamente.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      setIsOpenADD(false);
      setFormData({ name: "",  payroll_id: [], is_active: true });

      // refrescar tablas
      fetchMonitoring(currentPage || 1);
    }
  } catch (error) {
    console.error(error);
    if (error.response?.status === 422) {
      setValidationErrors(error.response.data.errors || {});
    } else {
      setError(error.response?.data?.message || "Error al guardar el tipo de gestión.");
    }
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  if (!isOpenADD) {
    setValidationErrors({});
  }
}, [isOpenADD]);

  // ---------------------------------------------------------
  // Activar/Desactivar consulta
  const handleDelete = async (id, status) => {
    const actionText = !status ? "activar" : "desactivar";

    const result = await Swal.fire({
      position: "top-end",
      title: `¿Quieres ${actionText} este tipo de gestión?`,
      text: `El tipo de gestión será marcado como ${!status ? "Activo" : "Inactivo"}.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: !status ? "#28a745" : "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: `Sí, ${actionText}`,
      cancelButtonText: "Cancelar",
      width: "350px",
      padding: "0.8em",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await axios.delete(`/api/monitorings/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        Swal.fire({
          position: "top-end",
          title: "Estado actualizado",
          text: `El tipo de gestión ahora está ${!status ? "Activo" : "Inactivo"}.`,
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
          width: "350px",
          padding: "0.8em",
        });
        fetchMonitoring(currentPage || 1);
      } else {
        Swal.fire({
          position: "top-end",
          title: "Error",
          text: "No se pudo actualizar el tipo de gestión.",
          icon: "error",
        });
      }
    } catch (err) {
      Swal.fire({
        position: "top-end",
        title: "Error",
        text: err.response?.data?.message || "No se pudo actualizar el tipo de gestión.",
        icon: "error",
      });
    }
  };

  // ---------------------------------------------------------
  useEffect(() => {
    // cargamos ambas listas al montar (la específica la puedes usar en selects/autocomplete)
    fetchMonitoring(1);
  }, [fetchMonitoring]);

  return {
    // datos para tablas
    monitoring,

    // estados y control
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

    // acciones
    fetchMonitoring,
    handleEdit,
    handleSubmit,
    handleDelete,
    fetchPage,
    handleSearch,
  };
};
