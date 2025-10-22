import React from "react";
import useLogs from "../../hooks/useLogs";
import Calendar from "@components/ui/Calendar";
import Loader from "@components/ui/Loader";
import Table from "@components/tables/Table";

const Logs = () => {
  const {
    logs,
    dateRange,
    handleDateChange,
    calendarOpen,
    setCalendarOpen,
    loading,
    currentPage,
    totalPages,
    perPage,
    totalItems,
    fetchPage,
    timeRange, 
    setTimeRange, 
    applyFilters
  } = useLogs();
  
  const normalizedData = logs.map(item => ({
    ...item,
    changes: {
      ...item.changes,
      mensaje: item.changes?.mensaje || item.changes?.message || ""
    }
  }));

  const columns = [
    { header: "ID", key: "id" },
    { header: "Usuario", key: "user.name" },
    { header: "Entidad", key: "entity_type" },
    { header: "Mensaje", key: "changes.mensaje" },
    { header: "IP", key: "ip_address" },
    { header: "Agente", key: "user_agent" },
    { header: "Fecha", key: "created_at" },
  ];

  return (
    <div className="flex flex-col items-center justify-center gap-4 relative">
      {/* Calendario flotante */}
      <Calendar
        dateRange={dateRange}
        handleDateChange={handleDateChange}
        calendarOpen={calendarOpen}
        setCalendarOpen={setCalendarOpen}
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        applyFilters={applyFilters}
      />

      {/* Tabla */}
      {loading ? (
        <Loader />
      ) : (
        <Table
          columns={columns}
          data={normalizedData} 
          currentPage={currentPage}
          totalPages={totalPages}
          rowsPerPage={perPage}
          totalItems={totalItems}
          fetchPage={fetchPage}
          actions={false}
        />
      )}
    </div>
  );
};

export default Logs;
