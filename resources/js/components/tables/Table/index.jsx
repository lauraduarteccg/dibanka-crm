import React, { useState,useContext } from "react";
import { AuthContext } from "@context/AuthContext";
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
} from "@mui/material";

import { FiEdit } from "react-icons/fi";
import { FaToggleOff, FaToggleOn } from "react-icons/fa6";
import { GoEye } from "react-icons/go";
import { MdManageAccounts } from "react-icons/md";
import { IoFootstepsOutline } from "react-icons/io5";

// 🔎 Función para obtener valores anidados
export const getNestedValue = (obj, path) =>
  path.split(".").reduce((acc, key) => acc?.[key], obj) ?? "—";

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

const MuiTable = ({
  columns,
  data,
  actions = false,
  onEdit,
  onDelete,
  onView,
  onManagement,
  onMonitoring,
  edit = true,
  view = false,
  management = false,
  monitoring = false,
  onActiveOrInactive = true,
  totalItems,
  rowsPerPage,
  currentPage,
  fetchPage,
}) => {
  
  const { user } = useContext(AuthContext);

  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState(columns[0].key);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (_, newPage) => {
    fetchPage(newPage + 1); 
  };

  const sortedData = stableSort(data, getComparator(order, orderBy));

  const filteredData = !user.roles?.includes("Administrador")
    ? sortedData.filter((item) => item.roles !== 1)
    : sortedData;
    
  return (
    <Paper
   
      sx={{ width: "90%", overflow: "hidden", borderRadius: 3, mx: "auto", marginRight: 6 }}
      className="mt-6"
    >
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow className="bg-gradient-primary">
              {columns.map((col) => (
                <TableCell
                  key={col.key}
                  align="center"
                  sx={{ color: "white", fontWeight: "bold", fontSize: "1rem" }}
                >
                  <TableSortLabel
                    active={orderBy === col.key}
                    direction={orderBy === col.key ? order : "asc"}
                    onClick={() => handleRequestSort(col.key)}
                    sx={{
                      color: "white !important",
                      "& .MuiTableSortLabel-icon": { color: "white !important" },
                    }}
                  >
                    {col.header}
                  </TableSortLabel>
                </TableCell>
              ))}
              {actions && (
                <TableCell
                  align="center"
                  sx={{ color: "white", fontWeight: "bold", fontSize: "1rem" }}
                >
                  Acciones
                </TableCell>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredData.map((row, rowIndex) => (
              <TableRow key={rowIndex} hover>
                {columns.map((col) => (
                  <TableCell key={col.key} align="center">
                    {col.key === "img_payroll" ? (
                      row.img_payroll ? (
                        <img
                          src={row.img_payroll}
                          alt="Imagen"
                          className="h-12 w-12 object-contain rounded-md mx-auto"
                        />
                      ) : (
                        "—"
                      )
                    ) : (
                      getNestedValue(row, col.key)
                    )}
                  </TableCell>
                ))}
                {actions && (
                  <TableCell align="center">
                    <div className="flex justify-center gap-4">
                      {management && (
                        <button
                          onClick={() => onManagement(row)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <MdManageAccounts size={20} />
                        </button>
                      )}
                      {edit && (
                        <button
                          onClick={() => onEdit(row)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <FiEdit size={20} />
                        </button>
                      )}
                      {view && (
                        <button
                          onClick={() => onView(row)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <GoEye size={20} />
                        </button>
                      )}
                      {monitoring && (
                        <button
                          onClick={() => onMonitoring(row)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <IoFootstepsOutline size={20} />
                        </button>
                      )}
                      {onActiveOrInactive && (
                        <button
                          onClick={() => onDelete(row.id, row.is_active)}
                          className="text-red-500 hover:text-red-700"
                        >
                          {row.is_active === 1 ? (
                            <FaToggleOn size={20} color="green" />
                          ) : (
                            <FaToggleOff size={20} color="red" />
                          )}
                        </button>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}

            {sortedData.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length + (actions ? 1 : 0)} align="center">
                  No hay registros disponibles
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

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

export default MuiTable;
