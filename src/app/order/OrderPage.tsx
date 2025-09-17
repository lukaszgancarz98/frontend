'use client';

import { getOrder, OrderType } from '@/api/orderApi';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AlertDialogContent } from '@radix-ui/react-alert-dialog';
import Image from 'next/image';
import Link from 'next/link';
import { redirect, RedirectType } from 'next/navigation';
import { useState } from 'react';
import { TbTruckDelivery } from 'react-icons/tb';
import { GoPackageDependents } from 'react-icons/go';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function OrderPage() {
    const [order, setOrder] = useState<OrderType>();
    const [error, setError] = useState<string>('');

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
                <form
                    onSubmit={(e) => searchOrder(e)}
                    className="flex flex-row w-full items-center justify-center gap-10 py-10"
                >
                    <div className="text-3xl font-semibold">
                        Wprowadź numer zamówiena:
                    </div>
                    <Input name="id" className="w-1/4" />
                    <Button type="submit">Szukaj</Button>
                </form>
                {order && (
                    <div
                        key={order.id}
                        className="w-[50vw] py-5 flex flex-col items-center"
                    >
                        <div className="font-bold pb-5">
                            Zamowienie {order.id}
                        </div>
                        {status(order)}
                    </div>
                )}
            </div>
        </div>
    );
}
