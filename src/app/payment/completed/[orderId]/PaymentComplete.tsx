'use client';

import { getOrder, OrderType, updateOrder } from '@/api/orderApi';
import { checkPayment } from '@/api/paymentApi';
import { redirect, RedirectType } from 'next/navigation';
import { useEffect, useState } from 'react';
import sendEmail from './SendConfirmationEmail';
import { useUser } from '@/context/userContext';
import Link from 'next/link';

type PaymentCompletedProps = { id: string };

export default function PaymentCompleted({ id }: PaymentCompletedProps) {
    const [done, setDone] = useState<boolean>(false);
    const { user } = useUser();

    const checkPaymentRequest = async (order: string) => {
        const getData = await getOrder({ id: order });

        if (!getData.isValid) {
            return;
        }

        if (getData.data?.payment_date) {
            if (getData.data?.email_send) {
                sendEmail({ order: getData.data as OrderType });
            }

            setDone(true);

            return;
        }

        const response = await checkPayment(order);

        if (!response.isValid) {
            return;
        }

        if (
            response.data?.orders?.[0].status === 'COMPLETED' &&
            response.data.properties[0].value
        ) {
            const date = new Date();
            const paymentId = response.data.properties[0].value;
            const responseUpdate = await updateOrder({
                id: id,
                payment_date: date,
                payment_id: paymentId,
            });

            if (responseUpdate.isValid) {
                setDone(true);
                sendEmail({ order: responseUpdate?.data as OrderType });
            }
        }
    };

    const redirectToMyShop = () => {
        redirect(`/user/orders`, RedirectType.push);
    };

    useEffect(() => {
        if (id) {
            checkPaymentRequest(id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    return (
        <div className="w-screen h-screen flex justify-center items-center">
            {done ? (
                <div className="w-3/6 text-center flex flex-col gap-3 text-xl">
                    <div className="text-2xl font-bold">
                        Numer zamówienia: {id}
                    </div>
                    <div className="font-medium text-2xl pb-3">
                        Twoja płatność została pomyślnie zaksięgowana.
                    </div>
                    <div>
                        Wkrótce otrzymasz wiadomość e-mail z potwierdzeniem
                        zamówienia oraz wszystkimi szczegółami transakcji.
                    </div>
                    {user?.email ? (
                        <div className="flex flex-row gap-1">
                            📦 Status zamówienia możesz śledzić w zakładce{' '}
                            <div
                                onClick={() => redirectToMyShop()}
                                className="underline text-blue-600 hover:text-blue-900"
                            >
                                Moje zamówienia
                            </div>{' '}
                            po zalogowaniu się na swoje konto.
                        </div>
                    ) : (
                        <div>
                            Zapisz numer zamówienia i śledź zamówienie{' '}
                            <Link
                                href={`/order/${id}`}
                                className="underline text-blue-600 hover:text-blue-900"
                            >
                                tutaj
                            </Link>
                            .
                        </div>
                    )}
                    <div>
                        ✉️ Jeśli nie otrzymasz potwierdzenia w ciągu kilku
                        minut, sprawdź folder &quotSpam&quot lub skontaktuj się
                        z nami.
                    </div>
                    <div className="font-medium">
                        Dziękujemy za zaufanie i życzymy udanych zakupów!
                    </div>
                </div>
            ) : (
                <div>...weryfikacjka</div>
            )}
        </div>
    );
}
