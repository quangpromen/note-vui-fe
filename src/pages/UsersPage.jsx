import { useState } from 'react';
import { Spin } from 'antd';
import { RefreshCw, Users as UsersIcon, ShieldAlert, Crown, UserCheck } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

import AdminLayout from '../layout/AdminLayout';
import UserTable from '../components/admin/UserTable';
import { getUsers } from '../services/adminService';

const UsersPage = () => {
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');

    // Sử dụng React Query để quản lý data fetching
    const {
        data: usersData,
        isLoading,
        isFetching,
        refetch
    } = useQuery({
        queryKey: ['users', searchQuery, pageIndex, pageSize],
        queryFn: () => getUsers({ search: searchQuery, page: pageIndex, pageSize }),
        keepPreviousData: true,
        staleTime: 5000, // Data được coi là mới trong 5s
    });

    const handleSearch = (search) => {
        setSearchQuery(search);
        setPageIndex(1);
    };

    const handlePageChange = (page, size) => {
        setPageIndex(page);
        setPageSize(size);
    };

    const handleRefresh = () => {
        refetch();
    };

    // Tính toán thống kê nhanh từ data hiện tại (hoặc có thể từ API stats)
    const items = usersData?.items || [];
    const totalCount = usersData?.totalCount || 0;

    if (isLoading && !usersData) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <Spin size="large" />
                        <p className="mt-4 text-slate-500">Đang tải danh sách người dùng...</p>
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
                        Quản lý người dùng
                    </h1>
                    <p className="text-slate-500 mt-1 font-medium italic">
                        Xem và quản lý tài khoản người dùng trong hệ thống NoteVui
                    </p>
                </div>
                <button
                    onClick={handleRefresh}
                    disabled={isFetching}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm active:scale-95 disabled:opacity-50"
                >
                    <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
                    <span className="font-medium">Làm mới</span>
                </button>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <QuickStat
                    label="Tổng người dùng"
                    value={totalCount}
                    icon={UsersIcon}
                    color="text-blue-600"
                    bgColor="bg-blue-50"
                />
                <QuickStat
                    label="Đang hoạt động"
                    value={items.filter(u => !u.isLocked).length}
                    icon={UserCheck}
                    color="text-emerald-600"
                    bgColor="bg-emerald-50"
                    suffix={items.length > 0 ? ` trong trang` : ''}
                />
                <QuickStat
                    label="Đã bị khóa"
                    value={items.filter(u => u.isLocked).length}
                    icon={ShieldAlert}
                    color="text-red-600"
                    bgColor="bg-red-50"
                    suffix={items.length > 0 ? ` trong trang` : ''}
                />
                <QuickStat
                    label="Premium"
                    value={items.filter(u => u.planName?.toLowerCase().includes('premium')).length}
                    icon={Crown}
                    color="text-amber-600"
                    bgColor="bg-amber-50"
                    suffix={items.length > 0 ? ` trong trang` : ''}
                />
            </div>

            {/* User Table Component */}
            <UserTable
                users={items}
                loading={isFetching}
                pagination={{
                    pageIndex: usersData?.pageIndex || pageIndex,
                    pageSize: usersData?.pageSize || pageSize,
                    totalCount: usersData?.totalCount || 0,
                    totalPages: usersData?.totalPages || 0
                }}
                onSearch={handleSearch}
                onPageChange={handlePageChange}
                onRefresh={handleRefresh}
            />
        </AdminLayout>
    );
};

// Sub-component cho Stat cards nhanh
const QuickStat = ({ label, value, icon: Icon, color, bgColor, suffix = '' }) => (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
        <div className={`w-12 h-12 rounded-xl ${bgColor} flex items-center justify-center`}>
            <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <div>
            <p className="text-sm font-medium text-slate-500">{label}</p>
            <p className={`text-2xl font-bold text-slate-800`}>
                {value}
                {suffix && <span className="text-xs font-normal text-slate-400 ml-1">{suffix}</span>}
            </p>
        </div>
    </div>
);

export default UsersPage;
