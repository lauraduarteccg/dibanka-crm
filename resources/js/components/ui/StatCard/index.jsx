import Counter from "@components/ui/Counter";
import Skeleton from "@mui/material/Skeleton";

const StatCard = ({ stat, loading }) => {
    const hasIcon = Boolean(stat.icon);

    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center justify-between">
             
                <div className="flex-1">
                    {loading ? (
                        <>
                            <Skeleton width={100} height={16} />
                            <Skeleton width={120} height={36} />
                        </>
                    ) : hasIcon ? (
                     
                        <>
                            <p className="text-sm font-medium text-gray-500">
                                {stat.title}
                            </p>
                            <span className="text-4xl font-bold text-gray-800">
                                <Counter value={stat.value} />
                            </span>
                        </>
                    ) : (
                        <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-black">
                                {stat.title}
                            </p>
                            <span className="text-2xl font-bold text-primary-dark">
                                <Counter value={stat.value} />
                            </span>
                        </div>
                    )}
                </div>

      
                {hasIcon && (
                    <div className="w-12 h-12 flex items-center justify-center">
                        {loading ? (
                            <Skeleton
                                variant="circular"
                                width={48}
                                height={48}
                            />
                        ) : (
                            <div className="bg-gray-100 p-3 rounded-full">
                                {stat.icon}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatCard;
