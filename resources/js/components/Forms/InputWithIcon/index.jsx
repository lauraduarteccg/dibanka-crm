const InputWithIcon = ({
    icon: Icon, 
    type, 
    placeholder, 
    value, 
    onChange,
    disabled = false
}) => {
    return (
        <div className="flex items-center border rounded-2xl px-4 py-2">
            {Icon && <Icon className="text-primary-strong mr-3" />}
            <input 
                type={type} 
                placeholder={placeholder} 
                value={value} 
                onChange={onChange}
                className="w-full focus:outline-none"
                disabled={disabled}
            />
        </div>
    );
};
export default InputWithIcon;
