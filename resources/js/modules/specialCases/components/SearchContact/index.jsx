import React, { useEffect } from "react";
import { Dialog, IconButton } from "@mui/material";
import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import Search from "@components/forms/Search";
import Table from "@components/tables/Table";

export default function SearchContact({
  openSearchContact,
  setOpenSearchContact,
  onSelectContact,
  selectedPayroll,
  // Data from hook
  contactSearch,
  currentPageContact,
  totalPagesContact,
  perPageContact,
  totalItemsContact,
  loadingContact,
  // Functions from hook
  fetchContactsSearch,
  handleSearchContact,
  fetchPageContact,
}) {
  const columns = [
    { header: "Pagaduría", key: "payroll.name" },
    { header: "Nombre", key: "name" },
    { header: "Correo", key: "email" },
    { header: "Teléfono", key: "phone" },
    { header: "Celular", key: "update_phone" },
    { header: "Identificación", key: "identification_number" },
  ];

  // Fetch contacts when modal opens or pagination changes
  useEffect(() => {
    if (openSearchContact) {
      fetchContactsSearch(currentPageContact, "");
    }
  }, [openSearchContact, currentPageContact, fetchContactsSearch]);

  const handleSelectRecord = (recordId) => {
    const selected = contactSearch.find((item) => item.id === recordId);
    if (selected) {
      onSelectContact(selected);
      setOpenSearchContact(false);
    }
  };

  return (
    <Dialog
      onClose={() => setOpenSearchContact(false)}
      open={openSearchContact}
      fullWidth
      maxWidth="lg"
      PaperProps={{
        sx: {
          borderRadius: 1,
          boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
          background: "#f7fafc",
          overflow: "hidden",
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
            onClick={() => setOpenSearchContact(false)}
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

        {/* Barra de búsqueda */}
        <div className="flex justify-center mb-6">
          <div className="w-full ml-[6%]">
            <Search
              onSearch={handleSearchContact}
              placeholder="Buscar contacto o cliente..."
            />
          </div>
        </div>

        {/* Tabla */}
        <Table
          columns={columns}
          data={contactSearch}
          paginationSection={true}
          actions={true}
          edit={false}
          currentPage={currentPageContact}
          totalPages={totalPagesContact}
          rowsPerPage={perPageContact}
          totalItems={totalItemsContact}
          fetchPage={fetchPageContact}
          onActiveOrInactive={false}
          selectRecord={true}
          onSelectRecord={handleSelectRecord}
        />

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-400">
          Selecciona un contacto para continuar 💬
        </div>
      </motion.div>
    </Dialog>
  );
}
