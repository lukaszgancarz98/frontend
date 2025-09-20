import { BACKEND_URL } from '../common/constants';
import type { ApiResponse } from './userApi';

export type ProductType = {
    page?: string;
    id: string;
    name: string;
    description: string;
    short_description: string;
    image: string;
    size_image: string;
    category: string;
    tag?: string;
    file_id?: string;
};

export type ProductTypeType = {
    id: string;
    price: number;
    size: string;
    color: string;
    shortDescription: string;
    images: string[];
    sizePlaceHolder: string;
    stock_quantity: string;
    productId: string;
    sale_price: string;
    sale_amount: string;
};

export type ProductWithProductTypes = {
    product: Partial<ProductType>;
    productTypes: Partial<ProductTypeType>[];
};

const url = `${BACKEND_URL}/product`;

export const getAllProducts = async (): Promise<ApiResponse<ProductType[]>> => {
    try {
        const res = await fetch(`${url}/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ page: 'kalistenika' }),
        });

        const responseData = await res.json();

        if (!res.ok) {
            return {
                data: null,
                isValid: false,
                error: responseData.message || 'Products get failed',
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

export const getAllProductTypes = async (): Promise<
    ApiResponse<ProductTypeType[]>
> => {
    try {
        const res = await fetch(`${url}/productTypes`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        const responseData = await res.json();

        if (!res.ok) {
            return {
                data: null,
                isValid: false,
                error: responseData.message || 'ProductTypes get failed',
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

export const getProduct = async (
    id: string,
): Promise<ApiResponse<ProductType>> => {
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
                error: responseData.message || 'ProductTypes get failed',
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

export const getProductTypesByProductId = async (
    id: string,
): Promise<ApiResponse<ProductTypeType[]>> => {
    try {
        const res = await fetch(`${url}/productType/product/${id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        const responseData = await res.json();

        if (!res.ok) {
            return {
                data: null,
                isValid: false,
                error: responseData.message || 'ProductTypes get failed',
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

export const updateProduct = async (
    data: ProductType,
): Promise<ApiResponse<ProductType>> => {
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
                error: responseData.message || 'Product update failed',
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

export const createProductAndProductTypes = async (
    data: ProductWithProductTypes,
): Promise<ApiResponse<ProductWithProductTypes>> => {
    try {
        const res = await fetch(`${url}/createVariants`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        const responseData = await res.json();

        if (!res.ok) {
            return {
                data: null,
                isValid: false,
                error:
                    responseData.message ||
                    'Product and ProducTypes create failed',
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
