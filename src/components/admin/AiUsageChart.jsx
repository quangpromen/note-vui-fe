import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';

// Mock data - AI requests theo tuần gần đây
const generateMockAiData = (totalRequests) => {
    const days = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
    const avgDaily = totalRequests / 30; // Ước tính trung bình ngày

    return days.map((day) => ({
        day,
        requests: Math.round(avgDaily * (0.6 + Math.random() * 0.8))
    }));
};

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/95 backdrop-blur-sm px-4 py-3 rounded-xl shadow-xl border border-slate-100">
                <p className="text-xs text-slate-500 mb-1">{label}</p>
                <p className="text-sm font-bold text-slate-800">
                    {payload[0].value.toLocaleString()} lượt
                </p>
            </div>
        );
    }
    return null;
};

/**
 * AiUsageChart - Biểu đồ cột AI Usage theo tuần
 */
const AiUsageChart = ({ totalAiRequests = 0 }) => {
    const data = generateMockAiData(totalAiRequests);
    const maxValue = Math.max(...data.map(d => d.requests));

    return (
        <div className="bg-white rounded-2xl p-6 shadow-lg shadow-slate-200/50 border border-slate-100">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-slate-800">Sử dụng AI</h3>
                    <p className="text-sm text-slate-500 mt-1">7 ngày gần đây</p>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-bold text-slate-800">{totalAiRequests.toLocaleString()}</p>
                    <p className="text-xs text-slate-500">Tổng lượt sử dụng</p>
                </div>
            </div>

            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
                                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.8} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                        <XAxis
                            dataKey="day"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 12 }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 12 }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar
                            dataKey="requests"
                            radius={[6, 6, 0, 0]}
                            maxBarSize={50}
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.requests === maxValue ? '#6366f1' : '#c7d2fe'}
                                    className="transition-all duration-300 hover:opacity-80"
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default AiUsageChart;
