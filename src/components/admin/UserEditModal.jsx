import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
    X,
    User as UserIcon,
    Mail,
    ImageIcon,
    Save,
    Loader2,
    AlertCircle
} from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { updateUserProfile } from '../../services/adminService';

/**
 * UserEditModal - Modal cho Admin sửa thông tin người dùng
 * Fields: fullName, email, avatarUrl
 */
const UserEditModal = ({ isOpen, onClose, user }) => {
    const queryClient = useQueryClient();

    // Form state
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');

    // Validation errors
    const [errors, setErrors] = useState({});

    // Populate form when user data changes
    useEffect(() => {
        if (user && isOpen) {
            setFullName(user.fullName || '');
            setEmail(user.email || '');
            setAvatarUrl(user.avatarUrl || '');
            setErrors({});
        }
    }, [user, isOpen]);

    // Reset when modal closes
    useEffect(() => {
        if (!isOpen) {
            setErrors({});
        }
    }, [isOpen]);

    // Mutation
    const updateMutation = useMutation({
        mutationFn: (data) => updateUserProfile(user.userId || user.id, data),
        onSuccess: (response) => {
            toast.success(response.message || 'Đã cập nhật thông tin người dùng thành công.');
            // Invalidate queries to refresh data
            queryClient.invalidateQueries({ queryKey: ['users'] });
            queryClient.invalidateQueries({ queryKey: ['userDetail', user.userId || user.id] });
            onClose();
        },
        onError: (error) => {
            const data = error.response?.data;
            if (data) {
                // Handle validation errors (object with field arrays)
                if (typeof data === 'object' && !data.message) {
                    const validationErrors = {};
                    for (const [field, messages] of Object.entries(data)) {
                        validationErrors[field.toLowerCase()] = Array.isArray(messages) ? messages[0] : messages;
                    }
                    setErrors(validationErrors);
                    return;
                }
                // Handle message-based errors
                toast.error(data.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
            } else {
                toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
            }
        }
    });

    // Client-side validation
    const validate = () => {
        const newErrors = {};

        if (!fullName.trim()) {
            newErrors.fullname = 'Tên không được để trống';
        } else if (fullName.length > 100) {
            newErrors.fullname = 'Tên không được quá 100 ký tự';
        }

        if (!email.trim()) {
            newErrors.email = 'Email không được để trống';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        updateMutation.mutate({
            fullName: fullName.trim(),
            email: email.trim(),
            avatarUrl: avatarUrl.trim() || null
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
                            enterFrom="opacity-0 scale-95 translate-y-4"
                            enterTo="opacity-100 scale-100 translate-y-0"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100 translate-y-0"
                            leaveTo="opacity-0 scale-95 translate-y-4"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
                                {/* Header */}
                                <div className="relative bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 px-6 py-5">
                                    <button
                                        onClick={onClose}
                                        className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                                    >
                                        <X className="w-4 h-4 text-white" />
                                    </button>

                                    <div className="flex items-center gap-4">
                                        {/* Avatar preview */}
                                        <div className="relative">
                                            {avatarUrl ? (
                                                <img
                                                    src={avatarUrl}
                                                    alt="Avatar"
                                                    className="w-14 h-14 rounded-full object-cover ring-4 ring-white/30 shadow-lg"
                                                    onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                                                />
                                            ) : null}
                                            <div
                                                className={`w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm items-center justify-center ring-4 ring-white/30 ${avatarUrl ? 'hidden' : 'flex'}`}
                                            >
                                                <UserIcon className="w-7 h-7 text-white" />
                                            </div>
                                        </div>
                                        <div>
                                            <Dialog.Title className="text-lg font-bold text-white">
                                                Chỉnh sửa thông tin
                                            </Dialog.Title>
                                            <p className="text-blue-100 text-sm mt-0.5">
                                                {user?.fullName || user?.email || 'Người dùng'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Form */}
                                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                                    {/* FullName */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                            Họ và tên <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <input
                                                type="text"
                                                value={fullName}
                                                onChange={(e) => {
                                                    setFullName(e.target.value);
                                                    if (errors.fullname) setErrors(prev => ({ ...prev, fullname: undefined }));
                                                }}
                                                placeholder="Nhập họ và tên"
                                                maxLength={100}
                                                className={`w-full pl-11 pr-4 py-3 rounded-xl border-2 transition-colors text-slate-700 focus:outline-none ${errors.fullname
                                                        ? 'border-red-300 focus:border-red-500 bg-red-50/30'
                                                        : 'border-slate-200 hover:border-indigo-300 focus:border-indigo-500'
                                                    }`}
                                            />
                                        </div>
                                        {errors.fullname && (
                                            <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" />
                                                {errors.fullname}
                                            </p>
                                        )}
                                        <p className="mt-1 text-xs text-slate-400 text-right">{fullName.length}/100</p>
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                            Email <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => {
                                                    setEmail(e.target.value);
                                                    if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
                                                }}
                                                placeholder="Nhập email"
                                                className={`w-full pl-11 pr-4 py-3 rounded-xl border-2 transition-colors text-slate-700 focus:outline-none ${errors.email
                                                        ? 'border-red-300 focus:border-red-500 bg-red-50/30'
                                                        : 'border-slate-200 hover:border-indigo-300 focus:border-indigo-500'
                                                    }`}
                                            />
                                        </div>
                                        {errors.email && (
                                            <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" />
                                                {errors.email}
                                            </p>
                                        )}
                                        <p className="mt-1.5 text-xs text-amber-600 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" />
                                            Admin có quyền đổi email cho người dùng
                                        </p>
                                    </div>

                                    {/* Avatar URL */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                            Avatar URL <span className="text-slate-400 font-normal">(tuỳ chọn)</span>
                                        </label>
                                        <div className="relative">
                                            <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <input
                                                type="url"
                                                value={avatarUrl}
                                                onChange={(e) => setAvatarUrl(e.target.value)}
                                                placeholder="https://example.com/avatar.jpg"
                                                className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-slate-200 hover:border-indigo-300 focus:border-indigo-500 focus:outline-none transition-colors text-slate-700"
                                            />
                                        </div>
                                        {avatarUrl && (
                                            <div className="mt-2 flex items-center gap-2">
                                                <img
                                                    src={avatarUrl}
                                                    alt="Preview"
                                                    className="w-8 h-8 rounded-full object-cover border-2 border-slate-200"
                                                    onError={(e) => { e.target.style.display = 'none'; }}
                                                />
                                                <span className="text-xs text-slate-500">Xem trước avatar</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-3 pt-3">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="flex-1 px-4 py-3 rounded-xl font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors active:scale-95"
                                        >
                                            Hủy
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={updateMutation.isPending}
                                            className="flex-1 px-4 py-3 rounded-xl font-medium text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-95"
                                        >
                                            {updateMutation.isPending ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    Đang lưu...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="w-4 h-4" />
                                                    Lưu thay đổi
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default UserEditModal;
