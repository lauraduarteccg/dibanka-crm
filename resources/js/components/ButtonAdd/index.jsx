import { FaRegAddressBook } from "react-icons/fa";

const ButtonAdd = ({ onClickButtonAdd, text }) => {
    return (
        <div className="flex justify-center md:justify-start ml-36">
            <button
                className="flex items-center bg-gradient-primary w-full md:w-72 px-6 py-2 gap-3 rounded-2xl 
                           transition-all duration-300 ease-in-out text-white font-semibold shadow-md 
                           hover:shadow-lg transform hover:-translate-y-1"
                onClick={onClickButtonAdd}
            >
                <FaRegAddressBook className="w-5 h-5" />
                <div className="w-px h-6 bg-white/50" />
                <span className="text-sm tracking-wide">{text}</span>
            </button>
        </div>
    );
};

export default ButtonAdd;