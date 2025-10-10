import Card from "@modules/dashboard/components/Card";
import Counter from "@modules/dashboard/components/Counter";
import Loader from "@components/ui/Loader";
import useDashboard from "@modules/dashboard/hooks/useDashboard";
import callie_3 from '@assets/callie_3.webp';
import { useManagement } from "@modules/management/hooks/useManagement.js";
import { FaUserCircle } from 'react-icons/fa';
// 1. Importa los íconos desde react-icons/fa (Font Awesome)
import { FaUsers, FaChartBar, FaUniversity, FaQuestionCircle } from 'react-icons/fa';

function Dashboard() {
    const { user, loading, dataCounts } = useDashboard();
    const { management } = useManagement();

    if (loading ) return <Loader />;

    // Array para renderizar las tarjetas, ahora con los nuevos íconos.
    const statsCards = [
        {
            title: "Contactos Registrados",
            value: dataCounts.contacts,
            // 2. Usa el componente del ícono directamente
            icon: <FaUsers size={28} className="text-blue-500" />
        },
        {
            title: "Gestiones Realizadas",
            value: dataCounts.management,
            icon: <FaChartBar size={28} className="text-green-500" />
        },
        {
            title: "Pagadurías Activas",
            value: dataCounts.payrolls,
            icon: <FaUniversity size={28} className="text-purple-500" />
        },
        {
            title: "Tipos de Consultas",
            value: dataCounts.consultations,
            icon: <FaQuestionCircle size={28} className="text-yellow-500" />
        }
    ];

    return (
        <div className="p-4 md:p-8 space-y-8 mx-12 ml-20 -mt-10">
            {/* --- Banner de Bienvenida (sin cambios en su estructura) --- */}
            <div className="relative flex items-center justify-between p-8 text-white bg-gradient-primary rounded-2xl shadow-lg overflow-hidden">
                <div className="space-y-2">
                    <h1 className="text-3xl md:text-4xl font-bold">
                        ¡Hola, {user?.name?.toUpperCase() || "ADMINISTRADOR"}!
                    </h1>
                    <p className="text-indigo-200 text-lg">
                        Bienvenido de nuevo a la plataforma.
                    </p>
                </div>
                <img 
                    src={callie_3} 
                    alt="Callie, el asistente" 
                    className="hidden lg:block w-auto h-56 -mb-16 -mr-8"
                />
            </div>

            {/* --- Grid de Estadísticas con íconos de react-icons --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsCards.map((stat, index) => (
                    // 3. Tarjeta sin animaciones de hover complejas
                    <div 
                        key={index}
                        className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl" // Se mantiene un sutil efecto de sombra
                    >
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                                <span className="text-4xl font-bold text-gray-800">
                                    <Counter value={stat.value} />
                                </span>
                            </div>
                            <div className="bg-gray-100 p-3 rounded-full">
                                {stat.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md mt-8">
                <h3 className="font-bold text-lg text-gray-700 mb-4">Últimas Gestiones Realizadas</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Agente</th>
                                <th scope="col" className="px-6 py-3">Pagaduria</th>
                                <th scope="col" className="px-6 py-3">Tipo de Gestión</th>
                                <th scope="col" className="px-6 py-3">Fecha</th>
                            </tr>
                        </thead>
                        {console.log(management)}
                        <tbody>
                             {management.slice(0, 5).map((item) => (
                                <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap flex items-center">
                                        <FaUserCircle className="mr-2 text-gray-400" size={20} />
                                        {item.user.name}
                                    </th>
                                    <td className="px-6 py-4">{item.payroll.name}</td>
                                    <td className="px-6 py-4">{item.type_management.name}</td>
                                    <td className="px-6 py-4">{new Date(item.created_at).toLocaleDateString("es-CO", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric"
                                    })}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}

export default Dashboard;