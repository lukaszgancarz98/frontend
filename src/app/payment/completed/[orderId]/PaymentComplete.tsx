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
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';

type PaymentCompletedProps = { id: string };

export default function PaymentCompleted({ id }: PaymentCompletedProps) {
    const [done, setDone] = useState<boolean>(false);
    const { user } = useUser();
    const [documents, setDocuments] = useState<Attachment[]>();
    const [type, setType] = useState<string>();

    const checkPaymentRequest = async (order: string) => {
        const getData = await getOrder({ id: order });

        if (!getData.isValid) {
            toast.error('Coś poszło nie tak. Odśwież stronę');

            return;
        }

        const check = await checkOrderProducts(order);

        if (!check.isValid) {
            toast.error('Coś poszło nie tak. Odśwież stronę');

            return;
        }

        const fileOrder = check.data?.includes('video');

        const clothesOrder = check.data?.includes('clothes');

        if (fileOrder && clothesOrder) {
            setType(undefined);
        } else if (fileOrder) {
            setType('file');
        } else if (clothesOrder) {
            setType('cloth');
        }

        if (getData.data?.payment_date) {
            if (!getData.data?.email_send) {
                const docs = await getDocumentsForEmail({
                    orderId: getData?.data?.id as string,
                    products: getData?.data?.products as string[],
                });

                if (!docs.isValid) {
                    toast.error('Coś poszło nie tak. Odśwież stronę');

                    return;
                }

                if (isEmpty(docs.data)) {
                    sendEmail({
                        order: getData.data as OrderType,
                        fileOrder,
                        clothesOrder,
                    });

                    return;
                }

                setDocuments(docs.data as Attachment[]);

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

                setDocuments(docs.data as Attachment[]);

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

    const includesFileOrMixed = type !== 'cloth';
    const includesMixed = type === 'mixed';

    const displayContent = user?.email ? (
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
    );

    const downloadAll = () => {
        documents?.forEach((doc) => {
            const url = URL.createObjectURL(doc.file);
            const link = document.createElement('a');
            link.href = url;
            link.download = doc.name;
            link.click();
            URL.revokeObjectURL(url);
        });
    };

    return (
        <div className="w-screen h-screen flex justify-center items-center">
            <Toaster position="top-center" richColors />
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
                    {includesMixed && displayContent}
                    {includesFileOrMixed && (
                        <div>
                            Pobierz plany treningowe klikając{' '}
                            <Button onClick={() => downloadAll()}>tutaj</Button>
                            , w zakładce{' '}
                            <Link
                                href={`/order/${id}`}
                                className="underline text-blue-600 hover:text-blue-900"
                            >
                                tutaj
                            </Link>{' '}
                            lub z maila.
                        </div>
                    )}
                    <div>
                        ✉️ Jeśli nie otrzymasz potwierdzenia w ciągu kilku
                        minut, sprawdź folder Spam lub skontaktuj się z nami.
                    </div>
                    {!user?.email && (
                        <div>
                            Prosimy zapisać numer zamówienia w przypadku braku
                            otrzymania potwierdzenia drogą mailową.
                        </div>
                    )}
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
