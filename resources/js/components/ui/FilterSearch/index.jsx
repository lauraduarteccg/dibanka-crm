import { useState, useEffect } from "react";
import { Filter, Search } from "lucide-react";
import SearchComponent from "@components/forms/Search";

const FilterSearch = ({ 
    onFilter, 
    placeholder = "Buscar...", 
    filterOptions = [],
    initialSearchValue = "",
    initialSelectedFilter = "",
    className = ""
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState(initialSelectedFilter);
    const [searchValue, setSearchValue] = useState(initialSearchValue);

    // Sincronizar estado interno cuando cambian las props (ej. navegación externa)
    useEffect(() => {
        if (initialSearchValue !== undefined) setSearchValue(initialSearchValue);
        if (initialSelectedFilter !== undefined) setSelectedFilter(initialSelectedFilter);
    }, [initialSearchValue, initialSelectedFilter]);

    const handleSearch = (value) => {
        setSearchValue(value);
        onFilter(value, selectedFilter);
    };

    const handleClear = () => {
        setSearchValue("");
        setSelectedFilter("");
        onFilter("", "");
    };

    return (
        <div className="relative">
            <div className={`flex  items-center gap-2 ${className}`} >
                {/* Componente de búsqueda */}
                <div className="flex-1">
                    <SearchComponent
                        value={searchValue}
                        onSearch={handleSearch}
                        placeholder={placeholder}
                        onClear={handleClear}
                    />
                </div>

                {/* Botón de filtro */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`p-2 rounded-lg border transition-colors ${
                        selectedFilter
                            ? "bg-purple-500 text-white border-purple-500"
                            : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                    }`}
                    title="Filtrar por columna"
                >
                    <Filter size={20} />
                </button>

                {/* Botón de búsqueda 
                <button
                    onClick={() => handleSearch(searchValue)}
                    className="px-4 py-2 bg-primary text-white rounded-lg flex items-center gap-2"
                >
                    <Search size={18} />
                    Buscar
                </button>*/}
            </div>

            {/* Dropdown de filtros */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <div className="p-3 border-b border-gray-200">
                        <p className="text-sm font-semibold text-gray-700">
                            Filtrar por columna
                        </p>
                    </div>
                    <div className="p-2 max-h-60 overflow-y-auto">
                        <button
                            onClick={() => {
                                setSelectedFilter("");
                                setIsOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-sm ${
                                selectedFilter === "" ? "bg-purple-50 text-purple-600 font-medium" : "text-gray-700"
                            }`}
                        >
                            Búsqueda general
                        </button>
                        {filterOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => {
                                    setSelectedFilter(option.value);
                                    setIsOpen(false);
                                }}
                                className={`w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-sm ${
                                    selectedFilter === option.value
                                        ? "bg-purple-50 text-purple-600 font-medium"
                                        : "text-gray-700"
                                }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Indicador de filtro activo */}
            {selectedFilter && (
                <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs text-gray-600">
                        Filtrando por:{" "}
                        <span className="font-semibold text-purple-600">
                            {filterOptions.find((opt) => opt.value === selectedFilter)?.label}
                        </span>
                    </span>
                </div>
            )}
        </div>
    );
};

export default FilterSearch;