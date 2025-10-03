import { useRef, useState, useEffect } from "react";
import {
  Box,
  Button,
  IconButton,
  Typography,
  Avatar,
  FormControl,
  FormHelperText,
} from "@mui/material";
import { FaCloudUploadAlt, FaTimes } from "react-icons/fa";

export default function PrettyFileInput({
  name,
  label = "Subir archivo",
  accept = "image/*",
  multiple = false,
  value = null,          // Puede ser File o URL (string)
  onChange = () => {},
  helperText = "",
  error = false,
}) {
  const inputRef = useRef(null);
  const [files, setFiles] = useState([]);

  // 🔹 Si el value viene como string (URL desde BD), lo mostramos
  useEffect(() => {
    if (value) {
      if (typeof value === "string") {
        setFiles([{ preview: value, name: "Imagen actual" }]);
      } else if (value instanceof File) {
        setFiles([value]);
      }
    } else {
      setFiles([]);
    }
  }, [value]);

  const handleClick = () => inputRef.current?.click();

  const handleFiles = (fileList) => {
    const arr = multiple ? Array.from(fileList) : [fileList[0]];
    setFiles(arr);
    onChange(multiple ? arr : arr[0] ?? null);
  };

  const handleChange = (e) => handleFiles(e.target.files);

  const removeFile = (idx) => {
    const newFiles = files.filter((_, i) => i !== idx);
    setFiles(newFiles);
    onChange(multiple ? newFiles : newFiles[0] ?? null);
  };

  return (
    <FormControl error={error} fullWidth>
      <input
        ref={inputRef}
        type="file"
        name={name}
        accept={accept}
        style={{ display: "none" }}
        multiple={multiple}
        onChange={handleChange}
      />

      <Box
        sx={{
          border: "1px dashed",
          borderColor: "divider",
          p: 2,
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          gap: 2,
          bgcolor: "background.paper",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, flex: 1 }}>
          {files.length > 0 ? (
            <>
              {/* preview de la imagen */}
              {files.map((f, i) => {
                const src = f.preview
                  ? f.preview // URL de la BD
                  : URL.createObjectURL(f); // File seleccionado
                return (
                  <Box
                    key={i}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mt: 0.5,
                    }}
                  >
                    <Avatar src={src} alt={f.name} sx={{ width: 40, height: 40 }} />
                    <Typography variant="body2" noWrap sx={{ maxWidth: 220 }}>
                      {f.name || "Imagen actual"}
                    </Typography>

                    {/* Botón para cambiar */}
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={handleClick}
                    >
                      Cambiar
                    </Button>

                    {/* Botón para eliminar */}
                    <IconButton
                      size="small"
                      onClick={() => removeFile(i)}
                      aria-label="Eliminar archivo"
                    >
                      <FaTimes size={14} />
                    </IconButton>
                  </Box>
                );
              })}
            </>
          ) : (
            <Button
              variant="contained"
              startIcon={<FaCloudUploadAlt />}
              onClick={handleClick}
              sx={{ textTransform: "none", borderRadius: 2 }}
            >
              {label}
            </Button>
          )}
        </Box>
      </Box>

      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}
