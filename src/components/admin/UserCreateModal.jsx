import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
    X,
    User as UserIcon,
    Mail,
    ImageIcon,
    Save,
    Loader2,
    AlertCircle,
    UserPlus,
    Lock,
    Eye,
    EyeOff
} from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { createUser } from '../../services/adminService';

/**
 * UserCreateModal - Modal cho Admin tạo người dùng mới
 */
const UserCreateModal = ({ isOpen, onClose }) => {
    const queryClient = useQueryClient();

    // Form state
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');

    // UI state
    const [showPassword, setShowPassword] = useState(false);

    // Validation errors
    const [errors, setErrors] = useState({});

    // Reset when modal closes
    useEffect(() => {
        if (!isOpen) {
            setFullName('');
            setEmail('');
            setPassword('');
            setAvatarUrl('');
            setErrors({});
            setShowPassword(false);
        }
    }, [isOpen]);

    // Mutation
    const createMutation = useMutation({
        mutationFn: (data) => createUser(data),
        onSuccess: (response) => {
            toast.success(response.message || 'Xử lý người dùng thành công.');
            // Invalidate queries to refresh data
            queryClient.invalidateQueries({ queryKey: ['users'] });
            onClose();
        },
        onError: (error) => {
            const data = error.response?.data;
            if (data && data.errors) {
                // Return .NET Validation Problem Details
                const validationErrors = {};
                for (const [field, messages] of Object.entries(data.errors)) {
                    validationErrors[field.toLowerCase()] = Array.isArray(messages) ? messages[0] : messages;
                }
                setErrors(validationErrors);
            } else if (data && data.message) {
                toast.error(data.message);
            } else {
                toast.error('Có lỗi xảy ra khi tạo người dùng.');
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

        if (!password) {
            newErrors.password = 'Mật khẩu không được để trống';
        } else if (password.length < 6) {
            newErrors.password = 'Mật khẩu phải từ 6 ký tự trở lên (Yêu cầu chữ hoa, chữ thường, số, ký tự đặc biệt)';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        createMutation.mutate({
            fullName: fullName.trim(),
            email: email.trim(),
            password: password,
            avatarUrl: avatarUrl.trim() || undefined
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
                                <div className="relative bg-gradient-to-r from-teal-600 via-emerald-600 to-green-600 px-6 py-5">
                                    <button
                                        onClick={onClose}
                                        className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                                    >
                                        <X className="w-4 h-4 text-white" />
                                    </button>

                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center ring-4 ring-white/30">
                                            <UserPlus className="w-7 h-7 text-white" />
                                        </div>
                                        <div>
                                            <Dialog.Title className="text-lg font-bold text-white">
                                                Tạo người dùng mới
                                            </Dialog.Title>
                                            <p className="text-teal-100 text-sm mt-0.5">
                                                Hoặc cấp quyền cho user hiện tại
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
                                                    : 'border-slate-200 hover:border-teal-300 focus:border-teal-500'
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
                                                placeholder="user@example.com"
                                                className={`w-full pl-11 pr-4 py-3 rounded-xl border-2 transition-colors text-slate-700 focus:outline-none ${errors.email
                                                    ? 'border-red-300 focus:border-red-500 bg-red-50/30'
                                                    : 'border-slate-200 hover:border-teal-300 focus:border-teal-500'
                                                    }`}
                                            />
                                        </div>
                                        {errors.email && (
                                            <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" />
                                                {errors.email}
                                            </p>
                                        )}
                                        <p className="mt-1.5 text-xs text-teal-600 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" />
                                            Sẽ lưu nếu email đã tồn tại (bỏ qua mật khẩu)
                                        </p>
                                    </div>

                                    {/* Password */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                            Mật khẩu <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                value={password}
                                                onChange={(e) => {
                                                    setPassword(e.target.value);
                                                    if (errors.password) setErrors(prev => ({ ...prev, password: undefined }));
                                                }}
                                                placeholder="Mật khẩu (có hoa, thường, số, ký tự đặc biệt)"
                                                className={`w-full pl-11 pr-11 py-3 rounded-xl border-2 transition-colors text-slate-700 focus:outline-none ${errors.password
                                                    ? 'border-red-300 focus:border-red-500 bg-red-50/30'
                                                    : 'border-slate-200 hover:border-teal-300 focus:border-teal-500'
                                                    }`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                                            >
                                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                        {errors.password && (
                                            <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" />
                                                {errors.password}
                                            </p>
                                        )}
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
                                                className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-slate-200 hover:border-teal-300 focus:border-teal-500 focus:outline-none transition-colors text-slate-700"
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
                                            disabled={createMutation.isPending}
                                            className="flex-1 px-4 py-3 rounded-xl font-medium text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 shadow-lg shadow-teal-500/30 hover:shadow-teal-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-95"
                                        >
                                            {createMutation.isPending ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    Đang tạo...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="w-4 h-4" />
                                                    Tạo người dùng
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

export default UserCreateModal;
