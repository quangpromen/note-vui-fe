import { useState } from 'react';
import { Spin } from 'antd';
import { RefreshCw, List, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

import AdminLayout from '../layout/AdminLayout';
import SubscriptionRequestsTable from '../components/admin/SubscriptionRequestsTable';
import { getSubscriptionRequests } from '../services/adminService';

const SubscriptionRequestsPage = () => {
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState(''); // '' (all), 0 (Pending), 1 (Approved), 2 (Rejected), 3 (Cancelled)

    // Sử dụng React Query để quản lý data fetching
    const {
        data: requestsData,
        isLoading,
        isFetching,
        refetch
    } = useQuery({
        queryKey: ['subscription-requests', searchQuery, statusFilter, pageIndex, pageSize],
        queryFn: () => getSubscriptionRequests({
            search: searchQuery,
            status: statusFilter === '' ? undefined : statusFilter,
            page: pageIndex,
            pageSize
        }),
        keepPreviousData: true,
        staleTime: 5000, // Data được coi là mới trong 5s
    });

    const handleSearch = (search) => {
        setSearchQuery(search);
        setPageIndex(1);
    };

    const handleStatusFilter = (status) => {
        setStatusFilter(status);
        setPageIndex(1);
    }

    const handlePageChange = (page, size) => {
        setPageIndex(page);
        setPageSize(size);
    };

    const handleRefresh = () => {
        refetch();
    };

    const items = requestsData?.items || [];
    const totalCount = requestsData?.totalCount || 0;

    // Optional client-side quick stats based on current page if total breakdown isn't provided by API
    // Since API might not provide exact numbers for each status globally, we can just show total.
    // Assuming backend returns it or we just use current page's view. We'll stick to a simple display.

    if (isLoading && !requestsData) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <Spin size="large" />
                        <p className="mt-4 text-slate-500">Đang tải danh sách yêu cầu nâng cấp...</p>
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
                        Yêu cầu nâng cấp VIP
                    </h1>
                    <p className="text-slate-500 mt-1 font-medium italic">
                        Quản lý và duyệt các yêu cầu đăng ký gói VIP từ người dùng
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
                    label="Tổng bản ghi (All)"
                    value={totalCount}
                    icon={List}
                    color="text-indigo-600"
                    bgColor="bg-indigo-50"
                />
                <QuickStat
                    label="Chờ duyệt (Pending)"
                    value={statusFilter === '' || statusFilter === 0 ? items.filter(u => u.status === 'Pending').length : '-'}
                    icon={Clock}
                    color="text-amber-600"
                    bgColor="bg-amber-50"
                    suffix={items.length > 0 && (statusFilter === '' || statusFilter === 0) ? ` trong trang` : ''}
                />
                <QuickStat
                    label="Đã duyệt (Approved)"
                    value={statusFilter === '' || statusFilter === 1 ? items.filter(u => u.status === 'Approved').length : '-'}
                    icon={CheckCircle}
                    color="text-emerald-600"
                    bgColor="bg-emerald-50"
                    suffix={items.length > 0 && (statusFilter === '' || statusFilter === 1) ? ` trong trang` : ''}
                />
                <QuickStat
                    label="Từ chối/Hủy"
                    value={statusFilter === '' || statusFilter === 2 || statusFilter === 3 ? items.filter(u => u.status === 'Rejected' || u.status === 'Cancelled').length : '-'}
                    icon={XCircle}
                    color="text-red-600"
                    bgColor="bg-red-50"
                    suffix={items.length > 0 && (statusFilter === '' || statusFilter === 2 || statusFilter === 3) ? ` trong trang` : ''}
                />
            </div>

            {/* Data Table Component */}
            <SubscriptionRequestsTable
                requests={items}
                loading={isFetching}
                pagination={{
                    pageIndex: requestsData?.pageIndex || pageIndex,
                    pageSize: requestsData?.pageSize || pageSize,
                    totalCount: requestsData?.totalCount || 0,
                    totalPages: requestsData?.totalPages || 0
                }}
                statusFilter={statusFilter}
                onSearch={handleSearch}
                onStatusChange={handleStatusFilter}
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
            <p className="text-2xl font-bold text-slate-800">
                {value}
                {suffix && <span className="text-xs font-normal text-slate-400 ml-1">{suffix}</span>}
            </p>
        </div>
    </div>
);

export default SubscriptionRequestsPage;
