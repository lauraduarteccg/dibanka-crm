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

    const infoItems = [
      // GENERAL
      {
        category: 'general',
        title: 'Llamada Caída',
        items: [
          'Ingresa llamada sin comunicación → Restablecimiento enviando a buzón de voz',
          'Ingresa llamada sin comunicación → No se restablece por disponibilidad de línea'
        ]
      },
      {
        category: 'general',
        title: 'Desprendible de Nómina',
        description: 'Afiliado desea descargar desprendible de nómina',
        action: 'Validar datos e informar que debe comunicarse con la pagaduría'
      },
      {
        category: 'general',
        title: 'Activación Correo Institucional',
        description: 'Afiliado solicita activación del correo institucional',
        action: 'Validar datos e indicar que debe solicitarlo a pagaduría Casur por los siguientes medios:',
        contact: [
          { type: 'email', value: 'citse@casur.gov.co' },
          { type: 'phone', value: '601 286 0911' }
        ]
      },
      {
        category: 'general',
        title: 'Link de Plataforma',
        description: 'Afiliado desea conocer los pasos para ingresar',
        action: 'Validar datos e indicar los pasos para el ingreso'
      },
      {
        category: 'general',
        title: 'Apertura/Cierre Plataforma',
        items: [
          'Afiliado desea validar fecha de apertura de la plataforma. Se validan los datos, se le informa que actualmente no contamos con fecha de apertura.',
          'Afiliado se comunica indicando que quiere conocer fecha de apertura y cierre de la plataforma Dibanka. Se hace validación de datos, se le indica que la plataforma abrió el día __ de octubre y cierra para compra de cartera el día __ de noviembre y su cierre total es el día __ de noviembre.',
          'Afiliado desea validar fecha de cierre. Se validan los datos, se le informa que la plataforma dará cierre',
        ]
      },
      {
        category: 'general',
        title: 'Cupo Disponible Actualizado',
        items: [
          'Cuota 0 en la siguiente nómina',
          'Retiro otras causales automático'
        ]
      },
      {
        category: 'general',
        title: 'Afiliado Tejen',
        description: 'Afiliada Tejen desea registrarse en Dibanka',
        action: 'Validar datos e indicar que NO debe hacer registro en plataforma de Dibanka. La entidad reporta el crédito directamente a pagaduría'
      },
      {
        category: 'general',
        title: 'Embargo',
        description: 'Afiliado indica embargo',
        action: 'Validar datos'
      },
      // ACTUALIZACIÓN DE DATOS
      {
        category: 'actualiza',
        title: selectedPayroll?.name || "Seleccione una pagaduría",
        description: selectedPayroll?.i_description || "Seleccione una pagaduría",
        contact: [
          { type: 'email', value: selectedPayroll?.i_email || "Seleccione una pagaduría" },
          { type: 'phone', value: selectedPayroll?.i_phone || "Seleccione una pagaduría" }
        ]
      },
      // ENROLAMIENTO
      {
        category: 'enrolamiento',
        title: 'Enrolamiento con autorización a tercero',
        description: 'Desea registrarse en Dibanka. Se validan los datos, autoriza a la señora a recibir la información; se le indican los pasos para el ingreso, por la opción registrarme asigna contraseña, realiza el registro biométrico culminando con un enrolamiento exitoso.'
      },
      {
        category: 'enrolamiento',
        title: 'Enrolamiento',
        description: 'Desea registrarse en Dibanka. Se validan los datos, se le indican los pasos para el ingreso, por la opción registrarme asigna contraseña, realiza el registro biométrico culminando con un enrolamiento exitoso.'
      },
      // RECUPERAR CONTRASEÑA
      {
        category: 'contra',
        title: 'Restablecimiento de contraseña',
        description: 'Afiliado se comunicó por qué necesita restablecer la contraseña, se hace validación de datos y cuenta con datos actualizados, se le indica que se va a restablecer contraseña, se procede a enviar video de WhatsApp donde le van brindar paso a paso para el restablecimiento de contraseña',
        action: 'Se envía el video por medio de WhatsApp con el paso a paso para el restablecimiento de la contraseña'
      },
      {
        category: 'contra',
        title: 'Restablecimiento de contraseña con autorización',
        description: 'Afiliado indica que desea restablecer la contraseña de Dibanka. Se validan los datos, autoriza a la señora _____________ a recibir la información; se le indica que se transferirá con un audio que le indicara el paso a paso para el restablecimiento'
      },
      {
        category: 'contra',
        title: 'Restablecimiento de contraseña sin datos actualizados',
        sections: [
          {
            subtitle: 'CASUR',
            description: 'Afiliado se comunicó por qué necesita restablecer la contraseña. Se validan los datos, se evidencia desactualizados, se le informa que debe solicitar el formato de actualización al correo citse@casur.gov.co una vez cuente con el formato, lo diligencia y lo envía al correo que le acabo de indicar junto con la copia de su cédula.',
            contact: [
              { type: 'email', value: 'citse@casur.gov.co' }
            ]
          },
          {
            subtitle: 'FPS',
            description: 'Pensionado se comunicó por qué necesita restablecer la contraseña. Se validan los datos, se evidencia desactualizados, se le informa que debe actualizar datos, enviar un correo electrónico a correspondencia@fps.gov.co indicando nombre completo, cédula, celular, correo electrónico, dirección, ciudad y departamento; se le sugiere comunicarse cuando cuente con N° radicado.',
            contact: [
              { type: 'email', value: 'correspondencia@fps.gov.co' }
            ]
          }
        ]
      },
      // SOLICITUD CRÉDITO
      {
        category: 'credito',
        title: 'Solicitud de crédito sin pre-aprobado',
        description: 'desea asesoría para el ingreso de la solicitud. Se validan los datos, no cuenta con el pre aprobado, se le indica que desde la plataforma podrá realizar una simulación con el fin de evidenciar las entidades o puede comunicarse con la entidad que desee realizar la solicitud y cuando cuente con la información comunicarse a la línea Dibanka para radicar el crédito. '
      },
      {
        category: 'credito',
        title: 'Solicitud de crédito exitosa',
        description: 'desea asesoría para el ingreso de la solicitud. Se validan los datos, se le sugiere ingresar a la plataforma, se le indican pasos para el ingreso, realiza el registro biométrico y se culmina el ingreso de la solicitud de forma exitosa.'
      },
      // BLOQUEOS
      {
        category: 'bloqueos',
        title: 'BLOQUEO DESCUENTO EN COLA ',
        action: 'CUANDO SOLO SE BRINDA INFORMACIÓN DE DESCUENTO EN COLA LA PLANTILLA EN MESSI ES DESBLOQUEO DESCUENTO EN COLA',
        sections: [
          {
            subtitle: 'información general des-cola',
            description: 'indica que presenta un bloqueo por descuento en cola y desea validar la razón. Se validan los datos, se le informa que es con la entidad __________ debe comunicarse con ellos para llegar a un acuerdo y se pueda retirar el bloqueo. ',
          },
          {
            subtitle: 'envío a soporte - ticket en validación',
            description: 'indica que presenta un bloqueo por descuento en cola, envió la solicitud a soporte y desea validar una respuesta. Se validan los datos, se le indica que la solicitud fue recibida bajo el N°  esta se encuentra en validación nos comunicaremos cuando contemos con una respuesta.',
          },
          {
            subtitle: 'en validación',
            description: 'indica que tiene un bloqueo por descuento en cola y desea validar si ya tenemos una respuesta. Se validan los datos, se le informa que la solicitud está en validación bajo el N° ____ nos comunicaremos cuando contemos con una respuesta. ',
          },
        ]
      },
      {
        category: 'bloqueos',
        title: 'CASUR (INGRESO CONCEPTO 222)',
        description: 'Afiliado indica que presenta un bloqueo por descuento en cola y desea validar la razón. Se validan los datos, se le informa que es con la entidad __________ debido a que se evidencia con el estado Descuento en Cola ya que ingresó el descuento bajo el concepto 222 (Bienestar social de la policía nacional) debe esperar a la siguiente apertura para que se normalice el ingreso del descuento a la nómina.'
      },
      {
        category: 'bloqueos',
        title: 'BLOQUEO ESPECIAL DE NOMINA',
        description: 'indica que al intentar ingresar a Dibanka le aparece un bloqueo especial de nómina y desea validar la razón. Se validan los datos, se le informa que es un bloqueo preventivo que se genera en la plataforma debido a que se está tomando el 50% de las asignación salarial. '
      },
      {
        category: 'bloqueos',
        title: 'BLOQUEO BAJA PAGADURÍA',
        description: 'indica que cuenta con un bloqueo de BAJAPAGADURIA y desea validar la razón y para cuando le será retirado el bloqueo. Se validan los datos, se le indica que es debido a una actualización en la DATA que se está realizando por parte de Dibanka. '
      },
      {
        category: 'bloqueos',
        title: 'BLOQUEO POR INTENTOS FALLIDOS',
        description: 'indica que al ingresar a la plataforma  evidencia un bloqueo por intentos fallidos. Se validan los datos, se le indica que se transferirá con un audio que le indicara el paso a paso para el restablecimiento '
      },
      {
        category: 'bloqueos',
        title: 'BLOQUEO INICIO DE SESIÓN EN OTRO DISPOSITIVO',
        description: 'indica que intenta ingresar a la plataforma pero evidencia un bloqueo de inicio de sesión en otro dispositivo. Se validan los datos, se le indica que el bloqueo se presenta debido a que se ingresó a la plataforma y no se cerró de forma correcta debe esperar 5 minutos para que le permita el acceso nuevamente, se le sugiere cerrar correctamente la plataforma desde la parte superior derecha en la casilla salir. '
      },
      {
        category: 'bloqueos',
        title: 'BLOQUEO POR SEGURIDAD',
        description: 'indica que al ingresar a la plataforma evidencia un bloqueo por seguridad. Se validan los datos, se evidencia bloqueo; se le informa que el bloqueo es debido a inconsistencia en el registro biométrico se le solicita el envío de una carta indicando lo sucedido y solicitando el desbloqueo, adjuntando copia de cédula, y copia del carnet institucional/desprendible de nomina enviar al correo soporte@dibanka.co con copia al correo desde el correo institucional'
      },
    ];

  // ==========================
  // RETORNO DEL HOOK
  // ==========================
  return {
    infoItems,
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
