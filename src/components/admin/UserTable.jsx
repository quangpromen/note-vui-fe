import { useState } from 'react';
import { Table, Input, Button, Tag, Modal, message, Tooltip } from 'antd';
import {
    Search,
    Lock,
    Unlock,
    Crown,
    User as UserIcon,
    AlertTriangle
} from 'lucide-react';
import { toggleUserLock } from '../../services/adminService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import UserVipModal from './UserVipModal';

/**
 * UserTable - Bảng quản lý người dùng với Search, Pagination, Lock/Unlock và VIP Management
 */
const UserTable = ({
    users = [],
    loading = false,
    pagination = {},
    onSearch,
    onPageChange,
    onRefresh
}) => {
    const [searchValue, setSearchValue] = useState('');
    const [lockingUserId, setLockingUserId] = useState(null);

    // VIP Modal state
    const [vipModalOpen, setVipModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const handleSearch = () => {
        onSearch?.(searchValue);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const queryClient = useQueryClient();

    // Mutation cho việc khóa/mở khóa
    const lockMutation = useMutation({
        mutationFn: ({ id, isLocking }) => toggleUserLock(id, isLocking),
        onSuccess: (result, variables) => {
            message.success(result.message || `Đã ${variables.isLocking ? 'khóa' : 'mở khóa'} tài khoản thành công`);
            // Tự động làm mới bảng bằng cách xóa cache 'users'
            queryClient.invalidateQueries(['users']);
            onRefresh?.();
        },
        onError: (error) => {
            message.error(error.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
        }
    });

    const handleToggleLock = (user) => {
        const isLocking = !user.isLocked;

        Modal.confirm({
            title: isLocking ? 'Khóa tài khoản' : 'Mở khóa tài khoản',
            icon: <AlertTriangle className={`w-5 h-5 ${isLocking ? 'text-red-500' : 'text-green-500'}`} />,
            content: (
                <div className="mt-2">
                    <p className="text-slate-600">
                        Bạn có chắc muốn {isLocking ? 'khóa' : 'mở khóa'} tài khoản của{' '}
                        <strong>{user.fullName || user.email}</strong>?
                    </p>
                    {isLocking && (
                        <p className="text-sm text-red-500 mt-2">
                            Người dùng này sẽ không thể đăng nhập cho đến khi được mở khóa.
                        </p>
                    )}
                </div>
            ),
            okText: isLocking ? 'Khóa' : 'Mở khóa',
            okButtonProps: {
                danger: isLocking,
                className: isLocking ? '' : 'bg-green-500 hover:bg-green-600 border-green-500'
            },
            cancelText: 'Hủy',
            onOk: () => {
                lockMutation.mutate({ id: user.id, isLocking });
            }
        });
    };

    const handleOpenVipModal = (user) => {
        setSelectedUser(user);
        setVipModalOpen(true);
    };

    const handleCloseVipModal = () => {
        setVipModalOpen(false);
        setSelectedUser(null);
        // Refresh table after closing modal to get updated data
        onRefresh?.();
    };

    const columns = [
        {
            title: 'Người dùng',
            dataIndex: 'fullName',
            key: 'fullName',
            render: (text, record) => (
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white font-bold shadow-md">
                            {text ? text.charAt(0).toUpperCase() : record.email?.charAt(0).toUpperCase()}
                        </div>
                        {/* Premium badge indicator */}
                        {record.planName?.toLowerCase().includes('premium') && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white">
                                <Crown className="w-3 h-3 text-white" />
                            </div>
                        )}
                    </div>
                    <div>
                        <p className="font-medium text-slate-800">{text || 'Chưa đặt tên'}</p>
                        <p className="text-xs text-slate-500">{record.email}</p>
                    </div>
                </div>
            )
        },
        {
            title: 'Gói dịch vụ',
            dataIndex: 'planName',
            key: 'planName',
            render: (text) => {
                const isPremium = text && text.toLowerCase().includes('premium');
                const isMonthly = text && text.toLowerCase().includes('month');
                const isYearly = text && text.toLowerCase().includes('year');

                return (
                    <div className="flex items-center gap-2">
                        <Tag
                            icon={isPremium ? <Crown className="w-3 h-3 mr-1" /> : <UserIcon className="w-3 h-3 mr-1" />}
                            color={isPremium ? 'gold' : 'default'}
                            className="flex items-center w-fit"
                        >
                            {text || 'Free'}
                        </Tag>
                        {isPremium && (
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${isYearly
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-amber-100 text-amber-700'
                                }`}>
                                {isYearly ? 'Năm' : isMonthly ? 'Tháng' : ''}
                            </span>
                        )}
                    </div>
                );
            }
        },
        {
            title: 'Ngày tham gia',
            dataIndex: 'joinDate',
            key: 'joinDate',
            render: (date) => {
                if (!date) return '-';
                return new Date(date).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                });
            }
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isLocked',
            key: 'isLocked',
            render: (isLocked) => (
                <Tag color={isLocked ? 'red' : 'green'} className="flex items-center w-fit gap-1">
                    {isLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                    {isLocked ? 'Đã khóa' : 'Hoạt động'}
                </Tag>
            )
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 180,
            render: (_, record) => (
                <div className="flex items-center gap-2">
                    {/* VIP Management Button */}
                    <Tooltip title="Quản lý VIP">
                        <button
                            onClick={() => handleOpenVipModal(record)}
                            className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 text-white hover:from-amber-500 hover:to-orange-600 shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-all hover:scale-105 active:scale-95"
                        >
                            <Crown className="w-4 h-4" />
                        </button>
                    </Tooltip>

                    {/* Lock/Unlock Button */}
                    <Tooltip title={record.isLocked ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}>
                        <Button
                            type={record.isLocked ? 'primary' : 'default'}
                            danger={!record.isLocked}
                            icon={record.isLocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                            loading={lockMutation.isPending && lockMutation.variables?.id === record.id}
                            onClick={() => handleToggleLock(record)}
                            className="flex items-center justify-center"
                        >
                            {record.isLocked ? 'Mở' : 'Khóa'}
                        </Button>
                    </Tooltip>
                </div>
            )
        }
    ];

    return (
        <>
            <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 overflow-hidden">
                {/* Header & Search */}
                <div className="p-6 border-b border-slate-100">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h3 className="text-lg font-semibold text-slate-800">Danh sách người dùng</h3>
                            <p className="text-sm text-slate-500 mt-1">
                                {pagination.totalCount || 0} người dùng trong hệ thống
                            </p>
                        </div>

                        <div className="flex gap-2">
                            <Input
                                placeholder="Tìm theo email, họ tên..."
                                prefix={<Search className="w-4 h-4 text-slate-400" />}
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className="w-64"
                                allowClear
                            />
                            <Button type="primary" onClick={handleSearch}>
                                Tìm kiếm
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <Table
                    columns={columns}
                    dataSource={users}
                    loading={loading}
                    rowKey="id"
                    pagination={{
                        current: pagination.pageIndex || 1,
                        pageSize: pagination.pageSize || 10,
                        total: pagination.totalCount || 0,
                        showSizeChanger: true,
                        showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} người dùng`,
                        onChange: (page, pageSize) => onPageChange?.(page, pageSize)
                    }}
                    className="[&_.ant-table-thead_th]:bg-slate-50 [&_.ant-table-thead_th]:text-slate-600 [&_.ant-table-thead_th]:font-semibold"
                />
            </div>

            {/* VIP Management Modal */}
            <UserVipModal
                isOpen={vipModalOpen}
                onClose={handleCloseVipModal}
                user={selectedUser}
            />
        </>
    );
};

export default UserTable;
