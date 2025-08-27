import { useState } from "react";
import Table from "@components/Table";
import { useManagement } from "./useManagement.js";
import Drawer from '@mui/material/Drawer';
import ButtonAdd from "@components/ButtonAdd";
import FormAdd from "@components/FormAddTest";
import Loader from "@components/Loader";
import SearchBar from "@components/Search";
import ClientInfoPopup from "@components/PopupManagement";
import { HiOutlineMail } from "react-icons/hi";
import * as yup from "yup";

const columns = [
  { header: "ID",                 key: "id" },
  { header: "Agente",             key: "usuario_name" },
  { header: "Pagaduría",          key: "payroll_name" },  // 🔹 Cambiado
  { header: "Consulta",           key: "consultation_title" },
  { header: "Nombre de cliente",  key: "contact_name" },
  { header: "Identificación",     key: "contact_identification" },
  { header: "Celular",            key: "contact_phone" },
  { header: "Fecha de creación",  key: "created_at" },
];

const P = ({ text1, text2 }) => (
  <p className="text-gray-600 leading-relaxed">
    <strong className="text-gray-700">{text1}</strong>
    <span className="text-gray-900 ml-1">{text2}</span>
  </p>
);

const Management = () => {
  const {
    management,
    view,
    setView,
    formData,
    loading,
    setFormData,
    currentPage,
    totalPages,
    fetchPage,
    handleSearch,
    payroll,
    contact,
    typeManagement,
    consultation,
  } = useManagement();

  const [isOpenADD, setIsOpenADD] = useState(false); 
  const handleView = (item) => {
    setFormData(item);
    setView(true);
  };

  const [open, setOpen] = useState(false);

  return (
    <>
      <ButtonAdd
          onClickButtonAdd={() => setOpen(true)}
          text="Agregar Gestión"
      />
        <ClientInfoPopup 
          open={open} 
          onClose={() => setOpen(false)} 
          payroll={payroll}     // 🔹 Cambiado
          contact={contact} 
          typeManagement={typeManagement} 
          consultation={consultation}
        />

      <div className="flex justify-end px-36 -mt-10 ">
        <SearchBar onSearch={handleSearch} placeholder="Buscar gestión..." />
      </div>

      <h1 className="text-2xl font-bold text-center mb-4 text-purple-mid">
        Lista de gestiones
      </h1>

      {loading ? (
        <Loader />
      ) : (
        <Table
          columns={columns}
          data={management ?? []}
          currentPage={currentPage}
          fetch={(page) => fetchPage(page)}
          totalPages={totalPages}
          actions={true}
          view={true}
          onView={(item) => handleView(item)}
          edit={false}
          onActiveOrInactive={false}
        />
      )}

      <Drawer
        open={view}
        onClose={() => setView(false)}
        anchor="right"
        PaperProps={{
          sx: {
            backgroundColor: "#f3f3f3",
            width: 500,
            padding: 3,
          },
        }}
      >
        <div className="flex flex-col gap-4">
          <button
            onClick={() => setView(false)}
            className="self-end text-gray-500 hover:text-gray-800 font-semibold"
          >
            ✕ Cerrar
          </button>

          <div className="bg-white shadow-md rounded-lg p-5 flex flex-col gap-3">
            <P text1="Agente: " text2={formData.usuario_name ?? "Usuario sin nombre"} />
          </div>

          <div className="bg-white shadow-md rounded-lg p-5 flex flex-col gap-3">
            <P text1="Pagaduría: " text2={formData.payroll_name ?? "Sin pagaduría"} /> {/* 🔹 Cambiado */}
            <P text1="Campaña: " text2={"Aliados o afiliados"} />
          </div>

          <div className="bg-white shadow-md rounded-lg p-5 flex flex-col gap-3">
            <P text1="Nombre del cliente: " text2={formData.contact_name ?? "Sin Nombre"} />
            <P text1="Teléfono: " text2={formData.contact?.phone ?? "No tiene teléfono"} />
            <P text1="Tipo de identificación: " text2={formData.contact?.identification_type ?? "Sin tipo de identificación"} />
            <P text1="Número de identificación: " text2={formData.contact?.identification_number ?? "Sin número de identificación"} />
            <P text1="Celular actualizado: " text2={formData.contact?.update_phone ?? "No tiene celular actualizado"} />
            <P text1="Correo: " text2={formData.contact?.email ?? "No tiene correo electronico"} />
          </div>

          <div className="bg-white shadow-md rounded-lg p-5 flex flex-col gap-3">
            <P text1="Consulta: " text2={formData.consultation?.reason_consultation ?? "Sin consulta"}/>
            <P text1="Consulta específica: " text2={formData.consultation?.specific_reason ?? "Sin consulta"}/>
          </div>

          <div className="bg-white shadow-md rounded-lg p-5 flex flex-col gap-3">
            <P text1="Solución en primer contacto: " text2={formData.consultation?.reason_consultation ?? "Sin consulta"}/>
            <P text1="Observaciones: " text2={formData.consultation?.reason_consultation ?? "Sin consulta"}/>
            <P text1="Fecha de solución: " text2={formData.consultation?.reason_consultation ?? "Sin consulta"}/>
            <P text1="Seguimiento: " text2={formData.consultation?.reason_consultation ?? "Sin consulta"}/>
          </div>

          <div className="bg-white shadow-md rounded-lg p-5 flex flex-col gap-3">
            <P text1="Fecha de creación: " text2={formData.created_at ?? "No registra fecha"}/>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default Management;
