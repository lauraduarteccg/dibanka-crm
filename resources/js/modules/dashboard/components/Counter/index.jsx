import React, { useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

const Counter = ({ value, duration = 1 }) => {
    const count = useMotionValue(0); 
    const rounded = useTransform(count, (latest) => Math.round(latest)); 

    useEffect(() => {
        const controls = animate(count, value, { duration, ease: "easeInOut" });
        return controls.stop; 
    }, [value, count, duration]);

    return <motion.span>{rounded}</motion.span>;
};

export default Counter;
