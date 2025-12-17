import React from "react";
import { Dialog, IconButton } from "@mui/material";
import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom"; // Importar useNavigate
import FilterSearch from "@components/ui/FilterSearch";
import Table from "@components/tables/Table";
import { useAddManagement } from "@modules/management/hooks/useAddManagement";
import TableSkeleton from "@components/tables/TableSkeleton";
// Opciones de filtro para búsqueda de contactos
const filterOptions = [
  { value: "identification_number", label: "Número de identificación" },
  { value: "name", label: "Nombre" },
  { value: "email", label: "Correo" },
  { value: "phone", label: "Teléfono" },
  { value: "payroll", label: "Pagaduría" },
  { value: "campaign", label: "Campaña" },
];

export default function SearchPayroll({
  openSearchPayroll,
  setOpenSearchPayroll,
  onSelectContact,
  selectedPayroll,
  campaign,
}) {
  const navigate = useNavigate(); // Hook de navegación
  const {
    loading,
    handleSearchContact,
    contact,
    totalPagesContact,
    currentPageContact,
    fetchPageContact,
    totalItemsContact,
    perPageContact,
    searchTermContact, // Obtener término de búsqueda
  } = useAddManagement(selectedPayroll, campaign);

  const columns = [
    { header: "ID", key: "id" },
    { header: "Campaña", key: "campaign.name" },
    { header: "Pagaduría", key: "payroll.name" },
    { header: "Nombre", key: "name" },
    { header: "Correo", key: "email" },
    { header: "Celular", key: "update_phone" },
    { header: "Identificación", key: "identification_number" },
  ];

  const handleSelectRecord = (recordId) => {
    const selected = contact.find((item) => item.id === recordId);
    if (selected) {
      onSelectContact(selected);
      setOpenSearchPayroll(false);
    }
  };

  const handleEdit = (record) => {
    // Redirigir a Contactos filtrando por identificación
    navigate(
      `/contactos?search=${encodeURIComponent(
        record.identification_number
      )}&column=identification_number`
    );
  };

  const handleFilterSearch = (searchValue, filterColumn) => {
    // Normalizar filtros para backend (igual que en Contact)
    let column = filterColumn;

    if (filterColumn === "payroll.name") column = "payroll";
    if (filterColumn === "campaign.name") column = "campaign";

    handleSearchContact(searchValue, column);
  };

  const handleClearSearch = () => {
    handleSearchContact("", "");
  };

  return (
    <Dialog
      onClose={() => setOpenSearchPayroll(false)}
      open={openSearchPayroll}
      fullWidth
      maxWidth="lg"
      PaperProps={{
        sx: {
          borderRadius: 1,
          boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
          background: "#f7fafc",
        },
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="p-8"
      >
        {/* Encabezado */}
        <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-3">
          <h2 className="text-2xl text-primary-strong font-semibold">
            Buscar contacto o cliente
          </h2>

          <IconButton
            onClick={() => setOpenSearchPayroll(false)}
            size="large"
            sx={{
              color: "#6b7280",
              "&:hover": {
                color: "#2563eb",
                transform: "rotate(90deg)",
              },
              transition: "all 0.3s ease",
            }}
          >
            <IoClose size={26} />
          </IconButton>
        </div>

        {/* Barra de búsqueda con filtros */}
        <div className="flex justify-center mb-6">
          <div className="w-full flex justify-end gap-2">
            <div className="w-full">
            </div>
            <FilterSearch
              className=""
              onFilter={handleFilterSearch}
              placeholder="Buscar contacto o cliente..."
              filterOptions={filterOptions}
              initialSearchValue={searchTermContact}
            />
            {searchTermContact && (
              <button
                onClick={handleClearSearch}
                className="bg-red-500 text-white w-[300px] h-[100%] px-4 py-2 rounded hover:bg-red-600 transition-colors"
              >
                Limpiar filtro
              </button>
            )}
          </div>
        </div>
        {/* TABLE / SKELETON */}
        <div className="min-h-[420px]">
          {loading ? (
            <TableSkeleton rows={8} />
          ) : (
            <Table
              width="100%"
              columns={columns}
              data={contact}
              paginationSection={true}
              actions={true}
              edit={true}
              onEdit={handleEdit}
              currentPage={currentPageContact}
              totalPages={totalPagesContact}
              rowsPerPage={perPageContact}
              totalItems={totalItemsContact}
              fetchPage={fetchPageContact}
              onActiveOrInactive={false}
              selectRecord={true}
              onSelectRecord={handleSelectRecord}
            />
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-400">
          Selecciona un contacto para continuar 💬
        </div>
      </motion.div>
    </Dialog>
  );
}