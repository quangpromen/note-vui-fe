import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import HeroIllustration from '../components/ui/HeroIllustration';
import {
    EyeInvisibleOutlined,
    EyeOutlined,
    LoadingOutlined
} from '@ant-design/icons';
import { message } from 'antd';
import logo from '../assets/logo.jpg';
import { login } from '../services/authService';

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const email = e.target.email.value;
        const password = e.target.password.value;

        try {
            const data = await login(email, password);

            // Verify Admin Role
            const role = data.roles;
            // Handle both single role (string) and multiple roles (array)
            const isAdmin = Array.isArray(role)
                ? role.includes('Admin')
                : role === 'Admin';

            if (!isAdmin) {
                message.error('Truy cập bị từ chối: Tài khoản này không có quyền Quản trị viên.');
                setIsLoading(false);
                return;
            }

            // Store auth data
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            localStorage.setItem('user', JSON.stringify({
                userId: data.userId,
                email: data.email,
                fullName: data.fullName,
                avatarUrl: data.avatarUrl,
                roles: data.roles
            }));

            message.success('Đang chuyển hướng...');
            // Navigate to dashboard or home
            navigate('/');
        } catch (error) {
            console.error('Login error:', error);
            if (error.response && error.response.data) {
                // Try to show specific message from backend if available, otherwise generic
                message.error(error.response.data.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
            } else {
                message.error('Không thể kết nối đến máy chủ.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full bg-background overflow-hidden font-sans">
            {/* Left Panel - Illustration (Hidden on mobile) */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-secondary justify-center items-center overflow-hidden">
                <HeroIllustration />
                {/* Logo top-left */}
                <div className="absolute top-8 left-8 flex items-center gap-3 z-20">
                    <div className="bg-white p-1.5 rounded-xl shadow-sm">
                        <img src={logo} alt="NoteVui Logo" className="w-8 h-8 object-contain" />
                    </div>
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#84cc16] to-[#06b6d4]">
                        NoteVui Admin
                    </span>
                </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="flex flex-1 flex-col justify-center items-center p-8 lg:p-12 animate-fade-in bg-white/50 backdrop-blur-sm">
                <div className="w-full max-w-[400px] space-y-8">

                    {/* Mobile Logo (Visible only on mobile) */}
                    <div className="lg:hidden flex flex-col items-center gap-2 mb-8 justify-center">
                        <div className="bg-white p-3 rounded-2xl shadow-md">
                            <img src={logo} alt="NoteVui Logo" className="w-12 h-12 object-contain" />
                        </div>
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#84cc16] to-[#06b6d4]">NoteVui Admin</span>
                    </div>

                    <div className="space-y-2 text-center lg:text-left">
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            Chào mừng trở lại
                        </h1>
                        <p className="text-muted-foreground">
                            Đăng nhập để truy cập hệ thống quản trị
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="email">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all disabled:cursor-not-allowed disabled:opacity-50"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium leading-none" htmlFor="password">
                                        Mật khẩu
                                    </label>
                                    <Link
                                        to="/forgot-password"
                                        className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                                    >
                                        Quên mật khẩu?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all disabled:cursor-not-allowed disabled:opacity-50 pr-10"
                                        placeholder="Nhập mật khẩu của bạn"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 w-full shadow-md hover:shadow-lg hover:-translate-y-0.5"
                        >
                            {isLoading && <LoadingOutlined className="mr-2 animate-spin" />}
                            {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                        </button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-border" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">
                                    Hoặc đăng nhập bằng
                                </span>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-full"
                        >
                            <div className="mr-2 h-4 w-4">
                                <GoogleIcon />
                            </div>
                            Google
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

function GoogleIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-full w-full">
            <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
            />
            <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
            />
            <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26-1.19-.58z"
                fill="#FBBC05"
            />
            <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
            />
        </svg>
    );
}
