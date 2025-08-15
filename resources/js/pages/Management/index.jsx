import Table from "@components/Table";
import { useManagement } from "./useManagement.js";
import Drawer from '@mui/material/Drawer';
import ButtonAdd from "@components/ButtonAdd";
import FormAdd from "@components/FormAddTest";
import Loader from "@components/Loader";


const columns = [
  { header: "ID", key: "id" },
  { header: "Nombre de usuario", key: "usuario_name" },
  { header: "Pagaduria", key: "campaign_name" },
  { header: "Consulta", key: "consultation_title" },
  { header: "Nombre de contacto", key: "contact_name" },
];

    const P = ({ text1, text2 }) => (
        <p className="text-gray-600 leading-relaxed">
            <strong className="text-gray-700">{text1}</strong>
            <span className="text-gray-900 ml-1">{text2}</span>
        </p>
    );


const Management = () => {
    const {
        management,
        view,
        setView,
        formData,
        loading,
        setFormData,
        currentPage,
        totalPages,
        fetchManagement,
    } = useManagement();

    
    const handleView = (item) => {
        setFormData(item); // guardamos los valores del item
        setView(true);     // abrimos el Drawer
    };

    return (
        <>
            <ButtonAdd
                onClickButtonAdd={() => setIsOpenADD(true)}
                text="Agregar Gestión"
            />
            <h1 className="text-2xl font-bold text-center mb-4 text-purple-mid">
                Lista de gestiones
            </h1>
            {loading ? (
                <Loader />
            ) : (
                <Table
                    columns={columns}
                    data={management ?? []}  
                    currentPage={currentPage}
                    fetch={fetchManagement}
                    totalPages={totalPages}
                    actions={true}
                    view={true}
                    onView={(item) => handleView(item)}
                    edit={false}
                    onActiveOrInactive={false}
                />
            )}

            <Drawer open={view} 
                    onClose={() => setView(false)} 
                    anchor="right" 
                    PaperProps={{
                    sx: {
                    backgroundColor: "#f3f3f3",  // color de fondo
                    width: 450,
                    padding: 3,
                    }
                }}
            >
                <div className="flex flex-col gap-4">
                    {/* Botón cerrar */}
                    <button
                    onClick={() => setView(false)}
                    className="self-end text-gray-500 hover:text-gray-800 font-semibold"
                    >
                    ✕ Cerrar
                    </button>

                    {/* Contenedor de información */}
                    <div className="bg-white shadow-md rounded-lg p-5 flex flex-col gap-3">
                        <P text1="Usuario: "    text2={formData.usuario_name ?? "Usuario sin nombre"} />
                        <P text1="Pagaduría: "  text2={formData.campaign_name ?? "Sin pagaduria"} />
                        <P text1="Consulta: "   text2={formData.consultation_title ?? "Sin consulta"}/>
                        <P text1="Contacto: "   text2={formData.contact_name ?? "Sin Contacto"}/>
                    </div>
                </div>
            </Drawer>
        </>
    );
};


export default Management;
