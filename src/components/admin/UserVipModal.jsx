import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition, Listbox } from '@headlessui/react';
import {
    Crown,
    X,
    ChevronDown,
    Check,
    Calendar,
    Sparkles,
    User as UserIcon,
    Loader2
} from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { getUserSubscription, updateUserSubscription } from '../../services/adminService';

// Plan types mapping
const PLAN_TYPES = [
    { id: 0, name: 'Free', label: 'Miễn phí', color: 'bg-slate-100 text-slate-700' },
    { id: 1, name: 'PremiumMonthly', label: 'Premium Tháng', color: 'bg-amber-100 text-amber-700' },
    { id: 2, name: 'PremiumYearly', label: 'Premium Năm', color: 'bg-purple-100 text-purple-700' },
];

const getPlanById = (id) => PLAN_TYPES.find(p => p.id === id) || PLAN_TYPES[0];
const getPlanByName = (name) => PLAN_TYPES.find(p => p.name === name) || PLAN_TYPES[0];

/**
 * UserVipModal - Modal quản lý VIP cho Admin
 * @param {Object} props
 * @param {boolean} props.isOpen - Modal có đang mở không
 * @param {function} props.onClose - Callback đóng modal
 * @param {Object} props.user - Thông tin user { id, fullName, email, planName }
 */
