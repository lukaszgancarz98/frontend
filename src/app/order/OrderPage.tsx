'use client';

import { getOrder, OrderType } from '@/api/orderApi';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { displayProducts, Order } from './Order';
import {
    getAllProducts,
    getAllProductTypes,
    ProductType,
    ProductTypeType,
} from '@/api/produktApi';

export default function OrderPage() {
    const [order, setOrder] = useState<OrderType>();
    const [error, setError] = useState<string>('');
    const [products, setProducts] = useState<ProductType[]>();
    const [productsTypes, setProductsTypes] = useState<ProductTypeType[]>();

    const searchOrder = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const id = formData.get('id') as string;
        const response = await getOrder({ id });

        if (!response.isValid) {
            setError('Unable to get user orders');
        }

        if (response.data) {
            setOrder(response.data);
        }
    };

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
            <div className="pt-35 w-screen h-screen flex flex-col items-center">
                <form
                    onSubmit={(e) => searchOrder(e)}
                    className="flex lg:flex-row flex-col w-full items-center justify-center lg:gap-10 gap-3 lg:py-10 px-3 lg:px-0"
                >
                    <div className="text-3xl font-semibold text-center">
                        Wprowadź numer zamówiena:
                    </div>
                    <Input name="id" className="lg:w-1/4" />
                    <Button type="submit">Szukaj</Button>
                </form>
                {order && (
                    <div
                        key={order.id}
                        className="lg:w-[50vw] px-5 lg:px-0 py-5 flex flex-col items-center"
                    >
                        <div className="font-bold pb-5">
                            Zamowienie: {order.id}
                        </div>
                        {displayProducts(order, productsTypes, products)}
                    </div>
                )}
            </div>
        </Order>
    );
}
