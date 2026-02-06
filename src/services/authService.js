import api from './api';
import { jwtDecode } from "jwt-decode";

export const login = async (email, password) => {
    try {
        const response = await api.post('/auth/login', { email, password });
        if (response.data && response.data.accessToken) {
            const decodedToken = jwtDecode(response.data.accessToken);
            const user = {
                ...response.data,
                roles: decodedToken.role || decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
            };
            return user;
        }
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
};
