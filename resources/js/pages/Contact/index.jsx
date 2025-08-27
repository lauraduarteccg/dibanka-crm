import Table from "@components/Table";
import ButtonAdd from "@components/ButtonAdd";
import FormAdd from "@components/FormAddTest";
import Loader from "@components/Loader";
import { useContact } from "./useContact.js";
import * as yup from "yup";
import { FaRegComment } from "react-icons/fa6";
import { HiOutlineIdentification } from "react-icons/hi2";
import { PiIdentificationBadgeLight } from "react-icons/pi";
import { SlPhone } from "react-icons/sl";
import { HiOutlineMail } from "react-icons/hi";

const fields = [
    { name: "campaign",                 label: "Campaña",                   type: "text", icon: FaRegComment                },
    { 
        name: "payroll_id", label: "Pagaduría", type: "checklist", icon: FaRegComment,
        options: ({ payroll }) => (payroll || []).map((p) => ({ label: p.name, value: p.id })),
    },
    { name: "name",                     label: "Nombre",                    type: "text", icon: FaRegComment                },
    { name: "email",                    label: "Correo",                    type: "text", icon: HiOutlineMail               },
    { name: "phone",                    label: "Teléfono",                  type: "text", icon: SlPhone                     },
    { name: "update_phone",             label: "Celular actualizado",       type: "text", icon: SlPhone                     },
    { name: "identification_type",      label: "Tipo de identificación",    type: "text", icon: HiOutlineIdentification     },
    { name: "identification_number",    label: "Numero de identificación",  type: "text", icon: PiIdentificationBadgeLight  },
];
const userSchema = yup.object().shape({
    campaign:               yup.string().required("La campaña es obligatorio"),
    payroll_id:             yup.string().required("La pagaduria es obligatorio"),
    name:                   yup.string().required("El nombre es obligatorio").min(6, "Mínimo 6 caracteres"),
    phone:                  yup.string().required("El teléfono es obligatorio"),
    email:                  yup.string().required("El correo electronico es obligatorio"),
    update_phone:           yup.string().required("El celular actualizado es obligatorio"),
    identification_type:    yup.string().required("El tipo es obligatorio"),
    identification_number:  yup.string().required("El número de identificación es obligatorio"),
});
const columns=[ 
    { header: "ID",                         key: "id"                       },
    { header: "Campaña",                    key: "campaign"                 },
    { header: "Pagaduria",                  key: "payroll_name"             },
    { header: "Nombre",                     key: "name"                     },
    { header: "Correo",                     key: "email"                    },
    { header: "Telefono",                   key: "phone"                    },
    { header: "Celular actualizado",        key: "update_phone"             },
    { header: "Tipo de identificación",     key: "identification_type"      },
    { header: "Número de identificación",   key: "identification_number"    },
];   

const Contact = () => {
    const {
        fetchPayroll,
        payroll,
        contact,
        loading,
        error,
        isOpenADD,
        setIsOpenADD,
        formData,
        setFormData,
        validationErrors,
        handleSubmit,
        currentPage,
        totalPages,
        fetchConsultation,
        handleDelete,
        handleEdit,
    } = useContact();

      // Normaliza la selección del checklist a array de ids antes de guardar en formData
    const handleSetSelectedChecklist = (selected) => {
        if (!selected) {
        setFormData((prev) => ({ ...prev, payroll: [] }));
        return;
        }

        if (Array.isArray(selected) && selected.length > 0) {
        const first = selected[0];
        if (typeof first === "object") {
            const ids = selected.map((s) => s.value ?? s.id ?? s);
            setFormData((prev) => ({ ...prev, payroll: ids }));
        } else {
            setFormData((prev) => ({ ...prev, payroll: selected }));
        }
        } else {
        setFormData((prev) => ({ ...prev, payroll: [] }));
        }
    };

    return (
        <>
            <ButtonAdd
                onClickButtonAdd={() => setIsOpenADD(true)}
                text="Agregar contacto"
            />
            <h1 className="text-2xl font-bold text-center mb-4 text-purple-mid">
                Lista de Contactos
            </h1>

            <FormAdd
                isOpen={isOpenADD}
                setIsOpen={setIsOpenADD}
                title="Contactos"
                formData={formData}
                setFormData={setFormData}
                handleSubmit={handleSubmit}
                loading={loading}
                validationErrors={validationErrors}
                fields={fields}
                schema={userSchema}
                checklist={payroll}
                selectedChecklist={formData.payroll || []}
                setSelectedChecklist={handleSetSelectedChecklist}
            />

            {loading ? (
                <Loader />
            ) : (
                <Table
                    columns={columns}
                    data={contact}
                    currentPage={currentPage}
                    fetch={fetchConsultation}
                    onDelete={handleDelete}
                    totalPages={totalPages}
                    actions={true}
                    onEdit={handleEdit}
                />
            )}
        </>
    );
};

export default Contact;
