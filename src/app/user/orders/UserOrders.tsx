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
import { TbTruckDelivery } from 'react-icons/tb';
import { GoPackageDependents } from 'react-icons/go';

export default function UserOrders() {
    const [userOrders, setUserOrders] = useState<OrderType[]>();
    const [error, setError] = useState<string>('');
    const [extended, setExtended] = useState<string>('');
    const { user } = useUser();

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

    const status = (data: OrderType) => {
        const preparingDelivery = <div>Przygotowanie do wysyłki</div>;
        const delivery = <div>W drodze </div>;

        const formatDate = (date: string) => {
            const newDate = new Date(date);
            const formattedDate = newDate.toLocaleString('pl-PL', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'Europe/Warsaw',
            });

            return formattedDate;
        };

        if (data.payment_date && !data.finalize_date) {
            return (
                <div className="flex flex-col px-5 py-3 mt-2 border rounded-lg w-fit">
                    <div className="flex flex-row gap-3 justify-start items-center text-lg font-semibold">
                        <GoPackageDependents />
                        {preparingDelivery}
                    </div>
                    <div>{formatDate(data.payment_date)}</div>
                </div>
            );
        }

        if (data.payment_date && data.finalize_date) {
            return (
                <div className="flex flex-col px-5 py-3 mt-2 border rounded-lg w-fit">
                    <div className="flex flex-col pb-4">
                        <div className="flex flex-row gap-3 justify-start items-center text-lg font-semibold">
                            <GoPackageDependents />
                            {preparingDelivery}
                        </div>
                        <div>{formatDate(data.payment_date)}</div>
                    </div>
                    <div className="flex flex-col">
                        <div className="flex flex-row gap-3 justify-start items-center text-lg font-semibold">
                            <TbTruckDelivery />
                            {delivery}
                        </div>
                        <div>{formatDate(data.finalize_date)}</div>
                    </div>
                </div>
            );
        }

        return null;
    };

    return (
        <div>
            <div
                id="header"
                className={`flex flex-row lg:justify-between items-center lg:h-35 fixed top-0 left-0 w-full z-60 shadow-xl bg-black h-[15vh]`}
            >
                <Link href="/" className="flex flex-col justify-start w-1/4">
                    <Image
                        src={'/logo.png'}
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
                {userOrders?.map((order) => {
                    const showStatus = extended == order.id;
                    return (
                        <div key={order.id} className="w-[50vw] py-5">
                            <div className="font-bold">
                                Zamowienie {order.id}
                            </div>
                            {showStatus ? (
                                status(order)
                            ) : (
                                <div onClick={() => setExtended(order.id)}>
                                    Rozwiń
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
