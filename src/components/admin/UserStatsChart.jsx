import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip
} from 'recharts';

const COLORS = ['#0d9488', '#f59e0b', '#6366f1', '#ec4899'];

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/95 backdrop-blur-sm px-4 py-3 rounded-xl shadow-xl border border-slate-100">
                <p className="text-sm font-bold text-slate-800">{payload[0].name}</p>
                <p className="text-xs text-slate-500">{payload[0].value} người dùng</p>
            </div>
        );
    }
    return null;
};

/**
 * UserStatsChart - Biểu đồ tròn thống kê người dùng
 */
const UserStatsChart = ({ totalUsers = 0, activePremiumUsers = 0 }) => {
    const freeUsers = Math.max(0, totalUsers - activePremiumUsers);

    const data = [
        { name: 'Premium đang hoạt động', value: activePremiumUsers },
        { name: 'Người dùng free', value: freeUsers }
    ];

    // Tính tỷ lệ Premium
    const premiumRate = totalUsers > 0 ? ((activePremiumUsers / totalUsers) * 100).toFixed(1) : 0;

    return (
        <div className="bg-white rounded-2xl p-6 shadow-lg shadow-slate-200/50 border border-slate-100">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-slate-800">Phân loại người dùng</h3>
                    <p className="text-sm text-slate-500 mt-1">Premium vs Free</p>
                </div>
            </div>

            <div className="flex items-center gap-8">
                {/* Pie Chart */}
                <div className="w-48 h-48 relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={55}
                                outerRadius={75}
                                paddingAngle={5}
                                dataKey="value"
                                strokeWidth={0}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>

                    {/* Center text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <p className="text-2xl font-bold text-slate-800">{premiumRate}%</p>
                        <p className="text-xs text-slate-500">Premium</p>
                    </div>
                </div>

                {/* Legend */}
                <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-teal-500" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-slate-700">Premium đang hoạt động</p>
                            <p className="text-lg font-bold text-slate-800">{activePremiumUsers}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-amber-500" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-slate-700">Người dùng Free</p>
                            <p className="text-lg font-bold text-slate-800">{freeUsers}</p>
                        </div>
                    </div>
                    <div className="pt-3 border-t border-slate-100">
                        <p className="text-sm text-slate-500">Tổng cộng</p>
                        <p className="text-xl font-bold text-slate-800">{totalUsers}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserStatsChart;
