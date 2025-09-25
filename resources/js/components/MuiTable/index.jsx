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

const MuiTableExpandable = ({ columns, data, totalItems, rowsPerPage, currentPage, fetchPage }) => {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState(columns[0].key);
  const [expandedRow, setExpandedRow] = useState(null);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (_, newPage) => {
    fetchPage(newPage + 1); // MUI base 0
  };

  const sortedData = stableSort(data, getComparator(order, orderBy));

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
            {sortedData.map((row, rowIndex) => (
              <React.Fragment key={rowIndex}>
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

                <TableRow>
                  <TableCell colSpan={columns.length} sx={{ p: 0, border: 0 }}>
                    <Collapse
                      in={expandedRow === rowIndex}
                      timeout="auto"
                      unmountOnExit
                    >
                      {/* Aquí tu detalle expandible */}
                      <Box sx={{ p: 2, bgcolor: "#f9f9f9" }}>
                        {/* Contenido expandido */}
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}

            {sortedData.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  No hay registros disponibles
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Paginación backend */}
      <TablePagination
        rowsPerPageOptions={[]}
        component="div"
        count={totalItems}
        rowsPerPage={rowsPerPage}
        page={currentPage - 1}
        onPageChange={handleChangePage}
      />
    </Paper>
  );
};


export default MuiTableExpandable;
