import { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { AuthContext } from "@context/AuthContext";
import Swal from "sweetalert2";

export const useUsers = () => {
       const { token } = useContext(AuthContext);
       const [users, setUsers] = useState([]);
       const [loading, setLoading] = useState(true);
       const [error, setError] = useState(null);
       const [validationErrors, setValidationErrors] = useState({});
       const [currentPage, setCurrentPage] = useState(1);
       const [searchTerm, setSearchTerm] = useState("");
       const [totalPages, setTotalPages] = useState(1);
       const [per_page, setPer_page] = useState(1);
       const [total_users, setTotal_users] = useState(1);
       const [isOpenADD, setIsOpenADD] = useState(false);
       const [formData, setFormData] = useState({
           id: null,
           name: "",
           email: "",
           password: "",
       });
   
       useEffect(() => {
           fetchUsers(1);
       }, []);
   
        const fetchUsers = useCallback(
        async (page, search = "", pageSize = per_page) => {
            setLoading(true);
            try {
            const res = await axios.get(
                `/api/users?page=${page}&per_page=${pageSize}&search=${encodeURIComponent(search)}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setUsers(res.data.users);
            setTotalPages(res.data.pagination.total_pages);
            setPer_page(res.data.pagination.per_page);
            setTotal_users(res.data.pagination.total_users);
            setCurrentPage(res.data.pagination.current_page);
            } catch (err) {
            setError("Error al obtener la lista de usuarios.");
            } finally {
            setLoading(false);
            }
        },
        [token, per_page]
        );


        const fetchPage = useCallback(
            (page) => fetchUsers(page, searchTerm),
            [fetchUsers, searchTerm]
        );

        const handleSearch = useCallback((value) => {
            setSearchTerm(value);
            setCurrentPage(1);
        }, []);

        useEffect(() => {
            fetchUsers(currentPage, searchTerm);
        }, [currentPage, searchTerm, fetchUsers]);


       const handleEdit = (user) => {
           setFormData({
               id: user.id,
               name: user.name,
               email: user.email,
               password: "",
           });
   
           setValidationErrors({});
           setIsOpenADD(true);
       };
   
       const handleDelete = async (userId, status) => {
           const actionText = !status ? "activar" : "desactivar";
   
           Swal.fire({
               position: "top-end",
               title: `¿Quieres ${actionText} este usuario?`,
               text: `El usuario será marcado como ${
                   !status ? "Activo" : "Inactivo"
               }.`,
               icon: "warning",
               showCancelButton: true,
               confirmButtonColor: !status ? "#28a745" : "#d33",
               cancelButtonColor: "#3085d6",
               confirmButtonText: `Sí, ${actionText}`,
               cancelButtonText: "Cancelar",
               width: "350px",
               padding: "0.8em",
   
               customClass: {
                   title: "swal-title-small",
                   popup: "swal-full-height",
                   confirmButton: "swal-confirm-small",
                   cancelButton: "swal-cancel-small",
               },
           }).then(async (result) => {
               if (result.isConfirmed) {
                   try {
                       const response = await axios.delete(
                           `/api/users/${userId}`,
                           {
                               headers: { Authorization: `Bearer ${token}` },
                           }
                       );
   
                       if (response.status === 200) {
                           Swal.fire({
                               position: "top-end",
   
                               title: "Estado actualizado",
                               text: `El usuario ahora está ${
                                   !status ? "Activo" : "Inactivo"
                               }.`,
                               icon: "success",
                               timer: 1500,
                               showConfirmButton: false,
                               width: "350px",
                               padding: "0.8em",
                           });
                           fetchUsers(currentPage);
                       } else {
                           Swal.fire({
                               position: "top-end",
   
                               title: "Error",
                               text: "No se pudo actualizar el usuario.",
                               icon: "error",
                               width: "300px",
                               padding: "0.6em",
                               width: "350px",
                               padding: "0.8em",
                           });
                       }
                   } catch (error) {
                       Swal.fire({
                           position: "top-end",
   
                           title: "Error",
                           text:
                               error.response?.data?.message ||
                               "No se pudo actualizar el usuario.",
                           icon: "error",
                           width: "300px",
                           padding: "0.6em",
                           width: "350px",
                           padding: "0.8em",
                       });
                   }
               }
           });
       };
   
       const handleSubmit = async (e) => {
           e.preventDefault();
           setLoading(true);
           setValidationErrors({});
   
           try {
               let response;
               let updatedData = {};
               if (formData.id) {
                   const currentUser = users.find(
                       (user) => user.id === formData.id
                   );
   
                   Object.keys(formData).forEach((key) => {
                       if (formData[key] && formData[key] !== currentUser[key]) {
                           updatedData[key] = formData[key];
                       }
                   });
   
                   if (Object.keys(updatedData).length === 0) {
                       Swal.fire({
                           title: "Sin cambios",
                           text: "No se han realizado cambios en la información.",
                           icon: "info",
                           timer: 1500,
                           showConfirmButton: false,
                       });
                       setLoading(false);
                       return;
                   }
   
                   response = await axios.put(
                       `/api/users/${formData.id}`,
                       updatedData,
                       { headers: { Authorization: `Bearer ${token}` } }
                   );
               } else {
                   response = await axios.post(
                       "/api/users",
                       { ...formData, is_active: true },
                       { headers: { Authorization: `Bearer ${token}` } }
                   );
               }
   
               if (response?.status === 200 || response?.status === 201) {
                   Swal.fire({
                       position: "top-end",
                       title: formData.id
                           ? "Usuario actualizado"
                           : "Usuario creado",
                       text: `El usuario ha sido ${
                           formData.id ? "actualizado" : "creado"
                       } correctamente.`,
                       icon: "success",
                       timer: 1500,
                       showConfirmButton: false,
                       width: "350px",
                       padding: "0.8em",
                   });
   
                   setFormData({ id: null, name: "", email: "", password: "" });
                   setIsOpenADD(false);
                   fetchUsers(currentPage);
               }
           } catch (error) {
               if (error.response) {
                   if (error.response.status === 422) {
                       setValidationErrors(error.response.data.errors);
                   } else {
                       Swal.fire({
                           position: "top-end",
                           title: "Error",
                           text: "Ocurrió un error inesperado. Intente de nuevo.",
                           icon: "error",
                           width: "350px",
                           padding: "0.8em",
                       });
                   }
               } else {
                   Swal.fire({
                       position: "top-end",
                       title: "Error de conexión",
                       text: "No se pudo conectar con el servidor.",
                       icon: "error",
                       width: "350px",
                       padding: "0.8em",
                   });
               }
           } finally {
               setLoading(false);
           }
       };
       console.log(total_users)
   
       return{
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
        per_page,total_users,
        totalPages,
        fetchUsers ,
        handleDelete,
        handleEdit,
        handleSearch,
        searchTerm,
        setSearchTerm,
        fetchPage
       }
};
