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

    // Cleanup: remove script when component unmounts
    return () => {
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
      // Also remove the chatbot widget if it exists
      const chatWidget = document.querySelector('[data-n8n-chat-widget]');
      if (chatWidget) {
        chatWidget.remove();
      }
    };
  }, []);

  return null; // no se renderiza nada
}
