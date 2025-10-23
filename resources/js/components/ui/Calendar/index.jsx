import React from "react";
import { DateRange } from "react-date-range";
import { es } from "date-fns/locale";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { motion, AnimatePresence } from "framer-motion";

const Calendar = ({
  dateRange,
  handleDateChange,
  calendarOpen,
  setCalendarOpen,
  timeRange,
  setTimeRange,
  applyFilters, // 👈 función para ejecutar la búsqueda manualmente
}) => {
  const handleTimeChange = (e) => {
    const { name, value } = e.target;
    setTimeRange((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      {/* Botón abrir calendario */}
      <button
        className="fixed top-64 right-0 w-40 h-12 bg-purple-light z-50 shadow-custom
                   rounded-bl-2xl rounded-tl-2xl hover:scale-105
                   transition-all duration-200 ease-in-out"
        onClick={() => setCalendarOpen(true)}
      >
        <p className="text-white text-xl">Buscar fecha</p>
      </button>

      {/* Animación de apertura */}
      <AnimatePresence>
        {calendarOpen && (
          <motion.div
            className="fixed top-24 right-0 flex justify-end z-50"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {/* Botón cerrar */}
            <button
              className="absolute right-[100%] w-40 h-12 bg-purple-light
                         rounded-bl-2xl rounded-tl-2xl hover:scale-105
                         transition-all duration-200 ease-in-out"
              onClick={() => setCalendarOpen(false)}
            >
              <p className="text-white text-xl">Cerrar</p>
            </button>

            {/* Contenedor del calendario */}
            <div className="shadow-custom bg-white rounded-xl overflow-hidden p-4">
              <DateRange
                locale={es}
                editableDateInputs={true}
                onChange={handleDateChange}
                moveRangeOnFirstSelection={false}
                ranges={dateRange}
                direction="horizontal"
              />

              {/* Campos de hora */}
              <div className="flex justify-between mt-3 gap-4">
                <div className="flex flex-col">
                  <label className="text-gray-700 text-sm mb-1">Hora inicio:</label>
                  <input
                    type="time"
                    name="start"
                    value={timeRange.start}
                    onChange={handleTimeChange}
                    className="border border-gray-300 rounded-lg px-2 py-1"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-gray-700 text-sm mb-1">Hora fin:</label>
                  <input
                    type="time"
                    name="end"
                    value={timeRange.end}
                    onChange={handleTimeChange}
                    className="border border-gray-300 rounded-lg px-2 py-1"
                  />
                </div>
              </div>

              {/* 🟣 Botón aplicar cambios */}
              <div className="flex justify-center mt-5">
                <button
                  onClick={() => {
                    applyFilters();
                    setCalendarOpen(false);
                  }}
                  className="bg-purple-light text-white px-6 py-2 rounded-lg hover:scale-105 transition-all duration-200 ease-in-out"
                >
                  Aplicar cambios
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Calendar;
