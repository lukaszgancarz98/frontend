import { BACKEND_URL } from '../common/constants';
import type { ApiResponse } from './userApi';

export type AddressData = {
    name: string;
    surname: string;
    email?: string;
    street: string;
    streetNumber: string;
    parcelNumber?: string;
    additionalAddresInfo?: string;
    postalCode: string;
    city: string;
    country: string;
};

export type OrderAddressDetails = {
    address: AddressData;
    paymentAddress: AddressData;
    deliver?: { id: string };
};

export type OrderDataType = {
    price: number;
    products: string[];
    email: string;
    status: string;
};

export type OrderType = {
    id: string;
    price: number;
    products: string[];
    email: string;
    status: string;
    createDate: string;
    finalizeDate?: string;
    paymentDate?: string;
    orderDetails?: OrderAddressDetails;
};

type GetOrderByEmailData = { email: string };

type GetOrderData = { id: string };

type UpdateOrderData = {
    id: string;
    price: number;
    products: string[];
    email?: string;
};

type UpdateOrderDetailsData = { id: string; orderDetails: OrderAddressDetails };

const url = `${BACKEND_URL}/order`;

export const createOrder = async (
    data: OrderDataType,
): Promise<ApiResponse<OrderType>> => {
    try {
        const res = await fetch(`${url}/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        const responseData = await res.json();

        if (!res.ok) {
            return {
                data: null,
                isValid: false,
                error: responseData.message || 'Order creation failed',
                status: res.status,
            };
        }

        return {
            data: {
                ...responseData.data,
                price: Number(responseData.data.price),
            },
            isValid: true,
        };
    } catch {
        return {
            data: null,
            isValid: false,
            error: 'Network error or server unreachable',
        };
    }
};

export const getAllOrders = async (): Promise<ApiResponse<OrderType[]>> => {
    try {
        const res = await fetch(`${url}/all`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        const responseData = await res.json();

        if (!res.ok) {
            return {
                data: null,
                isValid: false,
                error: responseData.message || 'Order get failed',
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

export const getOrderByEmail = async ({
    email,
}: GetOrderByEmailData): Promise<ApiResponse<OrderType>> => {
    try {
        const res = await fetch(`${url}/email/${email}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        const responseData = await res.json();

        if (!res.ok) {
            return {
                data: null,
                isValid: false,
                error: responseData.message || 'Order get failed',
                status: res.status,
            };
        }

        return {
            data: {
                ...responseData.data,
                orderDetails: JSON.parse(responseData.data.orderDetails),
            },
            isValid: true,
        };
    } catch {
        return {
            data: null,
            isValid: false,
            error: 'Network error or server unreachable',
        };
    }
};

export const getOrder = async ({
    id,
}: GetOrderData): Promise<ApiResponse<OrderType>> => {
    try {
        const res = await fetch(`${url}/${id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        const responseData = await res.json();

        if (!res.ok) {
            return {
                data: null,
                isValid: false,
                error: responseData.message || 'Order get failed',
                status: res.status,
            };
        }

        return {
            data: {
                ...responseData.data,
                orderDetails: JSON.parse(responseData.data.orderDetails),
            },
            isValid: true,
        };
    } catch {
        return {
            data: null,
            isValid: false,
            error: 'Network error or server unreachable',
        };
    }
};

export const updateOrderDetails = async (
    data: UpdateOrderDetailsData,
): Promise<ApiResponse<OrderType>> => {
    try {
        const res = await fetch(`${url}/${data.id}/addressDetails`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data.orderDetails),
        });

        const responseData = await res.json();

        if (!res.ok) {
            return {
                data: null,
                isValid: false,
                error: responseData.message || 'Order update failed',
                status: res.status,
            };
        }

        return {
            data: {
                ...responseData.data,
                orderDetails: JSON.parse(responseData.data.orderDetails),
            },
            isValid: true,
        };
    } catch {
        return {
            data: null,
            isValid: false,
            error: 'Network error or server unreachable',
        };
    }
};

export const updateOrder = async (
    data: UpdateOrderData,
): Promise<ApiResponse<OrderType>> => {
    try {
        const res = await fetch(`${url}/${data.id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        const responseData = await res.json();

        if (!res.ok) {
            return {
                data: null,
                isValid: false,
                error: responseData.message || 'Order update failed',
                status: res.status,
            };
        }

        return {
            data: {
                ...responseData.data,
                orderDetails: JSON.parse(responseData.data.orderDetails),
            },
            isValid: true,
        };
    } catch {
        return {
            data: null,
            isValid: false,
            error: 'Network error or server unreachable',
        };
    }
};

export const deleteOrder = async (
    id: string,
): Promise<ApiResponse<OrderType>> => {
    try {
        const res = await fetch(`${url}/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        });

        const responseData = await res.json();

        if (!res.ok) {
            return {
                data: null,
                isValid: false,
                error: responseData.message || 'Order get failed',
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
