import Card from "@modules/dashboard/components/Card";
import Counter from "@modules/dashboard/components/Counter";
import Loader from "@components/ui/Loader";
import useDashboard from "@modules/dashboard/hooks/useDashboard";

function Dashboard() {
    const { user, loading, dataCounts } = useDashboard();

    if (loading) return <Loader />;

    return (
        <div className="flex flex-col">
            <div className="flex flex-grow items-center justify-center p-6 w-full">
                <div className="flex flex-col items-center gap-12 w-full max-w-6xl">
                    <Card
                        title={`¡HOLA ${user?.name?.toUpperCase() || "USUARIO"
                            }!`}
                        subtitle="BIENVENIDO A LA PLATAFORMA"
                        description="Gestiona clientes, campañas y más desde un solo lugar."
                        width="w-full"
                        padding={6}
                        rounded="xl"
                        className="text-center"
                    />

                    <div className="flex flex-col md:flex-row justify-center gap-6 w-full">
                        <Card
                            title={<Counter value={dataCounts.contacts} />}
                            subtitle="Contactos Registrados"
                        />
                        <Card
                            title={<Counter value={dataCounts.management} />}
                            subtitle="Gestiones Realizadas"
                        />
                        <Card
                            title={<Counter value={dataCounts.payrolls} />}
                            subtitle="Pagadurías Activas"
                        />
                        <Card
                            title={<Counter value={dataCounts.consultations} />}
                            subtitle="Tipos de Consultas"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
