import { Navigate } from "react-router-dom";
import { useCan } from "@hooks/useCan";
import TableSkeleton from "@components/tables/TableSkeleton";

/**
 * 🔒 Ruta protegida basada en permisos (Spatie Laravel Permission)
 * 
 * @param {ReactNode} children - Componente a renderizar si tiene acceso.
 * @param {string | string[]} permission - Permiso o lista de permisos requeridos.
 * @param {boolean} [requireAll=false] - Si true, exige todos los permisos; si false, basta con uno.
 */
const ProtectedRoute = ({ children, permission, requireAll = false }) => {
  const { can, canAny, loading } = useCan();

  // Muestra loader mientras cargan permisos o contexto
  if (loading) return <Loader />;

  // Validar permisos según si se pasa string o array
  const hasAccess = Array.isArray(permission)
    ? requireAll
      ? permission.every((perm) => can(perm))
      : canAny(permission)
    : can(permission);

  // Si no tiene permiso, redirige o muestra un fallback
  if (!hasAccess) {
    return <Navigate to="/home" replace />;
  }

  // Si tiene permiso, renderiza la ruta
  return children;
};

export default ProtectedRoute;
