import {  
  MdPhone, 
  MdDescription, 
  MdEmail, 
  MdCalendarToday, 
  MdAttachMoney, 
  MdPeople, 
  MdSearch 
} from 'react-icons/md';
import { PiWarningCircleLight } from "react-icons/pi";
import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom"; // 👈 para leer parámetros
import { getActivePayrolls } from "@modules/management/services/managementService";

const PopupInfoPayroll = () => {
  const [searchParams] = useSearchParams();
  const payrollId = searchParams.get("payroll_id"); // 👈 capturamos el parámetro
  const [selectedPayroll, setSelectedPayroll] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  // 🔹 Llamar al servicio cuando tengamos el payrollId
  const fetchPayroll = useCallback(async () => {
    if (!payrollId) return;
    setLoading(true);
    try {
      const data = await getActivePayrolls(); // o si tienes un endpoint por id, cámbialo a getPayrollById(payrollId)
      const payroll = data.find((p) => p.id == payrollId); // buscar el que coincida
      if (payroll) setSelectedPayroll(payroll);
    } catch (error) {
      console.error("Error al obtener pagaduría:", error);
    } finally {
      setLoading(false);
    }
  }, [payrollId]);

  useEffect(() => {
    fetchPayroll();
  }, [fetchPayroll]);

  // Mientras carga
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        Cargando información de la pagaduría...
      </div>
    );
  }

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

  const categories = [
    { id: 'all', name: 'Todo', icon: <MdPeople size={18} /> },
    { id: 'general', name: 'General', icon: <MdCalendarToday size={18} /> },
    { id: 'actualiza', name: 'Actualización', icon: <MdDescription size={18} /> },
    { id: 'enrolamiento', name: 'Enrolamiento', icon: <MdPeople size={18} /> },
    { id: 'contra', name: 'Contraseña', icon: <MdCalendarToday size={18} /> },
    { id: 'credito', name: 'Solicitud crédito', icon: <MdAttachMoney size={18} /> },
    { id: 'bloqueos', name: 'Bloqueos', icon: <PiWarningCircleLight size={23} /> },
  ];

  const tickets = [
    {
      type: 'afiliados',
      message: 'Se intentó generar comunicación con el afiliado en varias ocasiones y se va a buzón de voz.',
      action: 'Por favor comunicarse a la línea 6012193096 para validar su solicitud.'
    },
    {
      type: 'operador',
      message: 'Se intentó generar comunicación con el Operador en varias ocasiones y se va a buzón de voz.',
      action: 'Por favor comunicarse a la línea 6012193096 para validar su solicitud.'
    }
  ];

  const normalizeText = (text) => text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  const filteredItems = (infoItems || []).filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    if (searchTerm === '') return matchesCategory;

    const searchNormalized = normalizeText(searchTerm);
    const matchesSearch = 
      normalizeText(item.title).includes(searchNormalized) ||
      (item.description && normalizeText(item.description).includes(searchNormalized)) ||
      (item.action && normalizeText(item.action).includes(searchNormalized)) ||
      normalizeText(item.category).includes(searchNormalized) ||
      (item.items && item.items.some(subItem => normalizeText(subItem).includes(searchNormalized))) ||
      (item.contact && item.contact.some(c => normalizeText(c.value).includes(searchNormalized))) ||
      (item.sections && item.sections.some(section => 
        normalizeText(section.subtitle).includes(searchNormalized) ||
        normalizeText(section.description).includes(searchNormalized) ||
        (section.contact && section.contact.some(c => normalizeText(c.value).includes(searchNormalized)))
      ));

    return matchesCategory && matchesSearch;
  });

  return (
<div className="fixed inset-0 z-50 flex items-center justify-center">
  <div 
    className="relative w-full h-full bg-white rounded-none shadow-xl overflow-hidden border"
    style={{ animation: 'slideUp 0.3s ease-out' }}
  >
        {/* Header */}
        <div className="flex bg-purple-light p-3">
          <div className="w-full m-2">
            <div className="relative">
              <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar información..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white/95 backdrop-blur-md border border-white/50 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Categorías */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 overflow-x-auto">
          <div className="flex gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-purple-light text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-100 hover:text-gray-900 shadow-sm border border-gray-200'
                }`}
              >
                {cat.icon}
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Contenido */}
        <div className="overflow-y-auto p-6 space-y-4 bg-gray-50" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          {filteredItems.map((item, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl p-5 hover:border-purple-400 transition-all duration-300 hover:shadow-lg"
              style={{ animation: `fadeIn 0.3s ease-out ${index * 0.05}s both` }}
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span className="text-purple-600">
                  {categories.find(c => c.id === item.category)?.icon}
                </span>
                {item.title}
              </h3>

              {item.description && <p className="text-gray-600 mb-2">{item.description}</p>}

              {item.action && (
                <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-r mb-3">
                  <p className="text-blue-800 text-sm font-medium">✓ {item.action}</p>
                </div>
              )}

              {item.items && (
                <ul className="space-y-2">
                  {item.items.map((subItem, subIndex) => (
                    <li key={subIndex} className="flex items-start gap-2 text-gray-700">
                      <span className="text-purple-500 mt-1 font-bold">▸</span>
                      <span>{subItem}</span>
                    </li>
                  ))}
                </ul>
              )}

              {item.sections && (
                <div className="space-y-4 mt-3">
                  {item.sections.map((section, secIndex) => (
                    <div key={secIndex} className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border-l-4 border-purple-500">
                      <h4 className="font-bold text-purple-700 mb-2 text-lg">{section.subtitle}</h4>
                      <p className="text-gray-700 mb-3">{section.description}</p>
                      {section.contact && (
                        <div className="flex flex-wrap gap-2">
                          {section.contact.map((c, i) => (
                            <div key={i} className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-purple-200">
                              {c.type === 'email' ? <MdEmail size={16} className="text-blue-600" /> : <MdPhone size={16} className="text-green-600" />}
                              <span className="text-gray-700 text-sm font-mono">{c.value}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {item.contact && !item.sections && (
                <div className="mt-3 flex flex-wrap gap-3">
                  {item.contact.map((c, i) => (
                    <div key={i} className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg border border-gray-200">
                      {c.type === 'email' ? <MdEmail size={16} className="text-blue-600" /> : <MdPhone size={16} className="text-green-600" />}
                      <span className="text-gray-700 text-sm font-mono">{c.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Tickets */}
          <div className="mt-6 pt-6 border-t border-gray-300">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <PiWarningCircleLight className="text-amber-500" size={24} />
              Tickets de Seguimiento
            </h3>
            <div className="space-y-3">
              {tickets.map((ticket, index) => (
                <div key={index} className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-amber-100 p-2 rounded-lg">
                      <PiWarningCircleLight className="text-amber-600" size={20} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-amber-800 mb-2 uppercase text-sm">{ticket.type}</h4>
                      <p className="text-gray-700 text-sm mb-2">{ticket.message}</p>
                      <p className="text-amber-700 text-sm font-medium">{ticket.action}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default PopupInfoPayroll;
