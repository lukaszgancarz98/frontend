import { BACKEND_URL } from '../common/constants';

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

export type ReciverData = { email: string; id: string };

export type ReciverResponseData = {
    email: string;
    workshop_id: string;
    id: string;
};

export const createWorkShopReceiver = async (
    data: ReciverData,
): Promise<ApiResponse<ReciverResponseData>> => {
    try {
        const res = await fetch(`${BACKEND_URL}/workshop/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        const responseData = await res.json();

        if (!res.ok) {
            return {
                data: null,
                isValid: false,
                error: responseData.message || 'Create failed',
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

export const getAllWorkShopReceivers = async (): Promise<
    ApiResponse<ReciverResponseData[]>
> => {
    try {
        const res = await fetch(`${BACKEND_URL}/login/admin`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        const responseData = await res.json();

        if (!res.ok) {
            return {
                data: null,
                isValid: false,
                error: responseData.message || 'Get failed',
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
