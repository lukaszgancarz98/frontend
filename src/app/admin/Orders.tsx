import { updateOrder } from '@/api/orderApi';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Order } from '@/hooks/useAdmin';
import { isEmpty } from 'lodash';
import { useState } from 'react';
import { toast } from 'sonner';

export type OrderProps = {
    ordersData: { paid: Order[]; finalized: Order[] };
    refreshOrder: () => Promise<void>;
};

export default function Orders({ ordersData, refreshOrder }: OrderProps) {
    const [openModal, setOpenModal] = useState<Order>();
    const formatter = new Intl.DateTimeFormat('pl-PL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });

    const updateOrderRequest = async (order: Order) => {
        const date = order.finalize_date ? null : new Date();
        const response = await updateOrder({
            id: order.id,
            finalize_date: date,
        });

        if (!response.isValid) {
            toast.error('Coś się nie udało');
        }

        if (response.isValid) {
            refreshOrder();
            toast.success('Status zamówienia zaaktualizowany');
        }
    };

    return (
        <div className="flex flex-row h-full items-start justify-evenly">
            <AlertDialog open={!isEmpty(openModal)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Aktualizacja statusu
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {openModal?.finalize_date
                                ? 'Pojebało Ci się wariacie?'
                                : 'Czy chcesz zaznaczyć zamówienie jako wysłane?'}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            onClick={() => setOpenModal(undefined)}
                        >
                            Nie
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                updateOrderRequest(openModal as Order);
                                setOpenModal(undefined);
                            }}
                        >
                            Tak
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <div className="w-[30%] border-2 h-[90%] flex flex-col items-center">
                <div className="text-2xl font-bold pb-5">
                    Zamówienia opłacone
                </div>
                {isEmpty(ordersData.paid) && (
                    <div className="py-10 text-2xl text-red-600">Pusto ;C</div>
                )}
                {ordersData.paid?.map((order, index) => {
                    const addressData = order.orderDetails?.address;

                    const homeNumber = addressData?.parcelNumber
                        ? `${addressData?.streetNumber}/${addressData?.parcelNumber}`
                        : '';
                    const address = `${addressData?.city} ${addressData?.postalCode}, ${addressData?.street} ${homeNumber}`;
                    return (
                        <div
                            key={order.id + index}
                            className="border-y-2 my-1 w-[90%]"
                            onClick={() => setOpenModal(order)}
                        >
                            <div className="text-lg font-semibold">
                                Zamówienie: {order.id}
                            </div>
                            <div>
                                Opłacono:{' '}
                                {formatter.format(
                                    new Date(order.payment_date as string),
                                )}
                            </div>
                            <div className="pb-3">
                                <div className="flex gap-2">
                                    Zamawiający:{' '}
                                    <div className="font-bold">
                                        {addressData?.name}{' '}
                                        {addressData?.surname}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    Adres dostawy:{' '}
                                    <div className="font-bold">{address}</div>
                                </div>
                            </div>
                            <div>
                                {order.items.map((product, index) => {
                                    return (
                                        <div
                                            className={`py-1 ${order.items.length - 1 !== index ? 'border-b-1' : ''}`}
                                            key={product.id}
                                        >
                                            <div>{product.name}</div>
                                            {product.size && (
                                                <div className="flex flex-row items-center gap-5">
                                                    <div>
                                                        Rozmiar {product.size}
                                                    </div>
                                                    <div
                                                        className="h-7 w-7 rounded-full border border-stone-200"
                                                        style={{
                                                            backgroundColor:
                                                                product.color?.replaceAll(
                                                                    ',',
                                                                    '',
                                                                ),
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="w-[30%] border-2 h-[90%] flex flex-col items-center">
                <div>Zamówienia zrealizowane</div>
                {isEmpty(ordersData.finalized) && (
                    <div className="py-10 text-2xl text-red-600">Pusto ;C</div>
                )}
                {ordersData.finalized?.map((order, index) => (
                    <div
                        key={order.id + index}
                        className="border-y-2 my-1 w-[90%] group"
                        onClick={() => setOpenModal(order)}
                    >
                        <div className="text-lg font-semibold">
                            Zamówienie: {order.id}
                        </div>
                        <div>
                            Wysłano:{' '}
                            {formatter.format(
                                new Date(order.finalize_date as string),
                            )}
                        </div>
                        <div className="h-0 opacity-0 group-hover:h-auto group-hover:opacity-100">
                            {order.items.map((product) => {
                                return (
                                    <div className="py-1" key={product.id}>
                                        <div>{product.name}</div>
                                        {product.size && (
                                            <div className="flex flex-row items-center gap-5">
                                                <div>
                                                    Rozmiar {product.size}
                                                </div>
                                                <div
                                                    className="h-7 w-7 rounded-full border border-stone-200"
                                                    style={{
                                                        backgroundColor:
                                                            product.color?.replaceAll(
                                                                ',',
                                                                '',
                                                            ),
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
