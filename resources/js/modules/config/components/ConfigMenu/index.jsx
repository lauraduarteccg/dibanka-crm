const ConfigMenu = ({ id, onSelect, selected, menuItems = [] }) => {
    const handleClick = (id) => {
        if (onSelect) onSelect(id);
    };

    return (
        <div id={id} className="bg-white shadow-md rounded-xl p-4 w-[75%] mx-auto">
            <ul className="flex flex-row space-x-2 justify-center flex-wrap">
                {menuItems.map((item) => {
                    const isActive = selected === item.id;
                    const Icon = item.icon;
                    return (
                        <li key={item.id}>
                            <button
                                onClick={() => handleClick(item.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition
                  ${
                      isActive
                          ? "bg-purple-light text-white"
                          : "text-gray-700 hover:bg-purple-light hover:text-white"
                  }`}
                            >
                                {Icon && <Icon size={16} />}
                                <span className="text-sm font-medium">
                                    {item.label}
                                </span>
                            </button>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default ConfigMenu;
