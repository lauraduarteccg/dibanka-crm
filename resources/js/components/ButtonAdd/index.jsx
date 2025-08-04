import React from "react";
import { FaRegAddressBook } from "react-icons/fa";

const ButtonAdd = ({ onClickButtonAdd, text }) => {
    return (
        <>
            <button
                className="bg-gradient-primary flex items-center ml-36 w-72 h-auto px-4 py-2 gap-3 rounded-2xl hover:scale-110
                            transition-all duration-500 ease-in-out text-white font-semibold shadow-lg"
                onClick={onClickButtonAdd}
            >
                <FaRegAddressBook className="w-10 h-10 p-1" />
                <div className="w-1 h-9 border-r-2 border-white" />
                <h1 className="w-full ">{text}</h1>
            </button>
        </>
    );
};

export default ButtonAdd;
