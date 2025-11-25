import { useEffect } from "react";

export default function Agent() {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "module";
    script.defer = true;
    script.innerHTML = `
      import n8nChatUiWidget from 'https://proxy.n8nchatui.com/api/embed/VKfShM';
      n8nChatUiWidget.load();
    `;
    document.body.appendChild(script);
  }, []);

  return null; // no se renderiza nada
}
