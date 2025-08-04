import React from "react";
import PropTypes from "prop-types";

const Card = ({ 
    title, 
    subtitle, 
    description, 
    width = "w-full", 
    padding = 6, 
    rounded = "lg" 
}) => {
    return (
        <div className={`${width} p-${padding} rounded-${rounded} shadow-md bg-white flex flex-col items-center text-center`}>
            <h1 className="text-4xl font-extrabold text-purple-mid">{title}</h1>
            <h2 className="text-xl font-bold text-purple-deep">{subtitle}</h2>
            <p className="text-black">{description}</p>
        </div>
    );
};

// Definir PropTypes
Card.propTypes = {
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
    subtitle: PropTypes.string.isRequired,
    description: PropTypes.string,
    width: PropTypes.string,
    padding: PropTypes.number,
    rounded: PropTypes.string,
};

export default Card;
