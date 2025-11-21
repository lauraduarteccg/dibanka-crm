// steps.js
import React from "react";

const steps = [
    // CONTACTOS
    {
        target: "#primer-paso",
        title: "📋 Módulo de Contactos",
        content: (
            <div>
                <p className="mb-2">
                    Bienvenido al <strong>Módulo de Contactos</strong>. Aquí
                    podrás gestionar toda la información de tus clientes.
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
                    Funciona por nombre, teléfono, identificación, etc.
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
                    Aquí ves todas las <strong>gestiones asociadas</strong>.
                </p>
                <p className="text-sm text-gray-600">
                    Tiene historial completo del cliente.
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
                <p className="mb-2">
                    Administra todas las <strong>gestiones</strong>.
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
                    Observa los <strong>detalles completos</strong>.
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
                    Agrega <strong>seguimiento</strong> a una gestión.
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
                    Encuentra gestiones <strong>fácilmente</strong>.
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
                    Accede al módulo de <strong>casos especiales</strong>.
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
            </div>
        ),
        placement: "bottom",
    },
    {
        target: "#dieciseisavo-paso",
        title: "📋 Menú de Configuración",
        content: (
            <div>
                <p className="mb-2">
                    Accede a usuarios, perfiles, consultas, etc.
                </p>
            </div>
        ),
        placement: "bottom",
    },
];

export default steps;