const UserVipModal = ({ isOpen, onClose, user }) => {
    const queryClient = useQueryClient();
    const [selectedPlan, setSelectedPlan] = useState(PLAN_TYPES[0]);
    const [endDate, setEndDate] = useState('');
    const [isAutoRenew, setIsAutoRenew] = useState(false);

    // Fetch current subscription
    const { data: subscription, isLoading: isLoadingSubscription } = useQuery({
        queryKey: ['subscription', user?.id],
        queryFn: () => getUserSubscription(user.id),
        enabled: isOpen && !!user?.id,
        staleTime: 0,
    });

    // Update subscription mutation
    const updateMutation = useMutation({
        mutationFn: (data) => updateUserSubscription(user.id, data),
        onSuccess: (response) => {
            toast.success(response.message || 'Cập nhật gói VIP thành công!');
            // Invalidate queries to refresh data
            queryClient.invalidateQueries({ queryKey: ['users'] });
            queryClient.invalidateQueries({ queryKey: ['subscription', user?.id] });
            onClose();
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
        }
    });

    // Populate form when subscription data loads
    useEffect(() => {
        if (subscription) {
            setSelectedPlan(getPlanByName(subscription.planType));
            setEndDate(subscription.endDate ? subscription.endDate.split('T')[0] : '');
            setIsAutoRenew(subscription.isAutoRenew || false);
        }
    }, [subscription]);

    // Reset form when modal opens with new user
    useEffect(() => {
        if (!isOpen) {
            setSelectedPlan(PLAN_TYPES[0]);
            setEndDate('');
            setIsAutoRenew(false);
        }
    }, [isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        updateMutation.mutate({
            planType: selectedPlan.id,
            endDate: endDate || null,
            isAutoRenew: isAutoRenew
        });
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Không có';
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

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
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
                                {/* Header with gradient */}
                                <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 px-6 py-5">
                                    <button
                                        onClick={onClose}
                                        className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                                    >
                                        <X className="w-4 h-4 text-white" />
                                    </button>

                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center ring-4 ring-white/30">
                                            <Crown className="w-7 h-7 text-white" />
                                        </div>
                                        <div>
                                            <Dialog.Title className="text-lg font-bold text-white">
                                                Quản lý VIP
                                            </Dialog.Title>
                                            <p className="text-purple-100 text-sm mt-0.5">
                                                {user?.fullName || 'Người dùng'}
                                            </p>
                                            <p className="text-purple-200/80 text-xs">
                                                {user?.email}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    {isLoadingSubscription ? (
                                        <div className="flex items-center justify-center py-12">
                                            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                                        </div>
                                    ) : (
                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            {/* Current Plan Info */}
                                            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-4 border border-slate-200">
                                                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                                                    Gói hiện tại
                                                </h4>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        {subscription?.isActive ? (
                                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                                                                <Crown className="w-5 h-5 text-white" />
                                                            </div>
                                                        ) : (
                                                            <div className="w-10 h-10 rounded-lg bg-slate-200 flex items-center justify-center">
                                                                <UserIcon className="w-5 h-5 text-slate-500" />
                                                            </div>
                                                        )}
                                                        <div>
                                                            <p className="font-semibold text-slate-800">
                                                                {getPlanByName(subscription?.planType).label}
                                                            </p>
                                                            <p className="text-xs text-slate-500">
                                                                {subscription?.isActive ? (
                                                                    <span className="text-emerald-600">● Đang hoạt động</span>
                                                                ) : (
                                                                    <span className="text-slate-400">○ Không hoạt động</span>
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-xs text-slate-500">Hết hạn</p>
                                                        <p className="text-sm font-medium text-slate-700">
                                                            {formatDate(subscription?.endDate)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Plan Selection */}
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                                    Chọn gói mới
                                                </label>
                                                <Listbox value={selectedPlan} onChange={setSelectedPlan}>
                                                    <div className="relative">
                                                        <Listbox.Button className="relative w-full cursor-pointer rounded-xl bg-white py-3 pl-4 pr-10 text-left border-2 border-slate-200 hover:border-indigo-300 focus:border-indigo-500 focus:outline-none transition-colors">
                                                            <span className="flex items-center gap-3">
                                                                <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${selectedPlan.color}`}>
                                                                    {selectedPlan.id === 0 ? 'FREE' : 'VIP'}
                                                                </span>
                                                                <span className="block truncate font-medium text-slate-800">
                                                                    {selectedPlan.label}
                                                                </span>
                                                            </span>
                                                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                                                <ChevronDown className="h-5 w-5 text-slate-400" />
                                                            </span>
                                                        </Listbox.Button>
                                                        <Transition
                                                            as={Fragment}
                                                            leave="transition ease-in duration-100"
                                                            leaveFrom="opacity-100"
                                                            leaveTo="opacity-0"
                                                        >
                                                            <Listbox.Options className="absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-xl bg-white py-2 shadow-xl ring-1 ring-black/5 focus:outline-none">
                                                                {PLAN_TYPES.map((plan) => (
                                                                    <Listbox.Option
                                                                        key={plan.id}
                                                                        className={({ active }) =>
                                                                            `relative cursor-pointer select-none py-3 pl-4 pr-10 ${active ? 'bg-indigo-50' : ''
                                                                            }`
                                                                        }
                                                                        value={plan}
                                                                    >
                                                                        {({ selected }) => (
                                                                            <>
                                                                                <span className="flex items-center gap-3">
                                                                                    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${plan.color}`}>
                                                                                        {plan.id === 0 ? 'FREE' : 'VIP'}
                                                                                    </span>
                                                                                    <span className={`block truncate ${selected ? 'font-semibold text-indigo-600' : 'font-medium text-slate-700'}`}>
                                                                                        {plan.label}
                                                                                    </span>
                                                                                </span>
                                                                                {selected && (
                                                                                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600">
                                                                                        <Check className="h-5 w-5" />
                                                                                    </span>
                                                                                )}
                                                                            </>
                                                                        )}
                                                                    </Listbox.Option>
                                                                ))}
                                                            </Listbox.Options>
                                                        </Transition>
                                                    </div>
                                                </Listbox>
                                            </div>

                                            {/* End Date Picker - Only show for Premium plans */}
                                            {selectedPlan.id !== 0 && (
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                                        Ngày hết hạn
                                                        <span className="text-slate-400 font-normal ml-1">(để trống để server tự tính)</span>
                                                    </label>
                                                    <div className="relative">
                                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                                        <input
                                                            type="date"
                                                            value={endDate}
                                                            onChange={(e) => setEndDate(e.target.value)}
                                                            min={new Date().toISOString().split('T')[0]}
                                                            className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-slate-200 hover:border-indigo-300 focus:border-indigo-500 focus:outline-none transition-colors text-slate-700"
                                                        />
                                                    </div>
                                                    <p className="mt-1.5 text-xs text-slate-500">
                                                        {selectedPlan.id === 1
                                                            ? '💡 Mặc định: +1 tháng từ ngày hiện tại'
                                                            : '💡 Mặc định: +1 năm từ ngày hiện tại'}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Auto Renew Toggle */}
                                            {selectedPlan.id !== 0 && (
                                                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
                                                    <div className="flex items-center gap-3">
                                                        <Sparkles className="w-5 h-5 text-indigo-500" />
                                                        <div>
                                                            <p className="font-medium text-slate-700">Tự động gia hạn</p>
                                                            <p className="text-xs text-slate-500">Gia hạn khi hết hạn</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => setIsAutoRenew(!isAutoRenew)}
                                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isAutoRenew ? 'bg-indigo-600' : 'bg-slate-300'
                                                            }`}
                                                    >
                                                        <span
                                                            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${isAutoRenew ? 'translate-x-6' : 'translate-x-1'
                                                                }`}
                                                        />
                                                    </button>
                                                </div>
                                            )}

                                            {/* Action Buttons */}
                                            <div className="flex gap-3 pt-2">
                                                <button
                                                    type="button"
                                                    onClick={onClose}
                                                    className="flex-1 px-4 py-3 rounded-xl font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                                                >
                                                    Hủy
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={updateMutation.isPending}
                                                    className="flex-1 px-4 py-3 rounded-xl font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                                >
                                                    {updateMutation.isPending ? (
                                                        <>
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                            Đang xử lý...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Crown className="w-4 h-4" />
                                                            Xác nhận
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </form>
                                    )}
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default UserVipModal;
