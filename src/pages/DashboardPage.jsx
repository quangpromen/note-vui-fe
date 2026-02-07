import { useEffect, useState } from 'react';
import { Spin, message } from 'antd';
import {
    DollarSign,
    Users,
    Crown,
    Sparkles,
    RefreshCw
} from 'lucide-react';

import AdminLayout from '../layout/AdminLayout';
import StatCard from '../components/admin/StatCard';
import RevenueChart from '../components/admin/RevenueChart';
import UserStatsChart from '../components/admin/UserStatsChart';
import { getStats } from '../services/adminService';

const DashboardPage = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchStats = async (isRefresh = false) => {
        try {
            if (isRefresh) setRefreshing(true);
            else setLoading(true);

            const data = await getStats();
            setStats(data);
        } catch (error) {
            console.error('Failed to fetch stats:', error);
            message.error('Không thể tải dữ liệu thống kê. Vui lòng thử lại.');

            // Mock data khi API Fail (Development mode)
            setStats({
                totalRevenue: 15000000,
                totalUsers: 1250,
                activePremiumUsers: 87,
                totalAiRequests: 4500
            });
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const formatCurrency = (value) => {
        if (!value) return '0 ₫';
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            maximumFractionDigits: 0
        }).format(value);
    };

    const formatNumber = (value) => {
        if (!value) return '0';
        return new Intl.NumberFormat('vi-VN').format(value);
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <Spin size="large" />
                        <p className="mt-4 text-slate-500">Đang tải dữ liệu...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">
                        Dashboard
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Tổng quan hoạt động hệ thống NoteVui
                    </p>
                </div>
                <button
                    onClick={() => fetchStats(true)}
                    disabled={refreshing}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all disabled:opacity-50"
                >
                    <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                    Làm mới
                </button>
            </div>

            {/* Stats Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
                <StatCard
                    title="Tổng doanh thu"
                    value={formatCurrency(stats?.totalRevenue)}
                    icon={DollarSign}
                    trend="up"
                    trendValue="+12.5%"
                    gradient="from-emerald-500 to-teal-500"
                    iconBg="bg-emerald-500/10"
                    iconColor="text-emerald-600"
                />
                <StatCard
                    title="Tổng người dùng"
                    value={formatNumber(stats?.totalUsers)}
                    icon={Users}
                    trend="up"
                    trendValue="+8.2%"
                    gradient="from-blue-500 to-indigo-500"
                    iconBg="bg-blue-500/10"
                    iconColor="text-blue-600"
                />
                <StatCard
                    title="Premium đang hoạt động"
                    value={formatNumber(stats?.activePremiumUsers)}
                    icon={Crown}
                    trend="up"
                    trendValue="+15.3%"
                    gradient="from-amber-500 to-orange-500"
                    iconBg="bg-amber-500/10"
                    iconColor="text-amber-600"
                />
                <StatCard
                    title="Lượt sử dụng AI"
                    value={formatNumber(stats?.totalAiRequests)}
                    icon={Sparkles}
                    trend="up"
                    trendValue="+23.1%"
                    gradient="from-purple-500 to-pink-500"
                    iconBg="bg-purple-500/10"
                    iconColor="text-purple-600"
                />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Revenue Chart - Full width on mobile, half on large screens */}
                <RevenueChart totalRevenue={stats?.totalRevenue || 0} />

                {/* User Stats Pie Chart */}
                <UserStatsChart
                    totalUsers={stats?.totalUsers || 0}
                    activePremiumUsers={stats?.activePremiumUsers || 0}
                />
            </div>



            {/* Quick Info */}
            <div className="bg-gradient-to-r from-teal-500 to-emerald-600 rounded-2xl p-6 text-white">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-semibold">💡 Gợi ý cho Admin</h3>
                        <p className="text-teal-100 mt-1">
                            Tỷ lệ chuyển đổi Premium hiện tại là{' '}
                            <strong className="text-white">
                                {stats?.totalUsers > 0
                                    ? ((stats.activePremiumUsers / stats.totalUsers) * 100).toFixed(1)
                                    : 0}%
                            </strong>
                            . Hãy xem xét các chiến dịch marketing để tăng tỷ lệ này.
                        </p>
                    </div>
                    <button className="px-6 py-2.5 bg-white/20 hover:bg-white/30 rounded-xl font-medium transition-colors backdrop-blur-sm">
                        Xem báo cáo chi tiết →
                    </button>
                </div>
            </div>
        </AdminLayout>
    );
};

export default DashboardPage;
