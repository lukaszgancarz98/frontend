'use client';

import { useEffect, useState } from 'react';
import { useCalistenics } from '../../../hooks/useCalistenics';
import PaymentCart from './PaymentCart';
import type { DisplayProductType } from '../../../pages/components/Cart/Cart';
import { displayProducts } from '../../../service/service';
import {
    getOrder,
    updateOrderDetails,
    type AddressData,
    type OrderType,
} from '../../../api/orderApi';
import PaymentAddressForm, {
    type DeliverTypesType,
} from './PaymentAddressForm';
import { DELIVER_TYPES } from '../../../common/constants';
import PaymentOptions from './PaymentOptions';
import Link from 'next/link';
import { useUser } from '@/context/userContext';
import Image from 'next/image';

export default function Payment({ orderId }: { orderId: string }) {
    const { allProducts, productTypes, productListCart, cartFunctions } =
        useCalistenics();
    const [order, setOrder] = useState<OrderType>();
    const [cartProducts, setCartProducts] = useState<DisplayProductType[]>([]);
    const [deliverType, setDeliver] = useState<DeliverTypesType>(
        DELIVER_TYPES[0],
    );
    const { user } = useUser();

    const getOrderRequest = async (orderId: string) => {
        const response = await getOrder({ id: orderId });

        if (response.isValid && response.data) {
            setOrder(response.data);
        }
    };

    useEffect(() => {
        if (!order && orderId) {
            getOrderRequest(orderId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orderId]);

    useEffect(() => {
        if (order && productTypes && allProducts) {
            const data = displayProducts({
                products: order,
                productTypes,
                allProducts,
            });
            setCartProducts(data);
        }
    }, [order, productTypes, allProducts]);

    const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        const formData = new FormData(e.currentTarget);

        const data: AddressData = {
            name: formData.get('name') as string,
            surname: formData.get('surname') as string,
            email: formData.get('email') as string,
            street: formData.get('street') as string,
            streetNumber: formData.get('streetNumber') as string,
            parcelNumber: formData.get('parcelNumber') as string,
            additionalAddresInfo: formData.get(
                'additionalAddresInfo',
            ) as string,
            postalCode: formData.get('postalCode') as string,
            city: formData.get('city') as string,
            country: formData.get('country') as string,
        };
        let paymentAddressDetails;

        if (formData.get('nameAdd')) {
            const dataAdd: AddressData = {
                name: formData.get('nameAdd') as string,
                surname: formData.get('surnameAdd') as string,
                email: formData.get('emailAdd') as string,
                street: formData.get('streetAdd') as string,
                streetNumber: formData.get('streetNumberAdd') as string,
                parcelNumber: formData.get('parcelNumberAdd') as string,
                additionalAddresInfo: formData.get(
                    'additionalAddresInfoAdd',
                ) as string,
                postalCode: formData.get('postalCodeAdd') as string,
                city: formData.get('cityAdd') as string,
                country: formData.get('countryAdd') as string,
            };

            paymentAddressDetails = dataAdd;
        } else {
            paymentAddressDetails = data;
            delete paymentAddressDetails.email;
        }

        await updateOrderDetails({
            id: productListCart?.id as string,
            orderDetails: {
                address: data,
                paymentAddress: paymentAddressDetails,
            },
        });
    };

    const setDeliverType = (val: string) => {
        const find = DELIVER_TYPES.find((type) => type.id === val);
        if (find) {
            setDeliver(find);
        }
    };

    const hardcodedEmail = 'kalistenikazg@gmail.com';

    return (
        <div className="lg:w-[100%] w-[100vw] shadow-lg z-50 flex flex-col">
            <div
                className={`flex flex-row justify-between items-center h-35 w-full z-60 shadow-3xl bg-black`}
            >
                <Link href={'/'}>
                    <Image
                        src={'/logo.jpg'}
                        className="h-24 w-40 bg-transparent lg:ml-10"
                        alt="/placeholder.png"
                        width={500}
                        height={500}
                    />
                </Link>
                <div className="flex lg:flex-row flex-col text-white lg:pr-10 pr-2 justify-between lg:gap-10">
                    <div>Kontakt:</div>
                    <a
                        onClick={(e) => {
                            window.location.href = `mailto:${hardcodedEmail}`;
                            e.preventDefault();
                        }}
                        className="text-blue-400 hover:text-blue-800 underline"
                    >
                        {hardcodedEmail}
                    </a>
                </div>
            </div>
            <div className="flex flex-col-reverse lg:flex-row w-full h-full flex bg-gray-200">
                <div className="lg:w-[60%] w-full bg-white border lg:m-5 rounded-sm flex flex-col">
                    <PaymentAddressForm
                        details={productListCart?.orderDetails}
                        onFormSubmit={submitForm}
                        setDeliverType={setDeliverType}
                        deliverTypes={DELIVER_TYPES}
                        pickedDelivery={deliverType.id}
                        user={user}
                    />
                    <PaymentOptions />
                </div>
                <div className="lg:w-[40%] w-full bg-white border lg:m-5 rounded-sm">
                    <PaymentCart
                        products={cartProducts}
                        price={Number(productListCart?.price) ?? 0}
                        allProducts={allProducts}
                        func={cartFunctions}
                        deliveryPrice={deliverType.price}
                        user={user}
                    />
                </div>
            </div>
        </div>
    );
}
