import api from './api';

/**
 * Admin Service - API cho Admin Portal
 */

/**
 * Lấy thống kê tổng quan Dashboard
 * @returns {Promise<{totalRevenue: number, totalUsers: number, activePremiumUsers: number, totalAiRequests: number}>}
 */
export const getStats = async () => {
    const response = await api.get('/admin/stats');
    return response.data;
};

/**
 * Lấy danh sách người dùng với phân trang và tìm kiếm
 * @param {Object} params 
 * @param {string} [params.search] - Tìm kiếm theo Email hoặc Họ tên
 * @param {number} [params.page=1] - Trang hiện tại
 * @param {number} [params.pageSize=10] - Số người dùng mỗi trang
 * @returns {Promise<{items: Array, totalCount: number, pageIndex: number, pageSize: number, totalPages: number}>}
 */
export const getUsers = async ({ search = '', page = 1, pageSize = 10 } = {}) => {
    const response = await api.get('/admin/users', {
        params: { search, page, pageSize }
    });
    return response.data;
};

/**
 * Khóa/Mở khóa tài khoản người dùng
 * @param {string} userId - ID của người dùng
 * @param {boolean} lock - true = khóa, false = mở khóa
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const toggleUserLock = async (userId, lock) => {
    const response = await api.post(`/admin/users/${userId}/lock`, { lock });
    return response.data;
};

/**
 * Lấy thông tin subscription/VIP của user
 * @param {string} userId - ID của người dùng
 * @returns {Promise<{planType: string, isActive: boolean, endDate: string, isAutoRenew: boolean}>}
 */
export const getUserSubscription = async (userId) => {
    const response = await api.get(`/admin/users/${userId}/subscription`);
    return response.data;
};

/**
 * Cập nhật/Kích hoạt VIP cho user
 * @param {string} userId - ID của người dùng
 * @param {Object} data - Thông tin subscription
 * @param {number} data.planType - 0: Free, 1: PremiumMonthly, 2: PremiumYearly
 * @param {string} [data.endDate] - Ngày hết hạn (optional, server tự tính nếu null)
 * @param {boolean} [data.isAutoRenew] - Tự động gia hạn
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const updateUserSubscription = async (userId, data) => {
    const response = await api.put(`/admin/users/${userId}/subscription`, data);
    return response.data;
};

export default {
    getStats,
    getUsers,
    toggleUserLock,
    getUserSubscription,
    updateUserSubscription
};
