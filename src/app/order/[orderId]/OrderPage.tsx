'use client';

import { getOrder, OrderType } from '@/api/orderApi';
import { useEffect, useState } from 'react';
import { displayProducts, Order } from '../Order';
import {
    getAllProducts,
    getAllProductTypes,
    ProductType,
    ProductTypeType,
} from '@/api/produktApi';

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

    return (
        <Order error={error}>
            {order && (
                <div
                    key={order.id}
                    className="w-full flex flex-col lg:pt-35 pt-20 items-center gap-5"
                >
                    <div className="font-bold pt-10 text-center">
                        Zamowienie: {order.id}
                    </div>
                    {displayProducts(order, productsTypes, products)}
                </div>
            )}
        </Order>
    );
}
