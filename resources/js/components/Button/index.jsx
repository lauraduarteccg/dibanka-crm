import React from "react";

const Button = ({ text, onClick, color, colorText, padding, disabled }) => {
    return (
        <button
            disabled={disabled}
            className={`rounded-md hover:scale-110
                        transition-all duration-500 ease-in-out
                        ${color ? color : "bg-primary-accent"}
                        ${colorText ? colorText : "text-white"} 
                        ${padding ? padding : "px-6 py-2 mt-4 "}`}
            onClick={onClick}
        >
            {text}
        </button>
    );
};

export default Button;
