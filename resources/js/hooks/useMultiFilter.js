import { useState, useCallback } from "react";

/**
 * Hook para manejar múltiples filtros de forma dinámica.
 *
 * @param {Object} initialFilters - Estado inicial de los filtros { key: value }
 * @returns {Object} { filters, addFilter, removeFilter, clearFilters, hasFilters }
 */
export const useMultiFilter = (initialFilters = {}) => {
    const [filters, setFilters] = useState(initialFilters);

    const addFilter = useCallback((key, value) => {
        if (!key || value === undefined || value === "") return;

        setFilters((prev) => ({
            ...prev,
            [key]: value,
        }));
    }, []);

    const removeFilter = useCallback((key) => {
        setFilters((prev) => {
            const newFilters = { ...prev };
            delete newFilters[key];
            return newFilters;
        });
    }, []);

    const clearFilters = useCallback(() => {
        setFilters({});
    }, []);

    const hasFilters = Object.keys(filters).length > 0;

    return {
        filters,
        addFilter,
        removeFilter,
        clearFilters,
        hasFilters,
    };
};
