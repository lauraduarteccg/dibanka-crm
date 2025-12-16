import { useContext } from "react";
import { AuthContext } from "@context/AuthContext";

export const useCan = () => {
    const { permissions } = useContext(AuthContext);

    const can = (perm) => {
        if (perm === "any") return true;

        if (!permissions || !Array.isArray(permissions)) return false;

        return permissions.includes(perm);
    };

    const canAny = (permList = []) =>
        permList.some((perm) => can(perm));

    const canAll = (permList = []) =>
        permList.every((perm) => can(perm));

    return { can, canAny, canAll };
};
