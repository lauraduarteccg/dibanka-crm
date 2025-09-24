import React, { useState } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  TablePagination,
  TableSortLabel,
  Paper,
  Collapse,
  Box,
} from "@mui/material";

const P = ({ text1, text2 }) => (
  <p className="text-gray-600 leading-relaxed">
    <strong className="text-gray-700">{text1}</strong>
    <span className="text-gray-900 ml-1">{text2}</span>
  </p>
);

// 🔎 Función para obtener valores anidados
export const getNestedValue = (obj, path) =>
  path.split(".").reduce((acc, key) => acc?.[key], obj) ?? "—";

// 📌 Comparadores para ordenamiento
function descendingComparator(a, b, orderBy) {
  if (getNestedValue(b, orderBy) < getNestedValue(a, orderBy)) return -1;
  if (getNestedValue(b, orderBy) > getNestedValue(a, orderBy)) return 1;
  return 0;
}
function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}
function stableSort(array, comparator) {
  const stabilized = array.map((el, index) => [el, index]);
  stabilized.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilized.map((el) => el[0]);
}

const MuiTable = ({ columns, data }) => {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState(columns[0].key);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [expandedRow, setExpandedRow] = useState(null); // fila expandida

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const sortedData = stableSort(data, getComparator(order, orderBy));
  const paginatedData = sortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", borderRadius: 3 }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={col.key} align="center">
                  <TableSortLabel
                    active={orderBy === col.key}
                    direction={orderBy === col.key ? order : "asc"}
                    onClick={() => handleRequestSort(col.key)}
                  >
                    {col.header}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedData.map((row, rowIndex) => (
              <React.Fragment key={rowIndex}>
                {/* 👉 Fila principal */}
                <TableRow
                  hover
                  onClick={() =>
                    setExpandedRow(expandedRow === rowIndex ? null : rowIndex)
                  }
                  sx={{ cursor: "pointer" }}
                >
                  {columns.map((col) => (
                    <TableCell key={col.key} align="center">
                      {getNestedValue(row, col.key)}
                    </TableCell>
                  ))}
                </TableRow>

                {/* 👉 Fila expandible */}
                <TableRow>
                  <TableCell colSpan={columns.length} sx={{ p: 0, border: 0 }}>
                    <Collapse
                      in={expandedRow === rowIndex}
                      timeout="auto"
                      unmountOnExit
                    >
                      <Box sx={{ p: 2, bgcolor: "#f9f9f9" }}>
                        <h4 className="font-semibold text-gray-700 pb-3">
                          Detalle de gestiones
                        </h4>
                        <div className="grid grid-cols-3 gap-10">
                          <div>
                            <div className="bg-white shadow-md rounded-lg p-5 flex flex-col gap-3">
                              <P text1="Agente: " text2={row.user?.name ?? "Agente sin nombre"} />
                              <P text1="Campaña: " text2={row.contact?.campaign ?? "Sin campaña"} />
                              <P text1="Pagaduría: " text2={row.payroll?.name ?? "Sin pagaduría"} />
                              <P text1="Consulta: " text2={row.consultation?.name ?? "Sin consulta"} />
                              <P text1="Consulta especifica: " text2={row.specific?.name ?? "Sin consulta especifica"} />
                              <P text1="Fecha de creación: " text2={row.created_at ?? "Sin fecha de creación"} />
                            </div>
                          </div>
                          <div>
                            <div className="bg-white shadow-md rounded-lg p-5 flex flex-col gap-3">
                              <P text1="Nombre del cliente: " text2={row.contact?.name ?? "Cliente sin nombre"} />
                              <P text1="Teléfono: " text2={row.contact?.phone ?? "Sin teléfono"} />
                              <P text1="Tipo de identifiación: " text2={row.contact?.identification_type ?? "Sin tipo de identificación"} />
                              <P text1="Número de identificación: " text2={row.contact?.identification_number ?? "Sin número de identifiación"} />
                              <P text1="Celular actualizado: " text2={row.contact?.update_phone ?? "Sin celular actualizado"} />
                              <P text1="Correo: " text2={row.contact?.email ?? "Usuario sin nombre"} />
                            </div>
                          </div>
                          <div>
                            <div className="bg-white shadow-md rounded-lg p-5 flex flex-col gap-3">
                              <P text1="Solución en primer contacto: " text2={row.solution ? "Sí" : "No" ?? "Sin solución en primer contacto"} />
                              <P text1="Observaciones: " text2={row.comments ?? "Sin observaciones"} />
                              <P text1="Fecha de solución: " text2={row.solution_date ?? "Sin fecha de solución"} />
                              <P text1="Seguimiento: " text2={row.monitoring?.name ?? "Sin seguimiento"} />
                            </div>
                          </div>
                        </div>
                        {console.log(row)}
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}

            {paginatedData.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  No hay registros disponibles
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 📌 Paginación */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 20]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Filas por página"
      />
    </Paper>
  );
};

export default MuiTable;
