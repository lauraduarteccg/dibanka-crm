import Skeleton from "@mui/material/Skeleton";
import { Paper} from "@mui/material"
const TableSkeleton = ({ rows = 9 }) => {
    return (
        <Paper
            className="bg-white rounded-xl shadow-md mt-6"
            sx={{ width: "90%", overflow: "hidden", borderRadius: 3, mx: "auto", marginRight: 6 }}
        
        >
            {/* HEADER */}
            <div className="px-6 py-4 border-b">
                <Skeleton width={180} height={24} />
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50">
                        <tr>
                            {[...Array(rows)].map((_, i) => (
                                <th key={i} className="px-6 py-3">
                                    <Skeleton width={100} />
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {[...Array(1)].map((_, i) => (
                            <tr key={i} className="border-b">
                                {[...Array(rows)].map((_, j) => (
                                    <td
                                        key={j}
                                        className="px-6 py-4"
                                    >
                                        <Skeleton width="80%" />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>


        </Paper>
    );
};

export default TableSkeleton;
