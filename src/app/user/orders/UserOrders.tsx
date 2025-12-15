'use client';

import { getAllOrdersById, OrderType } from '@/api/orderApi';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useUser } from '@/context/userContext';
import { AlertDialogContent } from '@radix-ui/react-alert-dialog';
import Image from 'next/image';
import Link from 'next/link';
import { redirect, RedirectType } from 'next/navigation';
import { useEffect, useState } from 'react';
import { displayProducts } from '@/app/order/Order';
import {
    getAllProducts,
    getAllProductTypes,
    ProductType,
    ProductTypeType,
} from '@/api/produktApi';
import { LOGO } from '@/common/constants';

export default function UserOrders() {
    const [userOrders, setUserOrders] = useState<OrderType[]>();
    const [error, setError] = useState<string>('');
    const { user } = useUser();
    const [products, setProducts] = useState<ProductType[]>();
    const [productsTypes, setProductsTypes] = useState<ProductTypeType[]>();

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

    const getOrdersData = async (id: string) => {
        const response = await getAllOrdersById({ id });

        if (!response.isValid) {
            setError('Unable to get user orders');
        }

        const filteredOrders = response?.data?.filter(
            (item) => item.payment_date,
        );
        const sortedByPaymentDate = filteredOrders?.sort((a, b) => {
            const dateA = a.payment_date
                ? new Date(a.payment_date).getTime()
                : 0;
            const dateB = b.payment_date
                ? new Date(b.payment_date).getTime()
                : 0;

            return dateB - dateA;
        });

        setUserOrders(sortedByPaymentDate);
    };

    useEffect(() => {
        if (user?.id && !userOrders) {
            getOrdersData(user.id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id]);

    return (
        <div>
            <div
                id="header"
                className={`flex flex-row lg:justify-between items-center lg:h-35 fixed top-0 left-0 w-full z-60 shadow-xl bg-black h-[15vh]`}
            >
                <Link href="/" className="flex flex-col justify-start w-1/4">
                    <Image
                        src={LOGO}
                        className="lg:h-24 h-18 w-40 bg-transparent lg:ml-10"
                        alt="/placeholder.png"
                        width={1000}
                        height={1000}
                    />
                </Link>
                <div className="flex flex-col lg:w-2/4 w-3/4 justify-around items-center h-full">
                    <Image
                        src={'/text.png'}
                        className="object-contain lg:w-full h-1/2"
                        alt="/placeholder.png"
                        width={1000}
                        height={200}
                    />
                </div>
                <div className="lg:w-1/4" />
            </div>
            <AlertDialog open={error.length > 0 ? true : false}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle hidden>
                            Wróć do strony głównej
                        </AlertDialogTitle>
                        <AlertDialogDescription>{error}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction
                            onClick={() => redirect('/', RedirectType.push)}
                        >
                            Continue
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <div className="pt-35 w-screen h-screen flex flex-col items-center">
                <div className="pt-10 text-3xl font-semibold">Zamówienia:</div>
                {userOrders?.map((order) => (
                    <div
                        key={order.id}
                        className="lg:w-[50vw] py-5 flex flex-col items-center"
                    >
                        <div className="font-bold text-center">
                            Zamowienie: {order.id}
                        </div>
                        {displayProducts(order, productsTypes, products)}
                    </div>
                ))}
            </div>
        </div>
    );
}
