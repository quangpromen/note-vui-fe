import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

// Mock data - Doanh thu theo tháng
const generateMockRevenueData = (totalRevenue) => {
    const months = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
    const currentMonth = new Date().getMonth();

    // Tạo data với trend tăng dần
    return months.slice(0, currentMonth + 1).map((month, index) => {
        const baseValue = (totalRevenue / 12) * (0.5 + (index * 0.1));
        const variance = baseValue * (Math.random() * 0.3 - 0.15);
        return {
            month,
            revenue: Math.round(baseValue + variance)
        };
    });
};

const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0
    }).format(value);
};

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/95 backdrop-blur-sm px-4 py-3 rounded-xl shadow-xl border border-slate-100">
                <p className="text-xs text-slate-500 mb-1">Tháng {label}</p>
                <p className="text-sm font-bold text-slate-800">
                    {formatCurrency(payload[0].value)}
                </p>
            </div>
        );
    }
    return null;
};

/**
 * RevenueChart - Biểu đồ doanh thu Area Chart với gradient
 */
const RevenueChart = ({ totalRevenue = 0 }) => {
    const data = generateMockRevenueData(totalRevenue);

    return (
        <div className="bg-white rounded-2xl p-6 shadow-lg shadow-slate-200/50 border border-slate-100">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-slate-800">Doanh thu theo tháng</h3>
                    <p className="text-sm text-slate-500 mt-1">Năm 2026</p>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-bold text-slate-800">{formatCurrency(totalRevenue)}</p>
                    <p className="text-xs text-slate-500">Tổng doanh thu</p>
                </div>
            </div>

            <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                        <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 12 }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 12 }}
                            tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="#0d9488"
                            strokeWidth={3}
                            fill="url(#revenueGradient)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default RevenueChart;
