import { useContext } from "react";
import { AuthContext } from "@context/AuthContext";

export const useCan = () => {
    const { permissions } = useContext(AuthContext);
   
    const can = (perm) => permissions.includes(perm);
    const canAny = (permList = []) => permList.some((p) => permissions.includes(p));
    const canAll = (permList = []) => permList.every((p) => permissions.includes(p));

    return { can, canAny, canAll };
};
