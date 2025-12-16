import { useContext, useEffect } from "react";
import { AuthContext } from "@context/AuthContext";
import { useTour } from "@context/TourContext";
import StatCard from "@components/ui/StatCard";
import TableSkeleton from "@components/tables/TableSkeleton";
import useDashboard from "@modules/dashboard/hooks/useDashboard";
import callie_3 from "@assets/callie_3.webp";
import { useManagement } from "@modules/management/hooks/useManagement.js";

import {
    FaUserCircle,
    FaUsers,
    FaChartBar,
    FaUniversity,
    FaQuestionCircle,
} from "react-icons/fa";
import { BiSolidContact } from "react-icons/bi";

function Dashboard() {
    const { user, loading, dataCounts } = useDashboard();
    const { management } = useManagement();
    const { user: authUser } = useContext(AuthContext);
    const { startTour } = useTour();

    useEffect(() => {
        const hasSeenTour = localStorage.getItem("hasSeenTour");
        if (!hasSeenTour) {
            startTour();
            localStorage.setItem("hasSeenTour", "true");
        }
    }, [startTour]);

    // if (loading) return <Loader />;

    const filteredManagement =
        management?.filter((item) => item.user?.id === authUser?.id) || [];

    const statsCards = [
        {
            title: "Contactos Registrados",
            value: dataCounts.contacts,
            icon: <FaUsers size={28} className="text-blue-500" />,
        },
        {
            title: "Casos especiales",
            value: dataCounts.specialcases,
            icon: <FaChartBar size={28} className="text-green-500" />,
        },
        {
            title: "Pagadurías Activas",
            value: dataCounts.payrolls,
            icon: <FaUniversity size={28} className="text-purple-500" />,
        },
        {
            title: "Tipos de Gestiones",
            value: dataCounts.typeManagement,
            icon: <BiSolidContact size={28} className="text-yellow-500" />,
        },
    ];

    return (
        <div className="p-4 md:p-8 space-y-8 mx-12 ml-20 -mt-10">
            {/* --- Banner de Bienvenida --- */}
            <div className="relative flex items-center justify-between p-8 text-white bg-gradient-primary rounded-2xl shadow-lg overflow-hidden">
                <div className="space-y-2">
                    <h1 className="text-3xl md:text-4xl font-bold">
                        ¡Hola, {authUser?.name?.toUpperCase() || "indefinido"}!
                    </h1>
                    <p className="text-white text-lg">
                        Bienvenido de nuevo a la plataforma.
                    </p>
                </div>
                <img
                    src={callie_3}
                    alt="Callie, el asistente"
                    className="hidden lg:block w-auto h-56 -mb-16 -mr-8"
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsCards.map((stat, index) => (
                    <StatCard key={index} stat={stat} loading={loading} />
                ))}
            </div>

            {loading ? (

                <TableSkeleton title="Últimas Gestiones Realizadas" rows={4} />

            ) : (
                <div className="bg-white p-6 rounded-xl shadow-md mt-8">
                    <h3 className="font-bold text-lg text-gray-700 mb-4">
                        Últimas Gestiones Realizadas
                    </h3>
                    <div className="overflow-x-auto">
                        {filteredManagement.length > 0 ? (
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">
                                            Agente
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Pagaduría
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Tipo de Gestión
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Fecha
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredManagement.slice(0, 5).map((item) => (
                                        <tr
                                            key={item.id}
                                            className="bg-white border-b hover:bg-gray-50"
                                        >
                                            <th
                                                scope="row"
                                                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap flex items-center"
                                            >
                                                <FaUserCircle
                                                    className="mr-2 text-gray-400"
                                                    size={20}
                                                />
                                                {item.user.name}
                                            </th>
                                            <td className="px-6 py-4">
                                                {item.contact.payroll.name}
                                            </td>
                                            <td className="px-6 py-4">
                                                {item.type_management.name}
                                            </td>
                                            <td className="px-6 py-4">
                                                {new Date(
                                                    item.created_at
                                                ).toLocaleDateString("es-CO", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-10 text-center">
                                <FaChartBar
                                    className="text-purple-400 mb-3"
                                    size={36}
                                />
                                <p className="text-gray-600 text-lg font-medium">
                                    Aún no tienes gestiones registradas.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )
            }

        </div>
    );
}

export default Dashboard;
