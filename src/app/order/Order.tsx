import { OrderType } from '@/api/orderApi';
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
import { TbTruckDelivery } from 'react-icons/tb';
import { GoPackageDependents } from 'react-icons/go';
import { getDocument } from '@/api/documentApi';
import { ProductType, ProductTypeType } from '@/api/produktApi';
import { isEmpty } from 'lodash';

export type OrderPageProps = { error: string; children: React.ReactNode };

export function Order({ error, children }: OrderPageProps) {
    return (
        <div>
            <div
                id="header"
                className={`flex flex-row lg:justify-between items-center lg:h-35 fixed top-0 left-0 w-full z-60 shadow-xl bg-black h-[15vh]`}
            >
                <Link href="/" className="flex flex-col justify-start w-1/4">
                    <Image
                        src={'/logo.png'}
                        className="lg:h-24 h-15 w-40 bg-transparent lg:ml-10"
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
            {children}
        </div>
    );
}

export function status(data: OrderType) {
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
}

export const handleDownload = async (id: string, productId: string) => {
    try {
        const response = await getDocument({ orderId: id, productId });
        if (!response.isValid) {
            return;
        }

        const url = window.URL.createObjectURL(response.data?.blob as Blob);
        const a = document.createElement('a');
        a.href = url;

        a.download = `${response.data?.fileName}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    } catch (err) {
        console.log(err);
    }
};

export const displayProducts = (
    data: OrderType,
    productsTypes?: ProductTypeType[],
    products?: ProductType[],
) => {
    const productsIds: string[] = [];

    const productTypesData = productsTypes;
    productsTypes?.forEach((prod) => {
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
        <div className="mt-2 flex flex-col gap-2">
            {fileProducts?.map((item) => {
                const productType = productsTypes?.find(
                    (prod) => prod.productId === item.id,
                );

                if (!productType) {
                    return;
                }

                return (
                    <div
                        key={item.id}
                        className="border border-black rounded-lg my-2 bg-stone-200"
                    >
                        <div className="w-full text-center text-xl pt-1">
                            {item.name}
                        </div>
                        <div
                            className="underline text-blue-400 text-center py-1"
                            onClick={() =>
                                handleDownload(data.id, productType?.id)
                            }
                        >
                            Pobierz trening
                        </div>
                    </div>
                );
            })}
            <div className="mt-2 flex flex-col gap-2">
                {clothProducts?.map((item) => {
                    const productType = productTypesData?.find(
                        (type) => type.productId === item.id,
                    );

                    return (
                        <div
                            key={item.id}
                            className="border border-black rounded-lg p-2 bg-stone-200"
                        >
                            <div className="text-xl">{item.name}</div>
                            <div className="py-2">
                                Rozmiar: {productType?.size}
                            </div>
                            <div className="flex flex-row gap-5">
                                <div>Kolor: </div>
                                <div
                                    className={`h-6 w-6 bg-[${productType?.color.replaceAll(', ', '_')}] rounded-full`}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
            {!isEmpty(clothProducts) && status(data)}
        </div>
    );
};
