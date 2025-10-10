/**
 * Envía datos a Wolkvox según los canales seleccionados.
 *
 * @param {object} data - Los datos del cliente.
 */
const sendData = (data) => {
  // Determinar los canales a enviar
  let channels = [];

  if (data["Enviar SMS de canal de whastapp"] === "SI") channels.push("sms");
  if (data["Enviar WhatsApp de recuperar contraseña"] === "SI") channels.push("whatsapp");

  channels = channels.join(",");

  // Si no hay canales seleccionados, no hace nada
  if (!channels.length) return;

  const payload = JSON.stringify({
    nombre: data["Nombre del Cliente"],
    telefono: data["Telefono"],
    pagaduria: data["Pagaduria"],
    idWolkvox: data["IdWolkvox"],
    channels: channels,
  });

  fetch("http://localhost:8000/dibanka/insert/insert.php", {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: payload,
  })
    .then((response) => console.log("Datos enviados a Wolkvox"))
    .catch((error) => console.error("Error enviando a Wolkvox:", error));
};

export { sendData };
