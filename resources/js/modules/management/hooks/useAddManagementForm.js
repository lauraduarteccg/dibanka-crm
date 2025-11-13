import { useState, useEffect, useContext } from "react";
import { AuthContext } from "@context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useAddManagement } from "@modules/management/hooks/useAddManagement";
import { sendData } from "@modules/management/services/sendData";
import { RiH1 } from "react-icons/ri";

export const useAddManagementForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const [isPopupOpen, setIsPopupOpen] = useState(true);
  const {
    modal,
    setModal,
    payroll,
    contact,
    consultation,
    typeManagement,
    specific,
    handleSubmit,
    validationErrors,
    clearValidationError,
    setValidationErrors,
  } = useAddManagement();

  // ==========================
  // ESTADOS LOCALES
  // ==========================
  const [campaign, setCampaign] = useState("");
  const [sms, setSms] = useState(false);
  const [wsp, setWsp] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState(null);
  const [selectedTypeManagement, setSelectedTypeManagement] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [selectedSolution, setSelectedSolution] = useState("");
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [selectedSpecificConsultation, setSelectedSpecificConsultation] = useState(null);
  const [wolkvox_id, setWolkvox_id] = useState("");
  const [comments, setObservations] = useState("");

  // ==========================
  // FUNCIONES LÓGICAS
  // ==========================

  // Construye el payload
  const buildPayload = () => ({
    user_id: user?.id,
    payroll_id: selectedPayroll?.id ?? null,
    type_management_id: selectedTypeManagement?.id ?? null,
    contact_id: selectedContact?.id ?? null,
    solution: selectedSolution,
    consultation_id: selectedConsultation?.id ?? null,
    specific_id: selectedSpecificConsultation?.id ?? null,
    wolkvox_id: wolkvox_id ?? null,
    comments,
    monitoring_id: null,
    solution_date: null,
    wsp: wsp ? 1 : 0,
    sms: sms ? 1 : 0,
  });

  // Limpia el formulario
  const handleClear = () => {
    setCampaign("");
    setSelectedPayroll(null);
    setSelectedTypeManagement("");
    setSelectedContact(null);
    setSelectedSolution("");
    setSelectedConsultation(null);
    setSelectedSpecificConsultation(null);
    setObservations("");
    setWolkvox_id("");
    setSms(false);
    setWsp(false);
    setValidationErrors({});
  };

  // Envía la gestión
  const onSave = async () => {
    const payload = buildPayload();
    const success = await handleSubmit(payload);

    if (success) {
      if (wsp || sms) {
        const dataToSend = {
          "Nombre del Cliente": selectedContact?.name ?? "",
          Telefono: selectedContact?.phone ?? "",
          Pagaduria: selectedPayroll?.name ?? "",
          IdWolkvox: wolkvox_id ?? "",
          Campaña: campaign ?? "",
          "Enviar SMS de canal de whastapp": sms ? "SI" : "NO",
          "Enviar WhatsApp de recuperar contraseña": wsp ? "SI" : "NO",
        };
        sendData(dataToSend);
      }
      handleClear();
      navigate("/gestiones/añadir");
    }
  };


  // Capitaliza palabras
  const capitalizeWords = (str) =>
    str
      ? str
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(" ")
      : "";

  // ==========================
  // FILTROS
  // ==========================
  const filteredTypeManagement = selectedPayroll
    ? typeManagement.filter((item) => item?.payrolls?.id === selectedPayroll?.id)
    : typeManagement;

  const filteredConsultation = selectedPayroll
  ? consultation.filter((item) => item?.payrolls?.id === selectedPayroll?.id)
  : consultation;

  const filteredSpecific = selectedConsultation
    ? specific.filter((item) => item?.consultation?.id === selectedConsultation?.id)
    : specific;

  const filteredContact = contact.filter((item) => {
    const matchesCampaign = !campaign || item?.campaign === campaign;
    const matchesPayroll = !selectedPayroll || item?.payroll?.id === selectedPayroll.id;
    return matchesCampaign && matchesPayroll;
  });

  // ==========================
  // AUTO LLENADO POR URL
  // ==========================
  // Ejemplo de URL: http://localhost:8000/gestiones/a%C3%B1adir?campaign=aliados&payroll=educame&identification_number=12345678&wolkvox_id=8465416524132355456
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setCampaign(capitalizeWords(params.get("campaign")));

    const foundPayroll =
      payroll.find((p) => p.name === capitalizeWords(params.get("payroll"))) || null;
    setSelectedPayroll(foundPayroll);

    const idNumberParam = params.get("identification_number");
    if (idNumberParam) {
      const foundContact =
        contact.find((c) => c.identification_number === idNumberParam) || null;
      setSelectedContact(foundContact);
    }

    setWolkvox_id(capitalizeWords(params.get("wolkvox_id")));
  }, [location.search, payroll, typeManagement, contact]);

    const [openSections, setOpenSections] = useState({});
    const optionsWithIndex = filteredConsultation.map((item, i) => ({
      ...item,
      index: i + 1, // 👈 empezamos desde 1
    }));



  // ==========================
  // RETORNO DEL HOOK
  // ==========================
  return {
    isPopupOpen,
    setIsPopupOpen,
    // Estados
    payroll,
    campaign,
    consultation,
    sms,
    wsp,
    selectedPayroll,
    selectedTypeManagement,
    selectedContact,
    selectedSolution,
    selectedConsultation,
    selectedSpecificConsultation,
    wolkvox_id,
    comments,
    modal,
    validationErrors,

    // Setters
    setCampaign,
    setSms,
    setWsp,
    setSelectedPayroll,
    setSelectedTypeManagement,
    setSelectedContact,
    setSelectedSolution,
    setSelectedConsultation,
    setSelectedSpecificConsultation,
    setWolkvox_id,
    setObservations,
    setModal,
    clearValidationError,

    // Funciones
    onSave,
    handleClear,

    // Datos filtrados
    filteredTypeManagement,
    filteredConsultation,
    filteredSpecific,
    filteredContact,

    // Nuevos estados
    openSections,
    setOpenSections,
    optionsWithIndex,
  };
};
