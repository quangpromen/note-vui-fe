import { useState, useMemo } from 'react';
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
import { Sparkles } from 'lucide-react';

// ─── Constants ──────────────────────────────────────────────
const TIME_RANGES = [
    { key: '7d', label: '7 ngày' },
    { key: '30d', label: '30 ngày' }
];

const GRADIENT_ID = 'aiBarGradient';

// ─── Seeded random to avoid re-render jitter ────────────────
const seededRandom = (seed) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
};

/**
 * Generate deterministic mock data so charts don't flicker on re-render.
 * In production, replace with a real API call for time-series data.
 */
const generateAiData = (totalRequests, range) => {
    if (range === '7d') {
        const days = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
        const avgDaily = totalRequests / 30;

        return days.map((day, i) => ({
            label: day,
            requests: Math.round(avgDaily * (0.6 + seededRandom(i + 1) * 0.8))
        }));
    }

    // 30 days — group into 6 periods of 5 days
    const periods = ['1-5', '6-10', '11-15', '16-20', '21-25', '26-30'];
    const avgPeriod = totalRequests / 6;

    return periods.map((period, i) => ({
        label: period,
        requests: Math.round(avgPeriod * (0.7 + seededRandom(i + 10) * 0.6))
    }));
};

// ─── Custom Tooltip (consistent with RevenueChart, UserStatsChart) ───
const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;

    return (
        <div className="bg-white/95 backdrop-blur-sm px-4 py-3 rounded-xl shadow-xl border border-slate-100">
            <p className="text-xs text-slate-500 mb-1">{label}</p>
            <p className="text-sm font-bold text-slate-800">
                {payload[0].value.toLocaleString('vi-VN')} lượt
            </p>
        </div>
    );
};

/**
 * AiUsageChart — Biểu đồ cột hiển thị lượt sử dụng AI
 *
 * @param {number}  totalAiRequests - Tổng lượt AI từ API /admin/stats
 * @param {string}  [className]     - Tailwind classes bổ sung
 */
const AiUsageChart = ({ totalAiRequests = 0, className = '' }) => {
    const [range, setRange] = useState('7d');

    const data = useMemo(
        () => generateAiData(totalAiRequests, range),
        [totalAiRequests, range]
    );

    const maxValue = useMemo(
        () => Math.max(...data.map((d) => d.requests)),
        [data]
    );

    return (
        <div
            className={`bg-white rounded-2xl p-6 shadow-lg shadow-slate-200/50 border border-slate-100 ${className}`}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-purple-500/10">
                        <Sparkles className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-slate-800">
                            Sử dụng AI
                        </h3>
                        <p className="text-sm text-slate-500 mt-0.5">
                            {range === '7d' ? '7 ngày gần đây' : '30 ngày gần đây'}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                    {/* Total value badge */}
                    <div className="text-right">
                        <p className="text-2xl font-bold text-slate-800">
                            {totalAiRequests.toLocaleString('vi-VN')}
                        </p>
                        <p className="text-xs text-slate-500">Tổng lượt</p>
                    </div>
                </div>
            </div>

            {/* Range Tabs */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg w-fit mb-5">
                {TIME_RANGES.map(({ key, label }) => (
                    <button
                        key={key}
                        onClick={() => setRange(key)}
                        className={`
                            px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200
                            ${range === key
                                ? 'bg-white text-slate-800 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                            }
                        `}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Chart */}
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id={GRADIENT_ID} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1} />
                                <stop offset="100%" stopColor="#6366f1" stopOpacity={0.7} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#e2e8f0"
                            vertical={false}
                        />
                        <XAxis
                            dataKey="label"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 12 }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 12 }}
                        />
                        <Tooltip
                            content={<CustomTooltip />}
                            cursor={{ fill: 'rgba(99, 102, 241, 0.06)', radius: 8 }}
                        />
                        <Bar dataKey="requests" radius={[6, 6, 0, 0]} maxBarSize={48}>
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={
                                        entry.requests === maxValue
                                            ? `url(#${GRADIENT_ID})`
                                            : '#c7d2fe'
                                    }
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
