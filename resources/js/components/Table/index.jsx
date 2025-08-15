import React from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FiEdit } from "react-icons/fi";
import { FaToggleOff, FaToggleOn } from "react-icons/fa6";
import { GoEye } from "react-icons/go";

const Table = ({
    columns,
    data,
    currentPage,
    totalPages,
    fetch,
    actions = false,
    onEdit,
    onDelete,
    onView,
    edit = true,
    view = false,
    onActiveOrInactive = true,
}) => {
    return (
        <div className="w-full flex flex-col items-center">
            <table className="m-auto w-4/5 border-separate border-spacing-0 rounded-lg shadow-lg bg-gray">
                <thead>
                    <tr className="bg-gradient-primary text-white font-bold text-xl">
                        {columns.map((col, index) => (
                            <td
                                key={index}
                                className={`py-2 px-4 text-center ${
                                    index === 0 ? "rounded-tl-lg" : ""
                                } ${
                                    index === columns.length - 1 && !actions
                                        ? "rounded-tr-lg"
                                        : ""
                                }`}
                            >
                                {col.header}
                            </td>
                        ))}
                        {actions && (
                            <td className="py-2 px-4 text-center rounded-tr-lg">
                                Acciones
                            </td>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? (
                        data.map((row, rowIndex) => (
                            <tr
                                key={rowIndex}
                                className="odd:bg-transparent odd:text-[#19577e] even:bg-white even:text-[#19577e]"
                            >
                                {columns.map((col, colIndex) => (
                                    <td
                                        key={colIndex}
                                        className="py-2 px-4 text-center"
                                    >
                                        {row[col.key]}
                                    </td>
                                ))}
                                
                                {actions && (
                                    <td className="py-2 px-4 text-center flex justify-center gap-4">
                                        {edit &&
                                        <button
                                            onClick={() => onEdit(row)}
                                            className="text-blue-500 hover:text-blue-700"
                                        >
                                            <FiEdit size={20} />
                                        </button>
                                        }
                                        {view &&
                                        <button
                                            onClick={() => onView(row)}
                                            className="text-blue-500 hover:text-blue-700"
                                        >
                                            <GoEye size={20} />
                                        </button>
                                        }
                                        {onActiveOrInactive &&
                                        <button
                                            onClick={() => onDelete(row.id, row.is_active)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            {row.is_active === 1 ? (
                                                <FaToggleOn
                                                    size={20}
                                                    color="green"
                                                />
                                            ) : (
                                                <FaToggleOff
                                                    size={20}
                                                    color="red"
                                                />
                                            )}
                                        </button>
                                        }
                                    </td>
                                )}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={columns.length + (actions ? 1 : 0)}
                                className="py-4 text-center text-primary-strong"
                            >
                                No hay registros disponibles
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            <div className="flex justify-center items-center gap-4 mt-4 w-full text-primary-strong">
                <button
                    onClick={() => fetch(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="disabled:opacity-50"
                >
                    <IoIosArrowBack />
                </button>
                <span>
                    {currentPage} / {totalPages}
                </span>
                <button
                    onClick={() => fetch(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="disabled:opacity-50"
                >
                    <IoIosArrowForward />
                </button>
            </div>
        </div>
    );
};

export default Table;
