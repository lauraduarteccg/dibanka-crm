import NavBar from "./NavBar";
import { useContext } from "react";
import { AuthContext } from "@context/AuthContext";

const Layout = ({ children }) => {
    const { user } = useContext(AuthContext);

    return (
        <div className="flex flex-col min-h-screen">
            <NavBar userName={user?.name || "Usuario"} />
            <main className="flex-grow container mx-auto p-6">{children}</main>
        </div>
    );
};

export default Layout;
