import { useEffect, useMemo, useState } from 'react';
import type { AddressData, OrderAddressDetails } from '../../../api/orderApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export type DeliverTypesType = {
    id: string;
    name: string;
    deliverTime: { min: number; max: number };
    price: number;
};

type User = { email: string };

type PaymentAddressFormPropsType = {
    onFormSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    setDeliverType: (val: string) => void;
    deliverTypes: DeliverTypesType[];
    pickedDelivery: string;
    details?: OrderAddressDetails;
    user: User | null;
};

export default function PaymentAddressForm({
    onFormSubmit,
    setDeliverType,
    deliverTypes,
    pickedDelivery,
    details,
    user,
}: PaymentAddressFormPropsType) {
    const [editAddress, setEditAddress] = useState(false);
    const [additionalPaymentInfo, setAdditionalPaymentInfo] = useState<
        AddressData | undefined
    >();

    const saveAddresData = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onFormSubmit(e);
    };

    const returnDeliverDates = (deliverTime: { min: number; max: number }) => {
        const today = new Date();

        const formatter = new Intl.DateTimeFormat('pl-PL', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
        });

        const addDays = (date: Date, days: number) => {
            const copy = new Date(date);
            copy.setDate(copy.getDate() + days);
            return copy;
        };

        const minDate = addDays(today, deliverTime.min);
        const maxDate = addDays(today, deliverTime.max);

        return `${formatter.format(minDate)} - ${formatter.format(maxDate)}`;
    };

    const address = useMemo(() => details?.address, [details?.address]);

    const paymentAddress = useMemo(
        () => details?.paymentAddress,
        [details?.paymentAddress],
    );

    useEffect(() => {
        if (editAddress) {
            setAdditionalPaymentInfo(undefined);
        }
    }, [editAddress, paymentAddress]);

    return (
        <div className="w-full">
            <div className="flex flex-col">
                <form onSubmit={saveAddresData} className="my-5">
                    <div className="text-2xl font-semibold mx-5 mb-5">
                        Przesyłka
                    </div>
                    <div className="flex flex-col gap-6">
                        <div className="grid gap-3 mx-5">
                            <Label htmlFor="email">Email*</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                                value={user?.email}
                            />
                        </div>
                        <div className="mx-5">Adress dostawy</div>
                        <div className="flex lg:flex-row flex-col gap-5 mx-5">
                            <div className="grid gap-3 w-full">
                                <Label htmlFor="name">Imię*</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    name="name"
                                    required
                                    value={address?.name}
                                />
                            </div>
                            <div className="grid gap-3 w-full">
                                <Label htmlFor="surname">Nazwisko*</Label>
                                <Input
                                    id="surname"
                                    type="text"
                                    name="surname"
                                    required
                                    value={address?.surname}
                                />
                            </div>
                        </div>
                        <div className="flex lg:flex-row flex-col mx-5 gap-5">
                            <div className="grid gap-3 w-full">
                                <Label htmlFor="street">Ulica*</Label>
                                <Input
                                    id="street"
                                    type="text"
                                    name="street"
                                    required
                                    value={address?.street}
                                />
                            </div>
                            <div className="flex flex-row justify-between gap-5 lg:gap-0">
                                <div className="grid gap-3 lg:w-1/4">
                                    <Label htmlFor="streetNumber">
                                        Numer domu*
                                    </Label>
                                    <Input
                                        id="streetNumber"
                                        type="text"
                                        name="streetNumber"
                                        required
                                        value={address?.streetNumber}
                                    />
                                </div>
                                <div className="grid gap-3 lg:w-1/4">
                                    <Label htmlFor="parcelNumber">
                                        Numer mieszkania
                                    </Label>
                                    <Input
                                        id="parcelNumber"
                                        type="text"
                                        name="parcelNumber"
                                        value={address?.parcelNumber}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="grid gap-3 mx-5">
                            <Label htmlFor="additionalAddresInfo">
                                Dodatkowe dane adresowe (opcjonalne)
                            </Label>
                            <Input
                                id="additionalAddresInfo"
                                type="text"
                                name="additionalAddresInfo"
                                value={address?.additionalAddresInfo}
                            />
                        </div>
                        <div className="grid gap-3 mx-5">
                            <Label htmlFor="country">Kraj*</Label>
                            <Input
                                id="country"
                                type="text"
                                required
                                name="country"
                                value={address?.country}
                            />
                        </div>
                        <div className="flex flex-row mx-5 gap-5">
                            <div className="grid gap-3 w-full">
                                <Label htmlFor="postalCode">
                                    Kod pocztowy*
                                </Label>
                                <Input
                                    id="postalCode"
                                    type="text"
                                    name="postalCode"
                                    required
                                    value={address?.postalCode}
                                />
                            </div>
                            <div className="grid gap-3 w-full">
                                <Label htmlFor="city">Miejscowość*</Label>
                                <Input
                                    id="city"
                                    type="text"
                                    required
                                    name="city"
                                    value={address?.city}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="relative border-y-2 my-5 py-5 px-5">
                        <div className="text-2xl font-semibold">
                            Adres rachunku
                        </div>
                        <div>
                            Adres do rachunku jest{' '}
                            {editAddress ? 'inny niż' : 'taki sam jak'} adres do
                            dostawy
                        </div>
                        <div
                            className="absolute top-0 right-0 m-5"
                            onClick={() => setEditAddress((prev) => !prev)}
                        >
                            Edytuj
                        </div>
                        {editAddress && (
                            <div className="flex flex-col gap-6 py-3">
                                <div className="flex lg:flex-row flex-col gap-5 mx-5">
                                    <div className="grid gap-3 w-full">
                                        <Label htmlFor="nameAdd">Imię*</Label>
                                        <Input
                                            id="nameAdd"
                                            type="text"
                                            name="nameAdd"
                                            required={editAddress}
                                            value={additionalPaymentInfo?.name}
                                        />
                                    </div>
                                    <div className="grid gap-3 w-full">
                                        <Label htmlFor="surnameAdd">
                                            Nazwisko*
                                        </Label>
                                        <Input
                                            id="surnameAdd"
                                            type="text"
                                            name="surnameAdd"
                                            required={editAddress}
                                            value={
                                                additionalPaymentInfo?.surname
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="flex lg:flex-row flex-col mx-5 gap-5">
                                    <div className="grid gap-3 w-full">
                                        <Label htmlFor="streetAdd">
                                            Ulica*
                                        </Label>
                                        <Input
                                            id="streetAdd"
                                            type="text"
                                            name="streetAdd"
                                            required={editAddress}
                                            value={
                                                additionalPaymentInfo?.street
                                            }
                                        />
                                    </div>
                                    <div className="flex flex-row justify-between gap-5 lg:gap-0">
                                        <div className="grid gap-3 lg:w-1/4">
                                            <Label htmlFor="streetNumberAdd">
                                                Numer domu*
                                            </Label>
                                            <Input
                                                id="streetNumberAdd"
                                                type="text"
                                                name="streetNumberAdd"
                                                required={editAddress}
                                                value={
                                                    additionalPaymentInfo?.streetNumber
                                                }
                                            />
                                        </div>
                                        <div className="grid gap-3 lg:w-1/4">
                                            <Label htmlFor="parcelNumberAdd">
                                                Numer mieszkania
                                            </Label>
                                            <Input
                                                id="parcelNumberAdd"
                                                type="text"
                                                name="parcelNumberAdd"
                                                value={
                                                    additionalPaymentInfo?.parcelNumber
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="grid gap-3 mx-5">
                                    <Label htmlFor="additionalAddresInfoAdd">
                                        Dodatkowe dane adresowe (opcjonalne)
                                    </Label>
                                    <Input
                                        id="additionalAddresInfoAdd"
                                        type="text"
                                        name="additionalAddresInfoAdd"
                                        value={
                                            additionalPaymentInfo?.additionalAddresInfo
                                        }
                                    />
                                </div>
                                <div className="grid gap-3 mx-5">
                                    <Label htmlFor="countryAdd">Kraj*</Label>
                                    <Input
                                        id="countryAdd"
                                        type="text"
                                        name="countryAdd"
                                        required={editAddress}
                                        value={additionalPaymentInfo?.country}
                                    />
                                </div>
                                <div className="flex flex-row mx-5 gap-5">
                                    <div className="grid gap-3 w-full">
                                        <Label htmlFor="postalCodeAdd">
                                            Kod pocztowy*
                                        </Label>
                                        <Input
                                            id="postalCodeAdd"
                                            type="text"
                                            name="postalCodeAdd"
                                            required={editAddress}
                                            value={
                                                additionalPaymentInfo?.postalCode
                                            }
                                        />
                                    </div>
                                    <div className="grid gap-3 w-full">
                                        <Label htmlFor="cityAdd">
                                            Miejscowość*
                                        </Label>
                                        <Input
                                            id="cityAdd"
                                            type="text"
                                            name="cityAdd"
                                            required={editAddress}
                                            value={additionalPaymentInfo?.city}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="relativemy-5 px-5 pb-5">
                        <div className="text-2xl font-semibold pb-4">
                            Rodzaj przesyłki
                        </div>
                        <div className="flex flex-col gap-3">
                            {deliverTypes &&
                                deliverTypes.map((type) => (
                                    <div
                                        className={`relative flex flex-col p-3 border-2 rounded shadow ${pickedDelivery === type.id ? 'border-green-600' : ''}`}
                                        onClick={() => setDeliverType(type.id)}
                                        key={type.id}
                                    >
                                        <div className="font-semibold">
                                            {type.name}
                                        </div>
                                        <div className="text-sm pl-1">
                                            {returnDeliverDates(
                                                type.deliverTime,
                                            )}
                                        </div>
                                        <div className="absolute top-0 right-0 font-bold text-lg pt-2 pr-2">
                                            {type.price
                                                .toFixed(2)
                                                .replace('.', ',')}{' '}
                                            zł
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                    <div className="grid gap-3 px-5">
                        <Label htmlFor="phone">Telefon*</Label>
                        <Input id="phone" type="phone" required />
                    </div>
                    <Button
                        type="submit"
                        className="mt-5 lg:w-1/4 w-[90vw] lg:ml-5 mx-[5vw] bg-green-400 hover:bg-green-600"
                    >
                        Zamawiam i płacę
                    </Button>
                </form>
            </div>
        </div>
    );
}
