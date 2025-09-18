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
