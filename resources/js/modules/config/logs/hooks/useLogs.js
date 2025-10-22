import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import { getActivityLogs } from "@modules/config/Logs/services/logsService";
import { addDays, format } from "date-fns";
import { format as formatTZ } from "date-fns-tz";

export const useLogs = () => {
  // ===========================================================
  // 🔹 Estados principales
  // ===========================================================
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ===========================================================
  // 🔹 Paginación y búsqueda
  // ===========================================================
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(1);
  const [totalItems, setTotalItems] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // ===========================================================
  // 🔹 Calendario (fecha + hora)
  // ===========================================================
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [dateRange, setDateRange] = useState([
    {
      startDate: addDays(new Date(), -7),
      endDate: new Date(),
      key: "selection",
      color: "#F5E14E",
    },
  ]);

  const [timeRange, setTimeRange] = useState({
    start: "00:00",
    end: "23:59",
  });

  const timeZone = "America/Bogota";

  // ===========================================================
  // 🔹 Función principal: traer logs
  // ===========================================================
  const fetchActivityLogs = useCallback(
    async (page = 1, search = "", startDate = null, endDate = null) => {
      setLoading(true);
      try {
        const data = await getActivityLogs({
          page,
          search,
          start_date: startDate,
          end_date: endDate,
        });

        setLogs(data.logs);
        setTotalPages(data.pagination.total_pages);
        setCurrentPage(data.pagination.current_page);
        setPerPage(data.pagination.per_page);
        setTotalItems(data.pagination.total);
      } catch (err) {
        console.error(err);
        setError("Error al obtener los logs de actividad.");
        Swal.fire({
          title: "Error",
          text: "No se pudieron cargar los logs de actividad.",
          icon: "error",
          confirmButtonText: "Entendido",
        });
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // ===========================================================
  // 🔹 Helper para formatear fecha y hora correctamente
  // ===========================================================
  const formatDateTime = (date, time) => {
    return formatTZ(
      new Date(`${format(date, "yyyy-MM-dd")} ${time}:00`),
      "yyyy-MM-dd HH:mm:ss",
      { timeZone }
    );
  };

  // ===========================================================
  // 🔹 Cargar logs iniciales (últimos 7 días)
  // ===========================================================
  useEffect(() => {
    const { startDate, endDate } = dateRange[0];
    const startDatetime = formatDateTime(startDate, timeRange.start);
    const endDatetime = formatDateTime(endDate, timeRange.end);
    fetchActivityLogs(1, searchTerm, startDatetime, endDatetime);
  }, []); // solo una vez al montar

  // ===========================================================
  // 🔹 Handlers
  // ===========================================================
  const fetchPage = useCallback(
    (page) => {
      const { startDate, endDate } = dateRange[0];
      const startDatetime = formatDateTime(startDate, timeRange.start);
      const endDatetime = formatDateTime(endDate, timeRange.end);
      fetchActivityLogs(page, searchTerm, startDatetime, endDatetime);
    },
    [fetchActivityLogs, searchTerm, dateRange, timeRange]
  );

  const handleSearch = useCallback((value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  }, []);

  const handleDateChange = (ranges) => {
    setDateRange([
      {
        startDate: ranges.selection.startDate,
        endDate: ranges.selection.endDate,
        key: "selection",
        color: "#F5E14E",
      },
    ]);
  };

  const handleTimeChange = (e) => {
    const { name, value } = e.target;
    setTimeRange((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ===========================================================
  // 🟣 Aplicar cambios manualmente
  // ===========================================================
  const applyFilters = useCallback(() => {
    const { startDate, endDate } = dateRange[0];
    const startDatetime = formatDateTime(startDate, timeRange.start);
    const endDatetime = formatDateTime(endDate, timeRange.end);
    fetchActivityLogs(1, searchTerm, startDatetime, endDatetime);
  }, [fetchActivityLogs, dateRange, timeRange, searchTerm]);

  // ===========================================================
  // Return del hook
  // ===========================================================
  return {
    logs,
    loading,
    error,
    currentPage,
    totalPages,
    perPage,
    totalItems,
    searchTerm,
    dateRange,
    calendarOpen,
    timeRange,

    // Actions
    fetchActivityLogs,
    fetchPage,
    handleSearch,
    setSearchTerm,
    handleDateChange,
    handleTimeChange,
    setCalendarOpen,
    setTimeRange,
    applyFilters,
  };
};

export default useLogs;
