import React from "react";
import NavBar from "./NavBar";

const Layout = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen">
            <NavBar />
            <main className="flex-grow container mx-auto p-6">{children}</main>
          
        </div>
    );
};

export default Layout;
