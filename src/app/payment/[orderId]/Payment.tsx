'use client';

import { useEffect, useMemo, useState } from 'react';
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
import { DELIVER_TYPES, LOGO } from '../../../common/constants';
import Link from 'next/link';
import { useUser } from '@/context/userContext';
import Image from 'next/image';
import {
    authorizePayment,
    createOrder,
    PaymentProduct,
} from '@/api/paymentApi';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { isEmpty, omit } from 'lodash';
import { redirect } from 'next/navigation';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';

export default function Payment({ orderId }: { orderId: string }) {
    const { allProducts, productTypes, productListCart, cartFunctions } =
        useCalistenics();
    const [order, setOrder] = useState<OrderType>();
    const [cartProducts, setCartProducts] = useState<DisplayProductType[]>([]);
    const [deliverType, setDeliver] = useState<DeliverTypesType>(
        DELIVER_TYPES[0],
    );
    const { user } = useUser();
    const [token, setToken] = useState<string>('');
    const [alert, setAlert] = useState<string>('');

    const getOrderRequest = async (orderId: string) => {
        const response = await getOrder({ id: orderId });

        if (response.isValid && response.data) {
            setOrder(response.data);
        }
    };

    const onlyTrainingProducts = useMemo(() => {
        const filter = cartProducts.filter(
            (item) => !isEmpty(item.size) || !isEmpty(item.size_placeholder),
        );

        return filter.length === 0;
    }, [cartProducts]);

    const getAuthToken = async (orderId: string) => {
        const response = await authorizePayment(orderId);

        if (response.isValid && !isEmpty(response.data)) {
            setToken(response.data as string);

            return;
        }

        toast('To zamówienie zostało już wcześniej opłacone', {
            action: {
                label: 'Przejdz do zamówienia',
                onClick: () => redirect(`/order/${orderId}`),
            },
        });
    };

    useEffect(() => {
        if (token.length === 0 && orderId) {
            getAuthToken(orderId);
        }
    }, [token, orderId]);

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

    const deliveryPriceCheck = onlyTrainingProducts
        ? 0
        : Number(deliverType.price);

    const totalAmount = useMemo(
        () => Number(productListCart?.price) + deliveryPriceCheck,
        [productListCart?.price, deliveryPriceCheck],
    );

    const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        if (token.length === 0) {
            setAlert('Payment token not found');

            return;
        }

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
            phone: formData.get('phone') as string,
        };
        let paymentAddressDetails;

        if (formData.get('nameAdd')) {
            const dataAdd: AddressData = {
                name: formData.get('nameAdd') as string,
                surname: formData.get('surnameAdd') as string,
                email: formData.get('email') as string,
                street: formData.get('streetAdd') as string,
                streetNumber: formData.get('streetNumberAdd') as string,
                parcelNumber: formData.get('parcelNumberAdd') as string,
                additionalAddresInfo: formData.get(
                    'additionalAddresInfoAdd',
                ) as string,
                postalCode: formData.get('postalCodeAdd') as string,
                city: formData.get('cityAdd') as string,
                country: formData.get('countryAdd') as string,
                phone: formData.get('phone') as string,
            };

            paymentAddressDetails = dataAdd;
        } else {
            paymentAddressDetails = data;
        }

        const response = await updateOrderDetails({
            id: productListCart?.id as string,
            orderDetails: {
                address: data,
                paymentAddress: paymentAddressDetails,
                deliver: onlyTrainingProducts ? undefined : deliverType,
            },
        });
        if (!response.isValid) {
            setAlert('Error');

            return;
        }

        const totalAmountString = totalAmount
            .toFixed(2)
            .replace('.', '')
            .toString();

        const productList = productListCart?.products.reduce(
            (arr: PaymentProduct[], item) => {
                const findProductType = productTypes.find((x) => x.id === item);
                const findProduct = allProducts?.find(
                    (product) => product?.id === findProductType?.productId,
                );
                const indexExist = arr.findIndex(
                    (x) => x.id === findProductType?.id,
                );

                if (indexExist !== -1) {
                    const number = Number(arr[indexExist].quantity);
                    const amount = number + 1;
                    arr[indexExist].quantity = amount.toString();

                    return arr;
                }

                if (!findProductType) {
                    return arr;
                }

                const price =
                    Number(findProductType?.sale_amount) > 0
                        ? Number(findProductType?.sale_price)
                        : Number(findProductType?.price);
                const name = findProductType?.size
                    ? ` ${findProductType?.size}`
                    : '';
                arr.push({
                    name: findProduct?.name + name,
                    quantity: '1',
                    id: findProductType.id,
                    unitPrice: price
                        ?.toFixed(2)
                        .replace('.', '')
                        .toString() as string,
                });

                return arr;
            },
            [],
        );

        const productData = productList?.reduce(
            (arr: PaymentProduct[], item) => {
                arr.push(omit(item, 'id'));

                return arr;
            },
            [],
        );
        const deliveryPrice = deliverType.price.toFixed(2).replace('.', '');

        if (!onlyTrainingProducts) {
            productData?.push({
                name: 'Delivery',
                unitPrice: deliveryPrice.toString(),
                quantity: '1',
            });
        }

        const parcelNumber = paymentAddressDetails.parcelNumber
            ? `/${paymentAddressDetails.parcelNumber}`
            : '';

        const paymentData = {
            totalAmount: totalAmountString,
            buyer: {
                email: paymentAddressDetails.email as string,
                phone: paymentAddressDetails.phone,
                firstName: paymentAddressDetails.name,
                lastName: paymentAddressDetails.surname,
                delivery: {
                    street: paymentAddressDetails.street,
                    postalBox:
                        paymentAddressDetails.streetNumber + parcelNumber,
                    postalCode: paymentAddressDetails.postalCode,
                    city: paymentAddressDetails.city,
                    recipientName: paymentAddressDetails.name,
                    recipientEmail: paymentAddressDetails.email as string,
                    recipientPhone: paymentAddressDetails.phone,
                },
            },
            products: productData as PaymentProduct[],
        };

        const paymentResponse = await createOrder(orderId, paymentData);

        if (paymentResponse.isValid && paymentResponse.data) {
            window.open(
                `${paymentResponse.data.redirectUri}`,
                '_blank',
                'noopener,noreferrer',
            );
        }
    };

    const setDeliverType = (val: string) => {
        const find = DELIVER_TYPES.find((type) => type.id === val);
        if (find) {
            setDeliver(find);
        }
    };

    const hardcodedEmail = 'kontakt@theschoolofcalisthenics.pl';

    return (
        <div className="lg:w-[100%] w-[100vw] shadow-lg z-50 flex flex-col">
            <div
                className={`flex flex-row justify-between items-center h-35 w-full z-60 shadow-3xl bg-black`}
            >
                <Link href={'/'}>
                    <Image
                        src={LOGO}
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
            <Toaster position="top-center" richColors />
            <AlertDialog open={alert.length === 0 ? false : true}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Błąd</AlertDialogTitle>
                        <AlertDialogDescription>{alert}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setAlert('')}>
                            Cancel
                        </AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <div className="flex flex-col-reverse lg:flex-row w-full h-full flex bg-gray-200">
                <div className="lg:w-[60%] w-full bg-white border lg:m-5 rounded-sm flex flex-col">
                    <PaymentAddressForm
                        details={productListCart?.orderDetails}
                        onFormSubmit={submitForm}
                        setDeliverType={setDeliverType}
                        deliverTypes={DELIVER_TYPES}
                        pickedDelivery={deliverType.id}
                        user={user}
                        displayDelivery={!onlyTrainingProducts}
                    />
                </div>
                <div className="lg:w-[40%] w-full bg-white border lg:m-5 rounded-sm">
                    <PaymentCart
                        products={cartProducts}
                        price={totalAmount}
                        allProducts={allProducts}
                        func={cartFunctions}
                        deliveryPrice={deliverType.price}
                        displayDelivery={!onlyTrainingProducts}
                        order={orderId}
                    />
                </div>
            </div>
        </div>
    );
}
