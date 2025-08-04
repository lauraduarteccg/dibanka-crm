const InputSelect = ({
    options = [],
    icon: Icon,
    placeholder,
    value = "",
    onChange,
    disabled,
}) => {
    return (
        <div className="flex items-center border rounded-2xl px-4 py-2 relative">
            {Icon && <Icon className="text-primary-strong mr-3" />}
            <select
                className="w-full bg-transparent focus:outline-none appearance-none cursor-pointer"
                value={value || "DEFAULT"}
                onChange={onChange}
                disabled={disabled}
            >
                <option value="DEFAULT" disabled> {placeholder} </option>
                {options.map((option, index) => (
                    <option key={index} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <svg
                className="absolute right-4 w-4 h-4 text-primary-strong pointer-events-none"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
            >
                <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                />
            </svg>
        </div>
    );
};

export default InputSelect;
