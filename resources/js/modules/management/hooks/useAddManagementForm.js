import { useState, useEffect, useContext } from "react";
import { AuthContext } from "@context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useAddManagement } from "@modules/management/hooks/useAddManagement";
import {
    sendSms,
    sendWhatsApp,
    getActiveConsultationsByCampaign,
    getActiveSpecificConsultationsByCampaign,
} from "@modules/management/services/managementService";
import {
    createContact,
    updateContact,
} from "@modules/contact/services/contactService";
import { userSchema as contactSchema } from "@modules/contact/pages/Contact/constants";
import Swal from "sweetalert2";

export const useAddManagementForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useContext(AuthContext);
    const [isPopupOpen, setIsPopupOpen] = useState(true);

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
    const [selectedSpecificConsultation, setSelectedSpecificConsultation] =
        useState(null);
    const [wolkvox_id, setWolkvox_id] = useState("");
    const [comments, setObservations] = useState("");
    const [isEditingContact, setIsEditingContact] = useState(false);
    const [contactFormData, setContactFormData] = useState({});

    // Estados para consultas dinámicas
    const [consultation, setConsultation] = useState([]);
    const [specific, setSpecific] = useState([]);
    const [loadingConsultations, setLoadingConsultations] = useState(false);

    const {
        modal,
        setModal,
        payroll,
        contact,
        handleSubmit,
        validationErrors,
        clearValidationError,
        setValidationErrors,
    } = useAddManagement(selectedPayroll, campaign);

    // ==========================
    // CARGAR CONSULTAS SEGÚN CAMPAÑA Y PAGADURÍA
    // ==========================
    // ==========================
    // CARGAR CONSULTAS SEGÚN CAMPAÑA Y PAGADURÍA
    // ==========================
    useEffect(() => {
        const loadConsultationsByCampaign = async () => {
            if (!campaign) {
                setConsultation([]);
                // No limpiamos specific aquí porque depende de selectedConsultation
                return;
            }

            setLoadingConsultations(true);
            try {
                const payrollId = selectedPayroll?.id || null;

                // Solo cargamos las consultas generales
                const consultationsData =
                    await getActiveConsultationsByCampaign(campaign, payrollId);

                setConsultation(consultationsData);

                // Resetear las selecciones si ya no son válidas
                if (
                    selectedConsultation &&
                    !consultationsData.find(
                        (c) => c.id === selectedConsultation.id
                    )
                ) {
                    setSelectedConsultation(null);
                }
            } catch (error) {
                console.error("Error al cargar consultas:", error);
                setConsultation([]);
            } finally {
                setLoadingConsultations(false);
            }
        };

        loadConsultationsByCampaign();
    }, [campaign, selectedPayroll]);

    // ==========================
    // CARGAR CONSULTAS ESPECÍFICAS SEGÚN CONSULTA SELECCIONADA
    // ==========================
    useEffect(() => {
        const loadSpecificConsultations = async () => {
            if (!campaign || !selectedConsultation) {
                setSpecific([]);
                return;
            }

            // setLoadingConsultations(true); // Opcional: si quieres mostrar loading al seleccionar consulta
            try {
                // Pasamos consultationId en lugar de payrollId
                const consultationId = selectedConsultation.id;
                const specificsData =
                    await getActiveSpecificConsultationsByCampaign(
                        campaign,
                        consultationId
                    );

                setSpecific(specificsData);
                console.log("🚀 useAddManagementForm - specificsData:", specificsData);

                if (
                    selectedSpecificConsultation &&
                    !specificsData.find(
                        (s) => s.id === selectedSpecificConsultation.id
                    )
                ) {
                    setSelectedSpecificConsultation(null);
                }
            } catch (error) {
                console.error("Error al cargar consultas específicas:", error);
                setSpecific([]);
            } finally {
                // setLoadingConsultations(false);
            }
        };

        loadSpecificConsultations();
    }, [campaign, selectedConsultation]);

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

    const handleClearConact = () => {
        setSelectedContact(null);
    };

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
        setIsEditingContact(false);
    };

    const handleEditContact = () => {
        if (!selectedContact) return;
        setContactFormData({
            id: selectedContact.id,
            campaign_id:
                selectedContact.campaign_id || selectedContact.campaign?.id,
            payroll_id:
                selectedContact.payroll_id || selectedContact.payroll?.id,
            name: selectedContact.name || "",
            email: selectedContact.email || "",
            phone: selectedContact.phone || "",
            update_phone: selectedContact.update_phone || "",
            identification_type: selectedContact.identification_type || "",
            identification_number: selectedContact.identification_number || "",
        });
        setIsEditingContact(true);
    };

    const handleCreateContact = () => {
        setSelectedContact(null); // Deseleccionar contacto actual si existe
        setContactFormData({
            id: null,
            campaign_id: "",
            payroll_id: "",
            name: "",
            email: "",
            phone: "",
            update_phone: "",
            identification_type: "",
            identification_number: "",
        });
        setIsEditingContact(true);
    };

    const handleCancelEdit = () => {
        setIsEditingContact(false);
        setContactFormData({});
        setValidationErrors({});
    };

    const handleSaveContactEdit = async () => {
        try {
            await contactSchema.validate(contactFormData, {
                abortEarly: false,
            });

            let response;
            if (contactFormData.id) {
                response = await updateContact(
                    contactFormData.id,
                    contactFormData
                );
            } else {
                response = await createContact(contactFormData);
            }

            // El backend suele devolver el objeto creado/editado
            const savedContact = response.contact || response.data || response;

            // Mapear nombres de campaña y pagaduría para el grid local
            const campaignName =
                contactFormData.campaign_id == 1 ? "Aliados" : "Afiliados";
            const fullPayroll = (payroll || []).find(
                (p) => p.id === contactFormData.payroll_id
            );

            setSelectedContact({
                ...savedContact,
                campaign: {
                    id: contactFormData.campaign_id,
                    name: campaignName,
                },
                payroll: fullPayroll || {
                    id: contactFormData.payroll_id,
                    name:
                        (payroll || []).find(
                            (p) => p.id === contactFormData.payroll_id
                        )?.name || "—",
                },
            });

            Swal.fire({
                title: "Contacto guardado",
                text: `El contacto ha sido ${
                    contactFormData.id ? "actualizado" : "creado"
                } correctamente.`,
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
            });

            setIsEditingContact(false);
            setValidationErrors({});
        } catch (err) {
            if (err.inner) {
                const errors = {};
                err.inner.forEach((error) => {
                    errors[error.path] = [error.message];
                });
                setValidationErrors(errors);
            } else if (err.response?.status === 422) {
                setValidationErrors(err.response.data.errors);
            } else {
                console.error("Error al guardar contacto:", err);
                Swal.fire({
                    title: "Error",
                    text: "Ocurrió un error al guardar el contacto.",
                    icon: "error",
                    timer: 2000,
                    showConfirmButton: false,
                });
            }
        }
    };

    // Envía la gestión
    const onSave = async () => {
        const payload = buildPayload();

        //console.log('🔍 useAddManagementForm - onSave tiene campaign:', campaign);

        // Validar que se haya seleccionado una campaña
        if (!campaign) {
            setValidationErrors((prev) => ({
                ...prev,
                campaign: ["Debes seleccionar una campaña"],
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
                  .map(
                      (word) =>
                          word.charAt(0).toUpperCase() +
                          word.slice(1).toLowerCase()
                  )
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

    const filteredSpecific = specific;

    const filteredContact = contact.filter((item) => {
        const matchesCampaign = !campaign || item?.campaign === campaign;
        const matchesPayroll =
            !selectedPayroll || item?.payroll?.id === selectedPayroll.id;
        return matchesCampaign && matchesPayroll;
    });

    // ==========================
    // AUTO LLENADO POR URL
    // ==========================
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        setCampaign(capitalizeWords(params.get("campaign")));

        const foundPayroll =
            payroll.find(
                (p) => p.name === capitalizeWords(params.get("payroll"))
            ) || null;
        setSelectedPayroll(foundPayroll);

        const idNumberParam = params.get("identification_number");
        if (idNumberParam) {
            const foundContact =
                contact.find(
                    (c) => c.identification_number === idNumberParam
                ) || null;
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

        // Editing contact
        isEditingContact,
        contactFormData,
        setContactFormData,
        handleEditContact,
        handleCreateContact,
        handleCancelEdit,
        handleSaveContactEdit,
        handleClearConact,
    };
};
