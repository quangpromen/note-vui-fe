import { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    LogOut,
    Menu,
    X,
    ChevronRight,
    Sparkles,
    CreditCard
} from 'lucide-react';
import { message } from 'antd';
import { logout } from '../services/authService';

const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/users', icon: Users, label: 'Quản lý người dùng' },
    { path: '/subscription-requests', icon: CreditCard, label: 'Yêu cầu nâng cấp VIP' },
];

const AdminLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        message.success('Đã đăng xuất thành công');
        navigate('/login');
    };

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/30">
            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed top-0 left-0 z-50 h-full
                bg-white/80 backdrop-blur-xl border-r border-slate-200/60
                shadow-xl shadow-slate-200/50
                transition-all duration-300 ease-out
                ${sidebarOpen ? 'w-64' : 'w-20'}
                ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                {/* Logo Section */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200/60">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-teal-500/30">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        {sidebarOpen && (
                            <span className="font-bold text-lg bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                                NoteVui
                            </span>
                        )}
                    </div>
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="hidden lg:flex p-2 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                        <ChevronRight className={`w-4 h-4 text-slate-500 transition-transform ${sidebarOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <button
                        onClick={() => setMobileMenuOpen(false)}
                        className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="p-3 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`
                                    flex items-center gap-3 px-3 py-2.5 rounded-xl
                                    transition-all duration-200 group
                                    ${isActive
                                        ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg shadow-teal-500/30'
                                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                    }
                                `}
                            >
                                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? '' : 'group-hover:scale-110'} transition-transform`} />
                                {sidebarOpen && <span className="font-medium">{item.label}</span>}
                            </NavLink>
                        );
                    })}
                </nav>

                {/* User Section & Logout */}
                <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-slate-200/60 bg-white/50">
                    {sidebarOpen && user.fullName && (
                        <div className="mb-3 px-3 py-2 rounded-xl bg-slate-50/80">
                            <p className="text-sm font-medium text-slate-700 truncate">{user.fullName}</p>
                            <p className="text-xs text-slate-500 truncate">{user.email}</p>
                        </div>
                    )}
                    <button
                        onClick={handleLogout}
                        className={`
                            w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                            text-red-500 hover:bg-red-50 hover:text-red-600
                            transition-all duration-200 group
                        `}
                    >
                        <LogOut className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                        {sidebarOpen && <span className="font-medium">Đăng xuất</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`
                transition-all duration-300
                ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}
            `}>
                {/* Top Header */}
                <header className="h-16 bg-white/60 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-30">
                    <div className="h-full flex items-center justify-between px-4 lg:px-8">
                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                            <Menu className="w-5 h-5 text-slate-600" />
                        </button>

                        <div className="flex items-center gap-4">
                            <div className="hidden sm:block text-right">
                                <p className="text-sm font-medium text-slate-700">{user.fullName || 'Admin'}</p>
                                <p className="text-xs text-slate-500">{user.roles || 'Administrator'}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white font-bold shadow-lg shadow-teal-500/30">
                                {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'A'}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="p-4 lg:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
