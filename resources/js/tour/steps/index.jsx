
const steps = [
    // CONTACTOS
    {
        target: "#primer-paso",
        title: "📋 Módulo de Contactos",
        content: (
            <div>
                <p className="mb-2">
                    Bienvenido al <strong>Módulo de Contactos</strong>. Aquí
                    podrás gestionar toda la información de los clientes de DIBANKA.
                </p>
                <p className="text-sm text-gray-600">
                    Haz clic en este botón y luego presiona{" "}
                    <strong>Siguiente</strong>.
                </p>
            </div>
        ),
        placement: "bottom",
        spotlightClicks: true,
    },
    {
        target: "#segundo-paso",
        title: "➕ Agregar Nuevo Contacto",
        content: (
            <div>
                <p className="mb-2">
                    Aquí puedes <strong>crear un nuevo contacto</strong>.
                </p>
                <p className="text-sm text-gray-600">
                    Se abrirá un formulario completo para diligenciar.
                </p>
            </div>
        ),
        placement: "bottom",
    },
    {
        target: "#tercer-paso",
        title: "🔍 Buscar Contactos",
        content: (
            <div>
                <p className="mb-2">
                    Busca contactos <strong>rápidamente</strong>.
                </p>
                <p className="text-sm text-gray-600">
                    Funciona por nombre, teléfono, tipo y numero de 
                    identificación, correo, campaña y pagaduria.
                </p>
            </div>
        ),
        placement: "bottom",
    },
    {
        target: "#cuarto-paso",
        title: "📊 Ver Gestiones",
        content: (
            <div>
                <p className="mb-2">
                    Aquí verás todas las <strong>gestiones</strong> que se le han
                    realizado a este contacto.
                </p>
            </div>
        ),
        placement: "left",
    },
    {
        target: "#quinto-paso",
        title: "✏️ Editar Contacto",
        content: (
            <div>
                <p className="mb-2">
                    Edita la información del <strong>contacto</strong>.
                </p>
                <p className="text-sm text-gray-600">
                    Se abrirá un formulario completo para diligenciar.
                </p>
            </div>
        ),
        placement: "left",
    },
    {
        target: "#sexto-paso",
        title: "🔄 Activar o Desactivar",
        content: (
            <div>
                <p className="mb-2">
                    Activa o desactiva un <strong>contacto</strong>.
                </p>
                <p className="text-sm text-gray-600">
                    No se elimina, solo se oculta del uso normal.
                </p>
            </div>
        ),
        placement: "left",
    },

    // GESTIONES
    {
        target: "#septimo-paso",
        title: "📝 Módulo de Gestiones",
        content: (
            <div>
                <p>Haz clic en este botón y luego presiona <strong>Siguiente</strong>.</p><br />
                <p className="mb-2">
                    Desde aqui podras administrar todas las <strong>gestiones</strong>.
                </p>
            </div>
        ),
        placement: "bottom",
        spotlightClicks: true,
    },
    {
        target: "#octavo-paso",
        title: "👁️ Ver Gestión",
        content: (
            <div>
                <p className="mb-2">
                    Aqui podras observar los <strong>detalles completos</strong> de la gestión.
                </p>
            </div>
        ),
        placement: "left",
    },
    {
        target: "#noveno-paso",
        title: "📈 Añadir Seguimiento",
        content: (
            <div>
                <p className="mb-2">
                    Añade <strong>seguimiento</strong> a una gestión, podras marcarla como
                    resuelta en primer o segundo contacto.
                </p>
            </div>
        ),
        placement: "left",
    },
    {
        target: "#decimo-paso",
        title: "🔎 Buscar Gestiones",
        content: (
            <div>
                <p className="mb-2">
                    Busca gestiones <strong>fácilmente</strong>.
                </p>
                <p>
                    Podrás buscar por <strong>nombre o correo del usuario que creo la gestion</strong>, 
                    pagaduría, seguimiento, consulta, consulta específica, tipo de gestion,
                    wolkvox_id, fecha de solución y <strong>por datos del mismo contacto</strong>.
                </p>
            </div>
        ),
        placement: "bottom",
    },
    {
        target: "#onceavo-paso",
        title: "➕ Nueva Gestión",
        content: (
            <div>
                <p className="mb-2">
                    Registra una <strong>gestión nueva</strong>.
                </p>
            </div>
        ),
        placement: "bottom",
    },

    // CASOS ESPECIALES
    {
        target: "#doceavo-paso",
        title: "📁 Casos Especiales",
        content: (
            <div>
                <p className="mb-2">
                    Accede al módulo en donde se registran los
                    <strong>casos especiales</strong> haciendo clic
                    en este botón.
                </p>
            </div>
        ),
        placement: "bottom",
        spotlightClicks: true,
    },
    {
        target: "#treceavo-paso",
        title: "➕ Nuevo Caso",
        content: (
            <div>
                <p className="mb-2">
                    Registra un <strong>caso especial</strong>.
                </p>
                <p>
                    Se abrirá un formulario completo para diligenciar.
                </p>
            </div>
        ),
        placement: "bottom",
    },
    {
        target: "#catorceavo-paso",
        title: "🔍 Buscar Casos",
        content: (
            <div>
                <p className="mb-2">
                    Busca casos especiales <strong>rápidamente</strong>.
                </p>
                <p>
                    Busca por gestion de mesi, id de la llamada, id de messi, nombre o 
                    del usuario que creo el caso y por informacion del contacto mismo.
                </p>
            </div>
        ),
        placement: "bottom",
    },

    // CONFIGURACIÓN
    {
        target: "#quinceavo-paso",
        title: "⚙️ Configuración",
        content: (
            <div>
                <p className="mb-2">
                    Administra toda la <strong>configuración</strong>.
                </p>
                <p>
                    Haz clic en este botón para acceder a la configuración y luego presiona next.
                </p>
            </div>
        ),
        placement: "bottom",
        spotlightClicks: true,
    },
    {
        target: "#dieciseisavo-paso",
        title: "📋 Menú de Configuración",
        content: (
            <div>
                <p className="mb-2">
                    Aquí podras modificar y configurar todo el sistema. 
                    <br />
                    Puedes <strong>modificar o añadir</strong> usuarios, roles, paagadurias, tipos de consultas,
                    consultas especificas, tipos de gestiones, tipos de seguimientos y 
                    <strong> mirar los logs de actividades</strong> del sistema.
                </p>
            </div>
        ),
        placement: "bottom",
    },
];

export default steps;
