import { motion } from "framer-motion";

const DinamicTitle = ({ text }) => {
  return (
    <motion.h1
    className="text-3xl font-bold text-primary-strong flex flex-col items-center gap-1 -mt-7 mb-10"
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
    >
    <span className="relative inline-block text-center">
        {text}
        <span className="block h-1 bg-yellow-400 rounded-full mt-1 w-full" />
    </span>
    </motion.h1>
  );
};

export default DinamicTitle;
