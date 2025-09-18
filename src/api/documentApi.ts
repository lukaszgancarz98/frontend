import { BACKEND_URL } from '../common/constants';
import { ApiResponse } from './userApi';

export type DocumentData = { orderId: string; productId: string };

export type DocumentsData = { orderId: string; products: string[] };

export type DocumentItem = {
    productId: string;
    name: string;
    data: string | null; // base64-encoded string
};

export type Attachment = { name: string; file: Blob };

export const getDocument = async (
    data: DocumentData,
): Promise<ApiResponse<{ blob: Blob; fileName: string }>> => {
    try {
        const res = await fetch(
            `${BACKEND_URL}/product/document/${data.orderId}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId: data.productId }),
            },
        );

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Download failed');
        }

        const docData = await res.json();
        const doc = docData.data;

        if (!doc || !doc.data) {
            return { data: null, isValid: false, error: 'No document found' };
        }

        const byteCharacters = atob(doc.data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], {
            type: doc.mimeType || 'application/octet-stream',
        });

        return { data: { blob: blob, fileName: doc.name }, isValid: true };
    } catch {
        return {
            data: null,
            isValid: false,
            error: err.message || 'Network error or server unreachable',
        };
    }
};

export const getDocumentsForEmail = async (
    data: DocumentsData,
): Promise<ApiResponse<Attachment[]>> => {
    try {
        const res = await fetch(
            `${BACKEND_URL}/product/documents/${data.orderId}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ products: data.products }),
            },
        );

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Download failed');
        }

        const docData = await res.json();

        const attachments = docData.data.documents.map(
            (file: { data: string; mimeType: string; name: string }) => {
                const byteCharacters = atob(file.data);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: file.mimeType });
                return { name: file.name, file: blob };
            },
        );

        return { data: attachments, isValid: true };
    } catch {
        return {
            data: null,
            isValid: false,
            error: 'Network error or server unreachable',
        };
    }
};
