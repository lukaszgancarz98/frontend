import { BACKEND_URL, PAGE } from '../common/constants';

export type UserType = {
    id: string;
    email: string;
    name: string;
    surname: string;
};

export type ApiResponse<T> = {
    data: T | null;
    isValid: boolean;
    error?: string;
    status?: number;
};

export type UserLoginData = { email: string; password: string };

export type UserRegisterData = {
    email: string;
    password: string;
    name: string;
    surname: string;
};

export type GoogleAuthData = { email: string; name: string; surname: string };

// Login user
export const loginUser = async (
    data: UserLoginData,
): Promise<ApiResponse<UserType>> => {
    try {
        const res = await fetch(`${BACKEND_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...data, type: PAGE }),
        });

        const responseData = await res.json();

        if (!res.ok) {
            return {
                data: null,
                isValid: false,
                error: responseData.message || 'Login failed',
                status: res.status,
            };
        }

        return { data: responseData.data, isValid: true };
    } catch {
        return {
            data: null,
            isValid: false,
            error: 'Network error or server unreachable',
        };
    }
};

export const loginAdminUser = async (
    data: UserLoginData,
): Promise<ApiResponse<UserType>> => {
    try {
        const res = await fetch(`${BACKEND_URL}/login/admin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        const responseData = await res.json();

        if (!res.ok) {
            return {
                data: null,
                isValid: false,
                error: responseData.message || 'Login failed',
                status: res.status,
            };
        }

        return { data: responseData.data, isValid: true };
    } catch {
        return {
            data: null,
            isValid: false,
            error: 'Network error or server unreachable',
        };
    }
};

export const loginUserGoogle = async (
    data: GoogleAuthData,
): Promise<ApiResponse<UserType>> => {
    try {
        const res = await fetch(`${BACKEND_URL}/auth/google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...data, type: PAGE }),
        });

        const responseData = await res.json();

        if (!res.ok) {
            return {
                data: null,
                isValid: false,
                error: responseData.message || 'Login failed',
                status: res.status,
            };
        }

        return { data: responseData.data, isValid: true };
    } catch {
        return {
            data: null,
            isValid: false,
            error: 'Network error or server unreachable',
        };
    }
};

// Register new user
export const registerUser = async (
    data: UserRegisterData,
): Promise<ApiResponse<UserType>> => {
    try {
        const res = await fetch(`${BACKEND_URL}/user`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...data, type: PAGE }),
        });

        const responseData = await res.json();

        if (!res.ok) {
            return {
                data: null,
                isValid: false,
                error: responseData.message || 'Registration failed',
                status: res.status,
            };
        }

        return { data: responseData.data, isValid: true };
    } catch {
        return {
            data: null,
            isValid: false,
            error: 'Network error or server unreachable',
        };
    }
};

// Get all users (admin)
export const getAllUsers = async (): Promise<ApiResponse<UserType[]>> => {
    try {
        const res = await fetch(`${BACKEND_URL}/user`);
        const responseData = await res.json();

        if (!res.ok) {
            return {
                data: null,
                isValid: false,
                error: responseData.message || 'Failed to fetch users',
                status: res.status,
            };
        }

        return { data: responseData.data, isValid: true };
    } catch {
        return {
            data: null,
            isValid: false,
            error: 'Network error or server unreachable',
        };
    }
};

// Get user by ID
export const getUserById = async (
    id: number,
): Promise<ApiResponse<UserType>> => {
    try {
        const res = await fetch(`${BACKEND_URL}/user/${id}`);
        const responseData = await res.json();

        if (!res.ok) {
            return {
                data: null,
                isValid: false,
                error: responseData.message || 'User not found',
                status: res.status,
            };
        }

        return { data: responseData.data, isValid: true };
    } catch {
        return {
            data: null,
            isValid: false,
            error: 'Network error or server unreachable',
        };
    }
};

// Update user by ID
export const updateUserById = async (
    id: number,
    updateData: { name?: string; email?: string; surname?: string },
): Promise<ApiResponse<UserType>> => {
    try {
        const res = await fetch(`${BACKEND_URL}/user/${id}`, {
            method: 'POST', // your backend uses POST for updates
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateData),
        });

        const responseData = await res.json();

        if (!res.ok) {
            return {
                data: null,
                isValid: false,
                error: responseData.message || 'Failed to update user',
                status: res.status,
            };
        }

        return { data: responseData.data, isValid: true };
    } catch {
        return {
            data: null,
            isValid: false,
            error: 'Network error or server unreachable',
        };
    }
};
