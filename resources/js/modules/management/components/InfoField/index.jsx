import { useState } from "react";
import { IconButton, Tooltip } from "@mui/material";
import { FiCheck } from "react-icons/fi";
import { MdContentCopy } from "react-icons/md";

export default function InfoField({ label, value, fieldName }) {
  const [copiedField, setCopiedField] = useState(null);

  const handleCopyToClipboard = (text, fieldName) => {
    if (text && text !== "—") {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  return (
    <div className="group relative bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-all duration-200">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            {label}
          </p>
          <p className="text-base font-medium text-gray-900 break-words">
            {value ?? "—"}
          </p>
        </div>
        <Tooltip title={copiedField === fieldName ? "¡Copiado!" : "Copiar"}>
          <IconButton
            size="small"
            onClick={() => handleCopyToClipboard(value, fieldName)}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            disabled={!value || value === "—"}
          >
            {copiedField === fieldName ? (
              <FiCheck className="w-4 h-4 text-green-600" />
            ) : (
              <MdContentCopy className="w-4 h-4 text-gray-600" />
            )}
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
}