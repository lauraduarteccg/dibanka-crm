import { useState, useContext, useEffect } from "react";
import { AuthContext } from "@context/AuthContext";
import Swal from "sweetalert2";
import { useAddManagement } from "@modules/management/hooks/useAddManagement";
import api from "@api/axios";

export const useSpecialCasesForm = () => {
  const { user } = useContext(AuthContext);
  const location = window.location;
  const [openSpecialCases, setOpenSpecialCases] = useState(false);

  const {
    payroll,
    contact,
    consultation,
    typeManagement,
    specific,
  } = useAddManagement();

  const [selectedPayrollSpecial, setSelectedPayrollSpecial] = useState(null);
  const [selectedContactSpecial, setSelectedContactSpecial] = useState(null);

  const [formData, setFormData] = useState({
    user_id: user?.id || "",
    payroll_id: "",
    contact_id: "",
    management_messi: "",
    id_call: "",
    id_messi: "",
  });

  const [validationErrorsSpecial, setValidationErrorsSpecial] = useState({});
  const [autoFilled, setAutoFilled] = useState(false); // 👈 Para evitar ejecuciones múltiples

  // ===================================================
  // AUTO LLENADO POR PARÁMETROS DE LA URL
  // ===================================================
  useEffect(() => {
    if (!payroll?.length || !contact?.length || autoFilled) return;

    const params = new URLSearchParams(location.search);
    const payrollParam = params.get("payroll");
    const idNumberParam = params.get("identification_number");

    // Si no hay parámetros, no hacemos nada
    if (!payrollParam && !idNumberParam) return;

    // Buscar la pagaduría
    const foundPayroll =
      payroll.find(
        (p) => p.name?.toLowerCase().trim() === payrollParam?.toLowerCase().trim()
      ) || null;

    // Buscar el contacto
    const foundContact =
      contact.find(
        (c) =>
          c.identification_number?.toString().trim() ===
          idNumberParam?.toString().trim()
      ) || null;

    if (foundPayroll) setSelectedPayrollSpecial(foundPayroll);
    if (foundContact) setSelectedContactSpecial(foundContact);

    // Para no volver a ejecutar este bloque
    setAutoFilled(true);
  }, [location.search, payroll, contact, autoFilled]);

  // ===================================================
  // ENVIAR FORMULARIO
  // ===================================================
  const handleSubmit = async () => {
    const payload = {
      user_id: user?.id,
      payroll_id: selectedPayrollSpecial?.id,
      contact_id: selectedContactSpecial?.id,
      management_messi: formData.management_messi,
      id_call: formData.id_call,
      id_messi: formData.id_messi,
    };

    try {
      const { data } = await api.post("/specialcases", payload);

      Swal.fire({
        icon: "success",
        title: "Éxito",
        text: data.message || "Caso especial guardado correctamente",
        confirmButtonText: "Aceptar",
      });

      // Reiniciar estados
      setFormData({
        management_messi: "",
        id_call: "",
        id_messi: "",
      });
      setSelectedPayrollSpecial(null);
      setSelectedContactSpecial(null);
      setValidationErrorsSpecial({});
      setOpenSpecialCases(false);
    } catch (error) {
      console.log("❌ Error del servidor:", error.response?.data);
      if (error.response?.status === 422) {
        setValidationErrorsSpecial(
          error.response.data.errors || error.response.data.data || {}
        );
      } else {
        Swal.fire("❌ Error", "No se pudo guardar el caso especial", "error");
      }
    }
  };
  
  const onClose = () =>{
    setFormData({
        management_messi: "",
        id_call: "",
        id_messi: "",
    })
      setSelectedPayrollSpecial(null);
      setSelectedContactSpecial(null);
      setValidationErrorsSpecial({});
      setOpenSpecialCases(false);
  }

  const clearFieldError = (field) => {
    if (validationErrorsSpecial?.[field]) {
      setValidationErrorsSpecial((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  return {
    onClose,
    clearFieldError,
    user,
    payrollSpecial: payroll,
    contact,
    consultation,
    typeManagement,
    specific,
    selectedPayrollSpecial,
    setSelectedPayrollSpecial,
    selectedContactSpecial,
    setSelectedContactSpecial,
    formData,
    setFormData,
    validationErrorsSpecial,
    setValidationErrorsSpecial,
    handleSubmit,
    openSpecialCases,
    setOpenSpecialCases,
  };
};
