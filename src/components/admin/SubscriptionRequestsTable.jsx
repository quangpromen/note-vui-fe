import { useState } from 'react';
import { Table, Input, Button, Tag, Modal, message, Tooltip, Select, Space } from 'antd';
import {
    Search,
    CheckCircle,
    XCircle,
    Clock,
    User as UserIcon,
    Crown,
    Ban
} from 'lucide-react';
import { approveSubscriptionRequest, rejectSubscriptionRequest } from '../../services/adminService';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const { TextArea } = Input;
const { Option } = Select;

/**
 * Bảng quản lý Yêu cầu nâng cấp VIP
 */
const SubscriptionRequestsTable = ({
    requests = [],
    loading = false,
    pagination = {},
    statusFilter = '',
    onSearch,
    onStatusChange,
    onPageChange,
    onRefresh
}) => {
    const [searchValue, setSearchValue] = useState('');

    // Reject Modal state
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [rejectingRequest, setRejectingRequest] = useState(null);
    const [rejectReason, setRejectReason] = useState('');

    const handleSearch = () => {
        onSearch?.(searchValue);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const queryClient = useQueryClient();

    // Mutation cho duyệt yêu cầu
    const approveMutation = useMutation({
        mutationFn: (id) => approveSubscriptionRequest(id),
        onSuccess: (result) => {
            message.success(result.message || 'Đã phê duyệt thành công.');
            queryClient.invalidateQueries(['subscription-requests']);
            onRefresh?.();
        },
        onError: (error) => {
            message.error(error.response?.data?.message || 'Có lỗi xảy ra khi phê duyệt.');
        }
    });

    // Mutation cho từ chối yêu cầu
    const rejectMutation = useMutation({
        mutationFn: ({ id, reason }) => rejectSubscriptionRequest(id, reason),
        onSuccess: (result) => {
            message.success(result.message || 'Đã từ chối yêu cầu.');
            setRejectModalOpen(false);
            setRejectReason('');
            setRejectingRequest(null);
            queryClient.invalidateQueries(['subscription-requests']);
            onRefresh?.();
        },
        onError: (error) => {
            message.error(error.response?.data?.message || 'Có lỗi xảy ra khi từ chối.');
        }
    });

    const handleApprove = (request) => {
        Modal.confirm({
            title: 'Phê duyệt yêu cầu nâng cấp',
            icon: <Crown className="w-5 h-5 text-amber-500" />,
            content: (
                <div className="mt-2 text-slate-600">
                    <p>Bạn có chắc muốn cấp VIP ({request.planName}) cho user <strong>{request.userFullName || request.userEmail}</strong>?</p>
                </div>
            ),
            okText: 'Phê duyệt',
            cancelText: 'Hủy',
            okButtonProps: {
                className: 'bg-emerald-500 hover:bg-emerald-600 border-emerald-500'
            },
            onOk: () => {
                approveMutation.mutate(request.id);
            }
        });
    };

    const handleOpenReject = (request) => {
        setRejectingRequest(request);
        setRejectReason('');
        setRejectModalOpen(true);
    };

    const submitReject = () => {
        if (!rejectReason.trim()) {
            message.error('Vui lòng nhập lý do từ chối.');
            return;
        }
        rejectMutation.mutate({ id: rejectingRequest.id, reason: rejectReason.trim() });
    };

    const renderStatusTag = (status) => {
        switch (status) {
            case 'Pending':
                return <Tag color="orange" icon={<Clock className="w-3 h-3 mr-1" />}>Chờ duyệt</Tag>;
            case 'Approved':
                return <Tag color="green" icon={<CheckCircle className="w-3 h-3 mr-1" />}>Đã duyệt</Tag>;
            case 'Rejected':
                return <Tag color="red" icon={<XCircle className="w-3 h-3 mr-1" />}>Từ chối</Tag>;
            case 'Cancelled':
                return <Tag color="default" icon={<Ban className="w-3 h-3 mr-1" />}>Đã hủy</Tag>;
            default:
                return <Tag color="default">{status}</Tag>;
        }
    };

    const columns = [
        {
            title: 'Người dùng',
            dataIndex: 'userFullName',
            key: 'userFullName',
            render: (text, record) => (
                <div className="flex items-center gap-3">
                    <div className="relative">
                        {record.userAvatarUrl ? (
                            <img
                                src={record.userAvatarUrl}
                                alt={text || record.userEmail}
                                className="w-10 h-10 rounded-full object-cover shadow-sm bg-slate-100"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
                                {text ? text.charAt(0).toUpperCase() : record.userEmail?.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                    <div>
                        <p className="font-medium text-slate-800">
                            {text || 'Chưa cập nhật'}
                        </p>
                        <p className="text-xs text-slate-500">{record.userEmail}</p>
                    </div>
                </div>
            )
        },
        {
            title: 'Gói đăng ký',
            key: 'planType',
            render: (_, record) => (
                <div className="flex flex-col">
                    <span className="font-medium text-amber-600 flex items-center gap-1">
                        <Crown className="w-3 h-3" /> {record.planName || record.planType}
                    </span>
                </div>
            )
        },
        {
            title: 'Ghi chú / Trạng thái',
            key: 'note',
            width: 280,
            render: (_, record) => (
                <div className="flex flex-col gap-1">
                    <div className="text-sm text-slate-700 bg-slate-50 p-2 rounded border border-slate-100">
                        {record.note || <span className="text-slate-400 italic">Không có ghi chú</span>}
                    </div>
                    {record.adminNote && (
                        <div className="text-xs text-red-600 mt-1">
                            <strong>Lý do: </strong> {record.adminNote}
                        </div>
                    )}
                </div>
            )
        },
        {
            title: 'Ngày gửi',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => {
                if (!date) return '-';
                return new Date(date).toLocaleString('vi-VN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            }
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => renderStatusTag(status)
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => {
                if (record.status !== 'Pending') {
                    if (record.processedByUserName) {
                        return (
                            <div className="text-xs text-slate-500">
                                Xử lý bởi: <br /><strong>{record.processedByUserName}</strong>
                            </div>
                        );
                    }
                    return '-';
                }

                return (
                    <Space>
                        <Tooltip title="Phê duyệt yêu cầu">
                            <Button
                                type="primary"
                                className="bg-emerald-500 hover:bg-emerald-600 border-emerald-500"
                                icon={<CheckCircle className="w-4 h-4" />}
                                onClick={() => handleApprove(record)}
                                loading={approveMutation.isPending && approveMutation.variables === record.id}
                            >
                                Duyệt
                            </Button>
                        </Tooltip>
                        <Tooltip title="Từ chối yêu cầu">
                            <Button
                                danger
                                icon={<XCircle className="w-4 h-4" />}
                                onClick={() => handleOpenReject(record)}
                            >
                                Từ chối
                            </Button>
                        </Tooltip>
                    </Space>
                );
            }
        }
    ];

    return (
        <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 overflow-hidden">
            {/* Header, Filter & Search */}
            <div className="p-6 border-b border-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-800">Danh sách yêu cầu</h3>
                        <p className="text-sm text-slate-500 mt-1">
                            {pagination.totalCount || 0} bản ghi
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Select
                            value={statusFilter}
                            onChange={(val) => onStatusChange?.(val)}
                            className="w-40"
                            placeholder="Lọc trạng thái"
                        >
                            <Option value="">Tất cả trạng thái</Option>
                            <Option value={0}>Chờ duyệt</Option>
                            <Option value={1}>Đã duyệt</Option>
                            <Option value={2}>Từ chối</Option>
                            <Option value={3}>Đã hủy</Option>
                        </Select>

                        <div className="flex gap-2">
                            <Input
                                placeholder="Tìm email, tên..."
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
            </div>

            {/* Table */}
            <Table
                columns={columns}
                dataSource={requests}
                loading={loading}
                rowKey="id"
                pagination={{
                    current: pagination.pageIndex || 1,
                    pageSize: pagination.pageSize || 10,
                    total: pagination.totalCount || 0,
                    showSizeChanger: true,
                    showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} yêu cầu`,
                    onChange: (page, pageSize) => onPageChange?.(page, pageSize)
                }}
                className="[&_.ant-table-thead_th]:bg-slate-50 [&_.ant-table-thead_th]:text-slate-600 [&_.ant-table-thead_th]:font-semibold"
            />

            {/* Reject Modal */}
            <Modal
                title={
                    <div className="flex items-center gap-2 text-red-600">
                        <XCircle className="w-5 h-5" />
                        <span>Từ chối yêu cầu nâng cấp</span>
                    </div>
                }
                open={rejectModalOpen}
                onOk={submitReject}
                onCancel={() => {
                    setRejectModalOpen(false);
                    setRejectReason('');
                }}
                okText="Xác nhận từ chối"
                cancelText="Hủy"
                okButtonProps={{ danger: true, loading: rejectMutation.isPending }}
            >
                <div className="mb-4 mt-2">
                    <p className="text-slate-600 mb-2">
                        Bạn đang từ chối yêu cầu nâng cấp của user <strong>{rejectingRequest?.userFullName || rejectingRequest?.userEmail}</strong>.
                    </p>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        Lý do từ chối <span className="text-red-500">*</span>
                    </label>
                    <TextArea
                        rows={4}
                        placeholder="VD: Không tìm thấy giao dịch với nội dung này..."
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                    />
                </div>
            </Modal>
        </div>
    );
};

export default SubscriptionRequestsTable;
