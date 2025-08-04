import React, { useEffect } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const Alert = ({ message, onClose }) => {
    const MySwal = withReactContent(Swal);

    useEffect(() => {
        if (message) {
            MySwal.fire({
                title: <i>Éxito</i>,
                html: <p>{message}</p>,
                icon: "success",
            }).then(() => {
                onClose();
            });
        }
    }, [message]);

    return null;
};

export default Alert;
