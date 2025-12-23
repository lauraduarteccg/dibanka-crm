import { useState } from "react";
import { Search, Filter, Plus, X } from "lucide-react";

/**
 * Componente de UI para gestionar múltiples filtros.
 *
 * @param {Object} props
 * @param {Array} props.options - Opciones de filtro disponibles [{ value: 'key', label: 'Label' }]
 * @param {Object} props.filters - Estado actual de los filtros { key: value }
 * @param {Function} props.onAddFilter - Función (key, value) => void
 * @param {Function} props.onRemoveFilter - Función (key) => void
 * @param {Function} props.onClearFilters - Función () => void
 * @param {String} props.className - Clases adicionales
 */
export default function MultiFilter({
    options = [],
    filters = {},
    onAddFilter,
    onRemoveFilter,
    onClearFilters,
    className = "",
}) {
    // Definimos la opción de búsqueda general
    const generalOption = { value: "search", label: "Búsqueda General" };

    // Combinamos las opciones asegurándonos de que no haya duplicados si el usuario ya la pasó
    const allOptions = options.some((opt) => opt.value === "search")
        ? options
        : [generalOption, ...options];

    const [selectedKey, setSelectedKey] = useState(
        allOptions[0]?.value || "search"
    );
    const [tempValue, setTempValue] = useState("");

    const handleAdd = () => {
        if (!selectedKey || !tempValue.trim()) return;
        onAddFilter(selectedKey, tempValue);
        setTempValue("");
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") handleAdd();
    };

    const getLabel = (key) => {
        if (key === "search") return "Búsqueda General";
        return allOptions.find((opt) => opt.value === key)?.label || key;
    };

    return (
        <div className={`space-y-4 ${className} w-[55%]`}>
            {/* Barra principal con todo visible */}
            <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                {/* Contenedor principal con gradiente - Altura reducida */}
                <div className="flex-1 flex flex-col sm:flex-row gap-2 items-start sm:items-center 
                                bg-gradient-tertiary rounded-2xl px-4 sm:px-6 py-1 shadow-sm w-full 
                                border border-white/20">
                    {/* Ícono de búsqueda */}
                    <div className="hidden sm:block text-white ml-2">
                        <Search size={16} />
                    </div>

                    {/* Selector de Campo */}
                    <div className="flex items-center gap-2 min-w-[180px] w-full sm:w-auto">
                        <div className="text-white sm:hidden">
                            <Filter size={16} />
                        </div>
                        <select
                            value={selectedKey}
                            onChange={(e) => setSelectedKey(e.target.value)}
                            className="w-full bg-white/20 backdrop-blur-sm rounded-full px-3 py-0.5 outline-none text-[13px] text-white font-medium cursor-pointer border border-white/30 hover:bg-white/30 transition-colors"
                        >
                            <option value="" disabled>
                                Seleccionar campo...
                            </option>
                            {allOptions.map((opt) => (
                                <option
                                    key={opt.value}
                                    value={opt.value}
                                    className="text-gray-700"
                                >
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="h-6 w-px bg-white/30 hidden sm:block" />

                    {/* Input de Valor */}
                    <input
                        type="text"
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={`Buscar ${getLabel(
                            selectedKey
                        ).toLowerCase()}...`}
                        className="flex-1 w-full bg-transparent outline-none text-base px-2 text-white placeholder-white/70 font-light"
                    />

                    {/* Botón Agregar integrado */}
                    <button
                        onClick={handleAdd}
                        disabled={!tempValue.trim()}
                        className="p-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-white/30"
                        title="Agregar filtro"
                    >
                        <Plus size={16} />
                    </button>
                </div>
            </div>

            {/* Lista de Chips (Filtros Activos) */}
            {Object.keys(filters).length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mr-2">
                        Activos:
                    </span>

                    {Object.entries(filters).map(([key, value]) => (
                        <div
                            key={key}
                            className="flex items-center gap-2 px-3 py-1.5 bg-purple-500 text-white rounded-full text-xs shadow-sm animate-in fade-in zoom-in duration-200"
                        >
                            <span className="font-medium opacity-90">
                                {getLabel(key)}:
                            </span>
                            <span className="font-bold">{value}</span>
                            <button
                                onClick={() => onRemoveFilter(key)}
                                className="hover:bg-purple-700 rounded-full p-0.5 transition-colors ml-1"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ))}

                    {/* Botón Limpiar Todo */}
                    <button
                        onClick={onClearFilters}
                        className="text-xs text-gray-500 hover:text-red-500 underline ml-auto transition-colors"
                    >
                        Limpiar todos
                    </button>
                </div>
            )}
        </div>
    );
}
