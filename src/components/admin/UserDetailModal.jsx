import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
    X,
    User as UserIcon,
    Mail,
    Crown,
    Shield,
    Lock,
    Unlock,
    StickyNote,
    Trash2,
    Pin,
    Bot,
    Calendar,
    Clock,
    Edit3,
    Loader2,
    ExternalLink,
    Sparkles,
    TrendingUp,
    CheckCircle2,
    XCircle
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getUserDetail } from '../../services/adminService';

/**
 * UserDetailModal - Modal hiển thị chi tiết đầy đủ thông tin người dùng
 * Sections: Info, Subscription, Notes Stats, AI Usage
 */
const UserDetailModal = ({ isOpen, onClose, user, onEdit }) => {
    // Fetch full detail khi modal mở
    const { data: detail, isLoading, isError, error } = useQuery({
        queryKey: ['userDetail', user?.id],
        queryFn: () => getUserDetail(user.id),
        enabled: isOpen && !!user?.id,
        staleTime: 0,
    });

    const formatDate = (dateString) => {
        if (!dateString) return 'Không có';
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDateShort = (dateString) => {
        if (!dateString) return '—';
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    const isPremium = detail?.subscription?.isVip;
    const isFree = detail?.subscription?.planType === 'Free';

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                {/* Backdrop */}
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95 translate-y-4"
                            enterTo="opacity-100 scale-100 translate-y-0"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100 translate-y-0"
                            leaveTo="opacity-0 scale-95 translate-y-4"
                        >
                            <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
                                {/* ===== HEADER with gradient ===== */}
                                <div className="relative bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 px-6 py-6">
                                    <button
                                        onClick={onClose}
                                        className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                                    >
                                        <X className="w-4 h-4 text-white" />
                                    </button>

                                    <div className="flex items-center gap-4">
                                        {/* Avatar */}
                                        <div className="relative">
                                            {detail?.avatarUrl ? (
                                                <img
                                                    src={detail.avatarUrl}
                                                    alt={detail.fullName}
                                                    className="w-16 h-16 rounded-full object-cover ring-4 ring-white/30 shadow-lg"
                                                />
                                            ) : (
                                                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center ring-4 ring-white/30 shadow-lg">
                                                    <span className="text-2xl font-bold text-white">
                                                        {(detail?.fullName || user?.fullName || user?.email || '?').charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                            )}
                                            {isPremium && (
                                                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white">
                                                    <Crown className="w-3.5 h-3.5 text-white" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <Dialog.Title className="text-xl font-bold text-white truncate">
                                                {detail?.fullName || user?.fullName || 'Đang tải...'}
                                            </Dialog.Title>
                                            <p className="text-teal-100 text-sm mt-0.5 flex items-center gap-1.5">
                                                <Mail className="w-3.5 h-3.5" />
                                                {detail?.email || user?.email}
                                            </p>
                                            <div className="flex items-center gap-2 mt-2">
                                                {detail?.isLocked ? (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/30 text-red-100 text-xs font-medium">
                                                        <Lock className="w-3 h-3" /> Đã khóa
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-100 text-xs font-medium">
                                                        <Unlock className="w-3 h-3" /> Hoạt động
                                                    </span>
                                                )}
                                                {isPremium && (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/30 text-amber-100 text-xs font-medium">
                                                        <Sparkles className="w-3 h-3" /> {detail?.subscription?.planName}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Edit Button */}
                                        <button
                                            onClick={() => onEdit?.(detail || user)}
                                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-medium text-sm transition-all hover:scale-105 active:scale-95 backdrop-blur-sm"
                                            title="Chỉnh sửa thông tin"
                                        >
                                            <Edit3 className="w-4 h-4" />
                                            Chỉnh sửa
                                        </button>
                                    </div>
                                </div>

                                {/* ===== CONTENT ===== */}
                                <div className="p-6">
                                    {isLoading ? (
                                        <div className="flex flex-col items-center justify-center py-16">
                                            <Loader2 className="w-10 h-10 text-teal-500 animate-spin" />
                                            <p className="mt-3 text-slate-500 text-sm">Đang tải thông tin chi tiết...</p>
                                        </div>
                                    ) : isError ? (
                                        <div className="flex flex-col items-center justify-center py-16">
                                            <XCircle className="w-12 h-12 text-red-400" />
                                            <p className="mt-3 text-red-600 font-medium">
                                                {error?.response?.data?.message || 'Không thể tải thông tin người dùng.'}
                                            </p>
                                            <button
                                                onClick={onClose}
                                                className="mt-4 px-4 py-2 text-sm rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                                            >
                                                Đóng
                                            </button>
                                        </div>
                                    ) : detail ? (
                                        <div className="space-y-6">
                                            {/* ── Section 1: Subscription ── */}
                                            <div className="rounded-xl border border-slate-200 overflow-hidden">
                                                <div className="px-4 py-3 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                                                    <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                                                        <Crown className="w-4 h-4 text-amber-500" />
                                                        Gói dịch vụ
                                                    </h3>
                                                </div>
                                                <div className="p-4">
                                                    {isFree ? (
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                                                                <UserIcon className="w-6 h-6 text-slate-400" />
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-slate-800">Free</p>
                                                                <p className="text-sm text-slate-500">Gói miễn phí - Chưa đăng ký Premium</p>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-4">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                                                                        <Crown className="w-6 h-6 text-white" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-semibold text-slate-800">{detail.subscription.planName}</p>
                                                                        <div className="flex items-center gap-2 mt-0.5">
                                                                            {detail.subscription.status === 'Active' ? (
                                                                                <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
                                                                                    <CheckCircle2 className="w-3 h-3" /> Đang hoạt động
                                                                                </span>
                                                                            ) : (
                                                                                <span className="inline-flex items-center gap-1 text-xs text-red-500 font-medium">
                                                                                    <XCircle className="w-3 h-3" /> {detail.subscription.status || 'Không hoạt động'}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                {detail.subscription.daysRemaining != null && (
                                                                    <div className="text-right">
                                                                        <p className="text-2xl font-bold text-teal-600">{detail.subscription.daysRemaining}</p>
                                                                        <p className="text-xs text-slate-500">ngày còn lại</p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            {/* Date range */}
                                                            <div className="grid grid-cols-2 gap-3">
                                                                <div className="bg-slate-50 rounded-lg p-3">
                                                                    <p className="text-xs text-slate-500 flex items-center gap-1">
                                                                        <Calendar className="w-3 h-3" /> Ngày bắt đầu
                                                                    </p>
                                                                    <p className="text-sm font-medium text-slate-700 mt-1">{formatDateShort(detail.subscription.startDate)}</p>
                                                                </div>
                                                                <div className="bg-slate-50 rounded-lg p-3">
                                                                    <p className="text-xs text-slate-500 flex items-center gap-1">
                                                                        <Clock className="w-3 h-3" /> Ngày kết thúc
                                                                    </p>
                                                                    <p className="text-sm font-medium text-slate-700 mt-1">{formatDateShort(detail.subscription.endDate)}</p>
                                                                </div>
                                                            </div>
                                                            {/* Auto Renew */}
                                                            <div className="flex items-center gap-2 text-sm">
                                                                <Sparkles className="w-4 h-4 text-indigo-500" />
                                                                <span className="text-slate-600">Tự động gia hạn:</span>
                                                                <span className={`font-medium ${detail.subscription.isAutoRenew ? 'text-emerald-600' : 'text-slate-400'}`}>
                                                                    {detail.subscription.isAutoRenew ? 'Bật' : 'Tắt'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* ── Section 2: Notes Statistics ── */}
                                            <div className="rounded-xl border border-slate-200 overflow-hidden">
                                                <div className="px-4 py-3 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                                                    <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                                                        <StickyNote className="w-4 h-4 text-blue-500" />
                                                        Thống kê Notes
                                                    </h3>
                                                </div>
                                                <div className="p-4">
                                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                                        <NoteStatCard
                                                            label="Tổng notes"
                                                            value={detail.totalNotes}
                                                            icon={StickyNote}
                                                            color="text-blue-600"
                                                            bgColor="bg-blue-50"
                                                        />
                                                        <NoteStatCard
                                                            label="Đang hoạt động"
                                                            value={detail.activeNotes}
                                                            icon={CheckCircle2}
                                                            color="text-emerald-600"
                                                            bgColor="bg-emerald-50"
                                                        />
                                                        <NoteStatCard
                                                            label="Đã xóa"
                                                            value={detail.deletedNotes}
                                                            icon={Trash2}
                                                            color="text-red-500"
                                                            bgColor="bg-red-50"
                                                        />
                                                        <NoteStatCard
                                                            label="Đã ghim"
                                                            value={detail.pinnedNotes}
                                                            icon={Pin}
                                                            color="text-amber-600"
                                                            bgColor="bg-amber-50"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* ── Section 3: AI Usage ── */}
                                            <div className="rounded-xl border border-slate-200 overflow-hidden">
                                                <div className="px-4 py-3 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                                                    <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                                                        <Bot className="w-4 h-4 text-purple-500" />
                                                        AI Usage
                                                    </h3>
                                                </div>
                                                <div className="p-4">
                                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                                        <AiStatCard
                                                            label="Hôm nay"
                                                            value={detail.aiUsage.usedToday}
                                                            gradient="from-violet-500 to-purple-600"
                                                        />
                                                        <AiStatCard
                                                            label="Tháng này"
                                                            value={detail.aiUsage.usedThisMonth}
                                                            gradient="from-blue-500 to-cyan-600"
                                                        />
                                                        <AiStatCard
                                                            label="Năm nay"
                                                            value={detail.aiUsage.usedThisYear}
                                                            gradient="from-teal-500 to-emerald-600"
                                                        />
                                                        <AiStatCard
                                                            label="Tổng cộng"
                                                            value={detail.aiUsage.totalUsed}
                                                            gradient="from-amber-500 to-orange-600"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* ── Lock Status Info ── */}
                                            {detail.isLocked && detail.lockoutEnd && (
                                                <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200">
                                                    <Shield className="w-5 h-5 text-red-500 flex-shrink-0" />
                                                    <div>
                                                        <p className="text-sm font-medium text-red-700">Tài khoản đang bị khóa</p>
                                                        <p className="text-xs text-red-500 mt-0.5">
                                                            Khóa đến: {formatDate(detail.lockoutEnd)}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* User ID (subtle) */}
                                            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                                                <p className="text-xs text-slate-400 font-mono">
                                                    ID: {detail.userId}
                                                </p>
                                                <button
                                                    onClick={onClose}
                                                    className="px-4 py-2 text-sm rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium transition-colors active:scale-95"
                                                >
                                                    Đóng
                                                </button>
                                            </div>
                                        </div>
                                    ) : null}
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

// ── Sub-components ──────────────────────────────────────

const NoteStatCard = ({ label, value, icon: Icon, color, bgColor }) => (
    <div className={`${bgColor} rounded-xl p-3 text-center transition-transform hover:scale-105`}>
        <Icon className={`w-5 h-5 ${color} mx-auto mb-1.5`} />
        <p className="text-2xl font-bold text-slate-800">{value ?? 0}</p>
        <p className="text-xs text-slate-500 mt-0.5">{label}</p>
    </div>
);

const AiStatCard = ({ label, value, gradient }) => (
    <div className={`bg-gradient-to-br ${gradient} rounded-xl p-3 text-center text-white transition-transform hover:scale-105 shadow-md`}>
        <p className="text-2xl font-bold">{value ?? 0}</p>
        <p className="text-xs text-white/80 mt-0.5">{label}</p>
    </div>
);

export default UserDetailModal;
