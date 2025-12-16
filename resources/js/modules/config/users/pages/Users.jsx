import { useContext } from "react";
import { AuthContext } from "@context/AuthContext";
import Table from "@components/tables/Table";
import ButtonAdd from "@components/ui/ButtonAdd";
import FormAddTest from "@components/forms/FormAdd";
import TableSkeleton from "@components/tables/TableSkeleton";
import Search from "@components/forms/Search";
import { useUsers } from "@modules/config/users/hooks/useUsers";
import StatCard from "@components/ui/StatCard";

import * as yup from "yup";

/*
 *  CAMPOS DEL FORMULARIO
 * */
const fields = [
  { name: "name", label: "Nombre", type: "text" },
  { name: "role", label: "Rol", type: "select", options: [] },
  { name: "email", label: "Email", type: "email" },
  {
    name: "password",
    label: "Contraseña",
    type: "password",
    hideOnEdit: true,
  },
];

/*
 *  VALIDACIÓN CON YUP
 * */
const userSchema = yup.object().shape({
  name: yup.string().required("El nombre es requerido"),
  email: yup.string().email("Email inválido").required("El email es requerido"),
  role: yup.string().required("El rol es requerido"),
  password: yup
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .when("id", {
      is: (id) => !id,
      then: (schema) => schema.required("La contraseña es requerida"),
      otherwise: (schema) => schema.optional(),
    }),
});

/*
 *  COMPONENTE PRINCIPAL
 * */
const Users = () => {
  const {
    users,
    loading,
    roles,
    isOpenADD,
    setIsOpenADD,
    formData,
    setFormData,
    validationErrors,
    setValidationErrors,
    handleSubmit,
    per_page,
    total_users,
    currentPage,
    totalPages,
    handleDelete,
    handleEdit,
    handleSearch,
    fetchPage,
    filteredRoles,
  } = useUsers();

  const { user } = useContext(AuthContext);

  // Contadores estadísticos
  const activeUsers = users.filter((u) => u.is_active === 1).length;
  const inactiveUsers = total_users - activeUsers;
  const statsCards = [
    {
      title: "Usuarios Totales",
      value: total_users,
    },
    {
      title: "Usuarios Activos",
      value: activeUsers,
    },
    {
      title: "Usuarios Inactivos",
      value: inactiveUsers,
    }
  ]
  return (
    <>
      {/*
       *  TARJETAS DE ESTADÍSTICAS
       * */}
      <div className="flex justify-center gap-6 mb-4">
        {statsCards.map((stat, index) => (
          <StatCard key={index} stat={stat} loading={loading} />
        ))}
      </div>


      {/*
       *  BOTÓN DE AGREGAR USUARIO
       * */}
      <ButtonAdd
        onClickButtonAdd={() => {
          setFormData({
            id: null,
            name: "",
            email: "",
            password: "",
            role: null,
            is_active: true,
          });
          setValidationErrors({});
          setIsOpenADD(true);
        }}
        text="Agregar Usuario"
      />

      {/*
       *  BUSCADOR
       * */}
      <div className="flex justify-end px-12 -mt-10">
        <Search onSearch={handleSearch} placeholder="Buscar usuario..." />
      </div>

      {/*
       *  FORMULARIO MODAL
       * */}
      <FormAddTest
        isOpen={isOpenADD}
        setIsOpen={setIsOpenADD}
        title="Usuario"
        formData={formData}
        setFormData={setFormData}
        validationErrors={validationErrors}
        loading={loading}
        handleSubmit={handleSubmit}
        fields={fields.map((field) =>
          field.name === "role"
            ? {
              ...field,
              options: filteredRoles.map((r) => ({
                value: r.id,
                label: r.name,
              })),
            }
            : field
        )}
        schema={userSchema}
        admin={
          formData.role == 1 && !user.roles?.includes("Administrador")
        }
      />

      {/*
       *  TABLA DE USUARIOS
       * */}
      {loading ? (
        <TableSkeleton rows={5} />
      ) : (
        <Table
          columns={[
            { header: "ID", key: "id" },
            { header: "Nombre", key: "name" },
            { header: "Rol", key: "rolesname" },
            { header: "Email", key: "email" },
          ]}
          data={users}
          currentPage={currentPage}
          totalPages={totalPages}
          rowsPerPage={per_page}
          totalItems={total_users}
          fetchPage={(page) => fetchPage(page)}
          actions
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </>
  );
};

export default Users;
