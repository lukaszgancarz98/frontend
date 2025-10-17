import { GetProp, UploadProps } from 'antd';
import type { OrderType } from '../api/orderApi';
import type { ProductType, ProductTypeType } from '../api/produktApi';
import type { DisplayProductType } from '../pages/components/Cart/Cart';
import { BACKEND_URL } from '@/common/constants';

type DisplayProductPropsType = {
    products: OrderType;
    allProducts: ProductType[];
    productTypes: ProductTypeType[];
};

export const displayProducts = ({
    products,
    productTypes,
    allProducts,
}: DisplayProductPropsType) => {
    const arrayOfProducts = products?.products.reduce<DisplayProductType[]>(
        (arr, item) => {
            const find = productTypes?.find((product) => product.id === item);
            const parentType = allProducts.find(
                (prod) => prod.id === find?.productId,
            );

            if (find && parentType) {
                if (parentType?.category === 'clothes') {
                    const repeatedItem = arr.findIndex(
                        (x) => find.color === x.color,
                    );
                    if (repeatedItem !== -1) {
                        const itemData = arr[repeatedItem];
                        const sizeExistIndex = itemData.sizes.findIndex(
                            (i) => i.name === find.size,
                        );
                        if (sizeExistIndex !== -1 && itemData.sizes) {
                            itemData.sizes[sizeExistIndex].amount += 1;
                        } else {
                            itemData.sizes.push({
                                name: find.size,
                                amount: 1,
                                price: find.price,
                                id: find.id,
                            });
                        }
                        itemData.amount += 1;

                        arr[repeatedItem] = itemData;
                    } else {
                        arr.push({
                            ...find,
                            amount: 1,
                            sizes: [
                                {
                                    name: find.size,
                                    amount: 1,
                                    price: find.price,
                                    id: find.id,
                                },
                            ],
                        });
                    }
                } else {
                    arr.push({ ...find, amount: 1, sizes: [] });
                }
            }

            return arr;
        },
        [],
    );

    return arrayOfProducts;
};

export type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

export const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

export const handleCreate = async (file: File & { uid?: string }) => {
    if (!file) return { isValid: true };

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${BACKEND_URL}/product/images`, {
        method: 'POST',
        body: formData,
    });

    const data = await res.json();

    if (data.error) {
        return { isValid: false };
    }

    return { isValid: true, data: { ...data, uid: file.uid } };
};

export const handleDelete = async (publicId: string) => {
    const res = await fetch(`${BACKEND_URL}/product/images`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicId }),
    });

    const data = await res.json();

    if (data.error) {
        return { isValid: false };
    }

    return { isValid: true, data: data };
};

export const generateThumb = (file: FileType) => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result);
        reader.readAsDataURL(file);
    });
};
