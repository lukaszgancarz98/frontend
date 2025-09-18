'use client';

import { getOrder, OrderType } from '@/api/orderApi';
import { useEffect, useState } from 'react';
import { handleDownload, Order, status } from '../Order';
import {
    getAllProducts,
    getAllProductTypes,
    ProductType,
    ProductTypeType,
} from '@/api/produktApi';
import { isEmpty } from 'lodash';

export default function OrderPage({ orderId }: { orderId: string }) {
    const [order, setOrder] = useState<OrderType>();
    const [error, setError] = useState<string>('');
    const [products, setProducts] = useState<ProductType[]>();
    const [productsTypes, setProductsTypes] = useState<ProductTypeType[]>();

    const searchOrderRedirect = async (id: string) => {
        const response = await getOrder({ id });

        if (!response.isValid) {
            setError('Unable to get user orders');
        }

        if (response.data) {
            setOrder(response.data);
        }
    };

    useEffect(() => {
        if (orderId) {
            searchOrderRedirect(orderId);
        }
    }, [orderId]);

    const getProductRequest = async () => {
        const response = await getAllProducts();
        const responseTypes = await getAllProductTypes();

        if (response.isValid && responseTypes.isValid) {
            setProducts(response?.data as ProductType[]);
            setProductsTypes(responseTypes?.data as ProductTypeType[]);
        }
    };

    useEffect(() => {
        getProductRequest();
    }, []);

    const displayProducts = (data: OrderType) => {
        const productsIds: string[] = [];
        productsTypes?.filter((prod) => {
            const include = data.products.includes(prod.id);
            if (include) {
                productsIds.push(prod.productId);
            }

            return include;
        });
        const orderProducts = products?.filter((prod) =>
            productsIds?.includes(prod.id),
        );
        const fileProducts = orderProducts?.filter((item) =>
            item.category.includes('video'),
        );

        const clothProducts = orderProducts?.filter((item) =>
            item.category.includes('clothes'),
        );

        return (
            <div>
                {fileProducts?.map((item) => {
                    const productType = productsTypes?.find(
                        (prod) => prod.productId === item.id,
                    );

                    if (!productType) {
                        return;
                    }

                    return (
                        <div key={item.id}>
                            <div>{item.name}</div>
                            <div
                                className="underline text-blue-400"
                                onClick={() =>
                                    handleDownload(data.id, productType?.id)
                                }
                            >
                                Pobierz trening
                            </div>
                        </div>
                    );
                })}
                <div>
                    {clothProducts?.map((item) => (
                        <div key={item.id}>
                            <div>{item.name}</div>
                        </div>
                    ))}
                </div>
                {!isEmpty(clothProducts) && status(data)}
            </div>
        );
    };

    return (
        <Order error={error}>
            {order && (
                <div
                    key={order.id}
                    className="w-full flex flex-col pt-35 items-center gap-5"
                >
                    <div className="font-bold pt-10">
                        Zamowienie: {order.id}
                    </div>
                    {displayProducts(order)}
                </div>
            )}
        </Order>
    );
}
