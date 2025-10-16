import { BACKEND_URL, PAGE } from '../common/constants';
import type { ApiResponse } from './userApi';

export type ProductType = {
    page?: string;
    id: string;
    name: string;
    description: string;
    short_description: string;
    image?: { id?: string; url?: string; file?: File; del?: boolean };
    size_image?: { id?: string; url?: string; file?: File; del?: boolean };
    category: string;
    tag?: string;
    file_id?: string;
};

export type ProductTypeRaw = {
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

export type ProductTypeTypeRaw = {
    id: string;
    price: number;
    size: string;
    color: string;
    shortDescription: string;
    images: string[];
    size_placeholder: string;
    stock_quantity: string;
    productId: string;
    sale_price: string;
    sale_amount: string;
    del?: boolean;
};

export type ProductTypeType = {
    id: string;
    price: number;
    size: string;
    color: string;
    shortDescription: string;
    images: { id?: string; url?: string; file?: File; del?: boolean }[];
    size_placeholder: string;
    stock_quantity: string;
    productId: string;
    sale_price: string;
    sale_amount: string;
};

export type ProductWithProductTypes = {
    product: Partial<ProductTypeRaw>;
    productTypes: Partial<ProductTypeTypeRaw>[];
};

const url = `${BACKEND_URL}/product`;

export const getAllProducts = async (): Promise<ApiResponse<ProductType[]>> => {
    try {
        const res = await fetch(`${url}/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ page: PAGE }),
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

        const newData = responseData.data.reduce(
            (arr: ProductType[], item: ProductTypeRaw) => {
                const image = item.image?.split(':url:');
                const imageData = { id: image[0], url: image[1] || item.image };
                const sizeImage = item.size_image?.split(':url:');
                const sizeImageData = {
                    id: sizeImage?.[0],
                    url: sizeImage?.[1] || item.size_image,
                };

                arr.push({
                    ...item,
                    image: imageData,
                    size_image: sizeImageData.id ? sizeImageData : undefined,
                });

                return arr;
            },
            [],
        );

        return { data: newData, isValid: true };
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

        const newData = responseData.data.reduce(
            (arr: ProductTypeType[], item: ProductTypeTypeRaw) => {
                const array: { id: string; url: string }[] = [];

                item.images?.forEach((image) => {
                    const splitImageData = image?.split(':url:');

                    const imageData = {
                        id: splitImageData?.[0],
                        url: splitImageData?.[1] || image,
                    };

                    array.push(imageData);
                });

                arr.push({ ...item, images: array });

                return arr;
            },
            [],
        );

        return { data: newData, isValid: true };
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

        const image = responseData?.data?.image?.split(':url:');
        const imageData = {
            id: image[0],
            url: image[1] || responseData?.data?.image,
        };
        const sizeImage = responseData?.data?.size_image?.split(':url:');
        const sizeImageData = {
            id: sizeImage?.[0],
            url: sizeImage?.[1] || responseData?.data?.size_image,
        };

        const data = {
            ...responseData.data,
            image: imageData,
            size_image: sizeImageData,
        };

        return { data: data, isValid: true };
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

        const newData = responseData.data.reduce(
            (arr: ProductTypeType[], item: ProductTypeTypeRaw) => {
                const array: { id: string; url: string }[] = [];

                item.images?.forEach((image) => {
                    const splitImageData = image?.split(':url:');

                    const imageData = {
                        id: splitImageData?.[0],
                        url: splitImageData?.[1] || image,
                    };

                    array.push(imageData);
                });

                arr.push({ ...item, images: array });

                return arr;
            },
            [],
        );

        return { data: newData, isValid: true };
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

export const updateProductTypes = async (data: {
    productTypes: ProductTypeTypeRaw[];
}): Promise<ApiResponse<ProductTypeType[]>> => {
    try {
        const res = await fetch(`${url}/productTypes`, {
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

export const createProductType = async (
    data: ProductTypeType,
): Promise<ApiResponse<string>> => {
    try {
        const res = await fetch(`${url}/productType`, {
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

        return { data: 'ok', isValid: true };
    } catch {
        return {
            data: null,
            isValid: false,
            error: 'Network error or server unreachable',
        };
    }
};

export const deleteProductAndProductTypes = async (
    id: string,
): Promise<ApiResponse<ProductWithProductTypes>> => {
    try {
        const res = await fetch(`${url}/all/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
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

export const deleteProductType = async (
    id: string,
): Promise<ApiResponse<string>> => {
    try {
        const res = await fetch(`${url}/productType/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
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

        return { data: 'ok', isValid: true };
    } catch {
        return {
            data: null,
            isValid: false,
            error: 'Network error or server unreachable',
        };
    }
};
