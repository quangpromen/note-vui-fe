import { TrendingUp, TrendingDown } from 'lucide-react';

/**
 * StatCard - Card hiển thị thống kê với icon, giá trị và trend
 */
const StatCard = ({
    title,
    value,
    icon: Icon,
    trend,
    trendValue,
    gradient = 'from-teal-500 to-emerald-500',
    iconBg = 'bg-teal-500/10',
    iconColor = 'text-teal-600'
}) => {
    const isPositiveTrend = trend === 'up';

    return (
        <div className="group relative bg-white rounded-2xl p-6 shadow-lg shadow-slate-200/50 border border-slate-100 hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
            {/* Decorative gradient blob */}
            <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${gradient} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`} />

            <div className="relative flex items-start justify-between">
                <div className="space-y-3">
                    <p className="text-sm font-medium text-slate-500">{title}</p>
                    <p className="text-3xl font-bold text-slate-800">{value}</p>

                    {trendValue && (
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${isPositiveTrend
                                ? 'bg-emerald-50 text-emerald-600'
                                : 'bg-red-50 text-red-600'
                            }`}>
                            {isPositiveTrend
                                ? <TrendingUp className="w-3 h-3" />
                                : <TrendingDown className="w-3 h-3" />
                            }
                            {trendValue}
                        </div>
                    )}
                </div>

                <div className={`p-3 rounded-xl ${iconBg}`}>
                    <Icon className={`w-6 h-6 ${iconColor}`} />
                </div>
            </div>
        </div>
    );
};

export default StatCard;
