'use client';

import {
    checkOrderProducts,
    getOrder,
    OrderType,
    updateOrder,
} from '@/api/orderApi';
import { checkPayment } from '@/api/paymentApi';
import { redirect, RedirectType } from 'next/navigation';
import { useEffect, useState } from 'react';
import sendEmail from './SendConfirmationEmail';
import { useUser } from '@/context/userContext';
import Link from 'next/link';
import { isEmpty } from 'lodash';
import { Attachment, getDocumentsForEmail } from '@/api/documentApi';

type PaymentCompletedProps = { id: string };

export default function PaymentCompleted({ id }: PaymentCompletedProps) {
    const [done, setDone] = useState<boolean>(false);
    const { user } = useUser();

    const checkPaymentRequest = async (order: string) => {
        const getData = await getOrder({ id: order });

        if (!getData.isValid) {
            return;
        }

        const check = await checkOrderProducts(order);

        if (!check.isValid) {
            return;
        }

        const fileOrder = check.data?.includes('video');

        const clothesOrder = check.data?.includes('clothes');

        if (getData.data?.payment_date) {
            if (!getData.data?.email_send) {
                const docs = await getDocumentsForEmail({
                    orderId: getData?.data?.id as string,
                    products: getData?.data?.products as string[],
                });
                if (isEmpty(docs.data)) {
                    sendEmail({
                        order: getData.data as OrderType,
                        fileOrder,
                        clothesOrder,
                    });

                    return;
                }

                sendEmail({
                    order: getData.data as OrderType,
                    files: docs.data as Attachment[],
                    fileOrder,
                    clothesOrder,
                });
            }

            setDone(true);

            return;
        }

        const response = await checkPayment(order);

        if (!response.isValid) {
            return;
        }

        const finalizeDate =
            fileOrder && !clothesOrder ? new Date() : undefined;

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
                finalize_date: finalizeDate,
            });

            const docs = await getDocumentsForEmail({
                orderId: getData?.data?.id as string,
                products: getData?.data?.products as string[],
            });

            if (responseUpdate.isValid) {
                setDone(true);

                if (isEmpty(docs.data)) {
                    sendEmail({
                        order: responseUpdate?.data as OrderType,
                        fileOrder,
                        clothesOrder,
                    });

                    return;
                }

                sendEmail({
                    order: responseUpdate?.data as OrderType,
                    files: docs.data as Attachment[],
                    fileOrder,
                    clothesOrder,
                });
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
                <div className="lg:w-3/6 text-center flex flex-col gap-3 text-xl px-3 lg:px-0">
                    <div className="text-2xl font-bold flex flex-col lg:flex-row gap-0 lg:gap-2 items-center justify-center">
                        <div>Numer zamówienia: </div>
                        <div>{id}</div>
                    </div>
                    <div className="font-medium text-2xl pb-3">
                        Twoja płatność została pomyślnie zaksięgowana.
                    </div>
                    <div>
                        Wkrótce otrzymasz wiadomość e-mail z potwierdzeniem
                        zamówienia oraz wszystkimi szczegółami transakcji.
                    </div>
                    {user?.email ? (
                        <div className="flex lg:flex-row flex-col gap-1">
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
                        minut, sprawdź folder Spam lub skontaktuj się z nami.
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
