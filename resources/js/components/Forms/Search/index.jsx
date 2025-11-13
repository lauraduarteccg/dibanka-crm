import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";

export default function SearchBar({ id, onSearch, placeholder = "Buscar gestión..." }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) onSearch(value);
  };

  return (
    <div className="flex items-center gap-2">
      <div
        className="
          relative w-full sm:w-auto
          rounded-2xl bg-gradient-primary
          backdrop-blur-sm shadow-md
          transition-colors
        "
        id={id}
      >
        {/* Icono de búsqueda (MUI) */}
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center gap-2 justify-center pl-3 text-white">
          <SearchIcon />
          <div className="w-px h-6 bg-white/50" />
        </div>

        {/* Input */}
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder={placeholder}
          aria-label="search"
          className="            
            w-full sm:w-72 focus:w-96
            transition-[width] duration-200 ease-in-out
            bg-transparent outline-none
            text-white placeholder-gray-100
            pl-14 pr-3 py-2"
        />
      </div>
    </div>
  );
}
 