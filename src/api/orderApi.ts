import { DeliverTypesType } from '@/app/payment/[orderId]/PaymentAddressForm';
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
    phone: string;
};

export type OrderAddressDetails = {
    address: AddressData;
    paymentAddress: AddressData;
    deliver: DeliverTypesType;
};

export type OrderDataType = {
    price: number;
    products: string[];
    email: string;
    status: string;
    finalize_date?: string;
    payment_date?: string;
    id?: string;
};

export type OrderType = {
    id: string;
    price: number;
    products: string[];
    email: string;
    status: string;
    createDate: string;
    finalize_date?: string;
    payment_date?: string;
    orderDetails?: OrderAddressDetails;
};

type GetOrderByEmailData = { email: string };

type GetOrderData = { id: string };

type UpdateOrderData = {
    id: string;
    price?: number;
    products?: string[];
    email?: string;
    payment_date?: Date;
    payment_id?: string;
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

export const getAllOrdersById = async ({
    id,
}: {
    id: string;
}): Promise<ApiResponse<OrderType[]>> => {
    try {
        const res = await fetch(`${url}/all/${id}`, {
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

        let details = {};

        if (responseData.data.orderDetails) {
            details = JSON.parse(responseData.data.orderDetails);
        }

        return {
            data: { ...responseData.data, orderDetails: details },
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

        let details = {};

        if (responseData.data.orderDetails) {
            details = JSON.parse(responseData.data.orderDetails);
        }

        return {
            data: { ...responseData.data, orderDetails: details },
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

        let details = {};

        if (responseData.data.orderDetails) {
            details = JSON.parse(responseData.data.orderDetails);
        }

        return {
            data: { ...responseData.data, orderDetails: details },
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

        let details = {};

        if (responseData.data.orderDetails) {
            details = JSON.parse(responseData.data.orderDetails);
        }

        return {
            data: { ...responseData.data, orderDetails: details },
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

export const updateProductOrder = async (
    id: string,
    amount: string,
): Promise<ApiResponse<OrderType>> => {
    try {
        const res = await fetch(`${url}/product/${id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: amount }),
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

        return { data: responseData.data, isValid: true };
    } catch {
        return {
            data: null,
            isValid: false,
            error: 'Network error or server unreachable',
        };
    }
};
