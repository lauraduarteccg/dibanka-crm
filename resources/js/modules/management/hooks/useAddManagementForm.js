import { useState, useEffect, useContext } from "react";
import { AuthContext } from "@context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useAddManagement } from "@modules/management/hooks/useAddManagement";
import { 
  sendSms, 
  sendWhatsApp,
  getActiveConsultationsByCampaign,
  getActiveSpecificConsultationsByCampaign
} from "@modules/management/services/managementService";

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

  // Estados para consultas dinámicas
  const [consultation, setConsultation] = useState([]);
  const [specific, setSpecific] = useState([]);
  const [loadingConsultations, setLoadingConsultations] = useState(false);

  // ==========================
  // CARGAR CONSULTAS SEGÚN CAMPAÑA
  // ==========================
  useEffect(() => {
    const loadConsultationsByCampaign = async () => {
      if (!campaign) {
        setConsultation([]);
        setSpecific([]);
        return;
      }

      setLoadingConsultations(true);
      try {
        const [consultationsData, specificsData] = await Promise.all([
          getActiveConsultationsByCampaign(campaign),
          getActiveSpecificConsultationsByCampaign(campaign)
        ]);

        setConsultation(consultationsData);
        setSpecific(specificsData);

        // Resetear las selecciones si ya no son válidas
        if (selectedConsultation && !consultationsData.find(c => c.id === selectedConsultation.id)) {
          setSelectedConsultation(null);
        }
        if (selectedSpecificConsultation && !specificsData.find(s => s.id === selectedSpecificConsultation.id)) {
          setSelectedSpecificConsultation(null);
        }
      } catch (error) {
        console.error("Error al cargar consultas:", error);
        setConsultation([]);
        setSpecific([]);
      } finally {
        setLoadingConsultations(false);
      }
    };

    loadConsultationsByCampaign();
  }, [campaign]);

  // ==========================
  // FUNCIONES LÓGICAS
  // ==========================

  // Construye el payload
  const buildPayload = () => {
    const payload = {
      user_id: user?.id,
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
    };

    return payload;
  };

  // ==========================
  // EFECTO: AL SELECCIONAR CONTACTO
  // ==========================
  useEffect(() => {
    if (selectedContact) {
      if (selectedContact.payroll) {
        setSelectedPayroll(selectedContact.payroll);
      }
      if (selectedContact.campaign) {
        setCampaign(selectedContact.campaign.name);
      }
    }
  }, [selectedContact]);

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
    
    // Validar que se haya seleccionado una campaña
    if (!campaign) {
      setValidationErrors(prev => ({
        ...prev,
        campaign: ["Debes seleccionar una campaña"]
      }));
      return;
    }
    
    // Pasar la campaña al handleSubmit
    const success = await handleSubmit(payload, campaign);

    if (success) {
      if (wsp || sms) {
        const payloadWolkvox = {
          nombre: selectedContact?.name ?? "",
          telefono: selectedContact?.phone ?? "",
          id_wolkvox: wolkvox_id ?? "",
          pagaduria: selectedPayroll?.name ?? "",
        };

        if (sms) {
          await sendSms(payloadWolkvox);
        }

        if (wsp) {
          await sendWhatsApp(payloadWolkvox);
        }
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
  const { typeManagement } = useAddManagement();

  const filteredTypeManagement = selectedPayroll
    ? typeManagement.filter((item) =>
        item?.payrolls?.some((p) => p.id === selectedPayroll?.id)
      )
    : typeManagement;

  // Las consultas ya están filtradas por campaña en el useEffect (líneas 51-86)
  // No es necesario filtrar por payroll aquí
  const filteredConsultation = consultation;
  
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
  }, [location.search, payroll, contact]);

  const [openSections, setOpenSections] = useState({});
  const optionsWithIndex = filteredConsultation.map((item, i) => ({
    ...item,
    index: i + 1,
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
    specific,
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
    loadingConsultations,

    // Setters
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