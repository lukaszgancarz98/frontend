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

export default function Payment({ orderId }: { orderId: string }) {
    const { allProducts, productTypes, productListCart, cartFunctions } =
        useCalistenics();
    const [order, setOrder] = useState<OrderType>();
    const [cartProducts, setCartProducts] = useState<DisplayProductType[]>([]);
    const [deliverType, setDeliver] = useState<DeliverTypesType>(
        DELIVER_TYPES[0],
    );
    const {user} = useUser();

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
    //disable-next-line react-hooks/exhaustive-deps
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

    const submitForm = async (e: any) => {
        const formData = e.target as HTMLFormElement;

        const data: AddressData = {
            name: (formData.name as any).value,
            surname: (formData.surname as any).value,
            email: (formData.email as any).value,
            street: (formData.street as any).value,
            streetNumber: (formData.streetNumber as any).value,
            parcelNumber: (formData.parcelNumber as any).value,
            additionalAddresInfo: (formData.additionalAddresInfo as any).value,
            postalCode: (formData.postalCode as any).value,
            city: (formData.city as any).value,
            country: (formData.country as any).value,
        };

        let paymentAddressDetails;

        if (formData.nameAdd) {
            const dataAdd: AddressData = {
                name: (formData.nameAdd as any).value,
                surname: (formData.surnameAdd as any).value,
                email: (formData.emailAdd as any).value,
                street: (formData.streetAdd as any).value,
                streetNumber: (formData.streetNumberAdd as any).value,
                parcelNumber: (formData.parcelNumberAdd as any).value,
                additionalAddresInfo: (formData.additionalAddresInfoAdd as any)
                    .value,
                postalCode: (formData.postalCodeAdd as any).value,
                city: (formData.cityAdd as any).value,
                country: (formData.countryAdd as any).value,
            };

            paymentAddressDetails = dataAdd;
        } else {
            paymentAddressDetails = data;
            delete paymentAddressDetails.email;
        }

        const response = await updateOrderDetails({
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
        <div className="w-[100%] shadow-lg z-50 flex flex-col">
            <div
                className={`flex flex-row justify-between items-center h-35 w-full z-60 shadow-3xl bg-black`}
            >
                <Link href={'/'}>
                    <img
                        src={'/logo.jpg'}
                        className="h-24 w-40 bg-transparent ml-10"
                    />
                </Link>
                <div className="text-white pr-10 flex justify-between gap-10">
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
            <div className="w-full h-full flex bg-gray-200">
                <div className="w-[60%] bg-white border m-5 rounded-sm flex flex-col">
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
                <div className="w-[40%] bg-white border m-5 rounded-sm">
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
