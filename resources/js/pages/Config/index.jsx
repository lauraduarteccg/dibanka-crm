import DinamicTitle from "@components/DinamicTitle" 
import { useConfig } from "./useConfig.js"
import MuiTable from "@components/MuiTable";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableContainer from '@mui/material/TableContainer';
import {Paper, Box} from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import { CiHeart, CiLocationArrow1  } from "react-icons/ci";
import { RiAdminFill, RiAdminLine } from "react-icons/ri";

const props = {
  align: "right",
  sx: { fontSize: '17px', fontWeight: 'bold' }
};

const acciones = ["view", "edit", "update", "delete"];

const getPermissionsByKey = (role, key) => {
  if (!role?.permissions) return [];
  return role.permissions.filter((p) => p.name.startsWith(`${key}.`));
};
const columns = [
  {header: "ID", key: "id"},
  {header: "Nombre del rol", key: "name"},
  {header: "Fecha de creación", key: "created_at"},
  {header: "Fecha de edición", key: "updated_at"},
]
const Config = () => {
  const { 
    totalPages,
    currentPage,
    perPage,
    totalItems,
    roles,
    permissions, 
    jsonPermissions, 
    fetchPermissions 
  } = useConfig();

  return (
    <div>
        <DinamicTitle text="Tabla de configuración de roles" />
        <div className="mx-[10%]">
          <MuiTable   
              columns={columns}
              data={roles ?? []}
              fetch={fetchPermissions}
              currentPage={currentPage}
              totalPages={totalPages}
              rowsPerPage={perPage}
              totalItems={totalItems}
              actions={false}
              view={false}
              edit={false}
              onActiveOrInactive={false}
              collapse={
              <Box sx={{ backgroundColor: '#f3f4f6', p: 3, }}>
                <TableContainer
                  component={Paper}
                  sx={{
                    borderRadius: 2,
                    boxShadow: 3,
                    backgroundColor: '#fff',
                    p: 2,
                    m: 'auto',
                    maxWidth: '90%'
                  }}
                >
                  <Table aria-label="caption table">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontSize: '17px', fontWeight: 'bold' }} >Permisos</TableCell>
                        <TableCell {...props} >Visualizar</TableCell>
                        <TableCell {...props} >Editar</TableCell>
                        <TableCell {...props} >Actualizar</TableCell>
                        <TableCell {...props} >Eliminar</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {/* console.log(jsonPermissions) */}
                      {jsonPermissions.map((perm) => (
                        <TableRow key={perm.key}>
                          <TableCell component="th" scope="row">{perm.name}</TableCell>
                          
                              {console.log(roles)}
                          {roles.map((role) =>
                            acciones.map((accion) => {
                              const tieneAccion = role.permissions.some(
                                (p) => p.name === `${perm.key}.${accion}`
                              );
                              return (
                                <TableCell key={`${role.id}-${accion}`} align="center">
                                  <Checkbox checked={tieneAccion} />
                                  <h1>{`${role.id}-${accion}`}</h1>
                                </TableCell>
                              );
                            })
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
              }
            />
        </div>

        {/*         
        <BottomNavigation showLabels sx={{ backgroundColor: 'transparent', boxShadow: 'none', marginBottom: 3, marginTop:-3 }} >
          <BottomNavigationAction label="Administrador" icon={<RiAdminFill  className="w-8 h-8" />} />
          <BottomNavigationAction label="Favorites" icon={<CiHeart className="w-8 h-8" />} />
          <BottomNavigationAction label="Nearby" icon={<CiLocationArrow1 className="w-8 h-8" />} />
        </BottomNavigation> */}
        {/* 
        Tabla
        <div className="mx-[15%] bg-white p-5 rounded-xl shadow-lg">
          <Table sx={{ minWidth: 650, }} aria-label="caption table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontSize: '20px', fontWeight: 'bold' }} >Area</TableCell>
                <TableCell {...props} >Ver</TableCell>
                <TableCell {...props} >Editar</TableCell>
                <TableCell {...props} >Actualizar</TableCell>
                <TableCell {...props} >Eliminar</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {jsonPermissions.map((row) => (
                <TableRow key={row.name}>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="right"><Checkbox aria-label="demo" /></TableCell>
                  <TableCell align="right"><Checkbox aria-label="demo" /></TableCell>
                  <TableCell align="right"><Checkbox aria-label="demo" /></TableCell>
                  <TableCell align="right"><Checkbox aria-label="demo" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div> 
        */}
    </div>
  );
};

export default Config;
