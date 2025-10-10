import { useState } from "react";
import Table from "@components/tables/Table";
import ButtonAdd from "@components/ui/ButtonAdd";
import Loader from "@components/ui/Loader";
import Search from "@components/forms/Search";
import { useProfile } from "@modules/config/profile/hooks/useProfile";
import RolesMatrix from "@modules/config/profile/pages/RolesMatrix";
import { Dialog } from "@mui/material";

const Profiles = () => {
  const {
    roles,
    loading,
    currentPage,
    totalPages,
    perPage,
    totalItems,
    handleDelete,
    handleSearch,
    fetchPage,
  } = useProfile();

  const [showMatrix, setShowMatrix] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  // 🔹 Solo mostramos ID y nombre del rol
  const columns = [
    { header: "ID", key: "id" },
    { header: "Nombre del Rol", key: "name" },
  ];

  return (
    <>
      {/* Cards resumen */}
     

      {/* Botón + */}
      <ButtonAdd
        onClickButtonAdd={() => {
          setSelectedRole(null);
          setShowMatrix(true);
        }}
        text="Agregar Rol"
      />

      {/* Buscador */}
      <div className="flex justify-end px-12 -mt-10">
        <Search onSearch={handleSearch} placeholder="Buscar rol..." />
      </div>

      {/* Tabla */}
      {loading ? (
        <Loader />
      ) : (
        <Table
          columns={columns}
          data={roles}
          currentPage={currentPage}
          totalPages={totalPages}
          rowsPerPage={perPage}
          totalItems={totalItems}
          fetch={(page) => fetchPage(page)}
          onDelete={(id) => handleDelete(id)}
          actions={true}
          onActiveOrInactive={false}
          onEdit={(role) => {
            setSelectedRole(role);
            setShowMatrix(true);
          }}
        />
      )}

      {/* Modal Matrix */}
      <Dialog
        open={showMatrix}
        onClose={() => setShowMatrix(false)}
        fullWidth
        maxWidth="lg"
      >
        <div className="relative p-6">
          <button
            onClick={() => setShowMatrix(false)}
            className="absolute right-6 top-4 text-gray-600 hover:text-black text-xl"
          >
            ✕
          </button>
          <RolesMatrix
            onClose={() => setShowMatrix(false)}
            role={selectedRole}
          />
        </div>
      </Dialog>
    </>
  );
};

export default Profiles;
