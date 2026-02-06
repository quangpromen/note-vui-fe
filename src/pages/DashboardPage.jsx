import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Spin, message } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { logout } from '../services/authService';
import api from '../services/api';

const DashboardPage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);

        // Example: Fetch some protected data if needed
        // api.get('/some-protected-endpoint').catch(err => console.error(err));

    }, []);

    const handleLogout = () => {
        logout();
        message.success('Đã đăng xuất');
        navigate('/login');
    };

    if (loading) {
        return <div className="flex h-screen items-center justify-center"><Spin size="large" /></div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                    <Button
                        type="primary"
                        danger
                        icon={<LogoutOutlined />}
                        onClick={handleLogout}
                    >
                        Đăng xuất
                    </Button>
                </div>

                <Card title="Thông tin cá nhân" className="shadow-md">
                    {user ? (
                        <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl font-bold text-blue-600">
                                    {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold">{user.fullName || 'Người dùng'}</h2>
                                    <p className="text-gray-500">{user.email}</p>
                                    <p className="text-xs text-gray-400 mt-1">ID: {user.userId}</p>
                                </div>
                            </div>

                            {user.roles && (
                                <div className="mt-4 pt-4 border-t">
                                    <span className="font-medium text-gray-700">Vai trò: </span>
                                    <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full ml-2">
                                        {user.roles}
                                    </span>
                                </div>
                            )}
                        </div>
                    ) : (
                        <p>Không tìm thấy thông tin người dùng.</p>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default DashboardPage;
