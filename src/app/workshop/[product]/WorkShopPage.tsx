'use client';

import {
    getProduct,
    getProductTypesByProductId,
    ProductType,
    ProductTypeType,
} from '@/api/produktApi';
import { createWorkShopReceiver } from '@/api/workShopApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Toaster } from '@/components/ui/sonner';
import { useUser } from '@/context/userContext';
import BackgroundOnScroll from '@/pages/components/Fade/BackgroundOnScroll/BackgroundOnScroll';
import TextFade from '@/pages/components/Fade/FadeChildComponents';
import { isEmpty } from 'lodash';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

type WorkShopPageProps = { productId: string };

export default function WorkShopPage({ productId }: WorkShopPageProps) {
    const [product, setProduct] = useState<ProductType>();
    const [productType, setProductType] = useState<ProductTypeType>();
    const { user } = useUser();

    const getProducts = async () => {
        const responseProductType = await getProductTypesByProductId(productId);
        const respnseProduct = await getProduct(productId);

        if (responseProductType.isValid && respnseProduct.isValid) {
            setProduct(respnseProduct?.data as ProductType);
            setProductType(responseProductType?.data?.[0]);
        }
    };

    useEffect(() => {
        if (productId) {
            getProducts();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productId]);

    const descriptions = useMemo(
        () => product?.description.split(':'),
        [product],
    );

    const saveEmailForNotifications = async (
        e: React.FormEvent<HTMLFormElement>,
    ) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const email = formData.get('email') as string;

        if (email) {
            const response = await createWorkShopReceiver({
                id: productId,
                email: email,
            });

            if (isEmpty(response.data)) {
                toast.warning('Ten email został już dodany');

                return;
            }

            if (response.isValid) {
                toast.info('Poinformujemy Cię o najbliższych eventach');
            }
        }
    };

    return (
        <div>
            <div
                id="header"
                className={`flex flex-row justify-between items-center lg:h-35 h-30 fixed top-0 left-0 lg:w-full w-[100vw] z-60 shadow-xl bg-black`}
            >
                <Link
                    href="/"
                    className="flex flex-col justify-start lg:w-1/4 w-1/3"
                >
                    <Image
                        src={'/logo.png'}
                        className="lg:h-24 lg:w-40 bg-transparent lg:ml-10"
                        alt="/placeholder.png"
                        width={1000}
                        height={1000}
                    />
                </Link>
                <div className="flex flex-col lg:w-2/4 w-2/3 justify-around items-center h-full">
                    <Image
                        src={'/text.png'}
                        className="object-contain w-full h-1/2 pr-1 lg:pr-0"
                        alt="/placeholder.png"
                        width={500}
                        height={500}
                    />
                </div>
                <div className="lg:w-1/4" />
            </div>
            <Toaster position="top-center" richColors />
            <div className="pt-35 lg:font-comic bg-[oklch(0.13_0.03_246.75)] text-stone-300">
                <div className="text-center text-5xl font-semibold pt-10 pb-15">
                    {product?.name}
                </div>
                {descriptions?.map((item, index) => {
                    const displayVarian = index % 2 === 0;
                    const image = productType?.images[index];

                    return (
                        <div
                            key={index.toString()}
                            className={`flex ${displayVarian ? 'lg:flex-row' : 'lg:flex-row-reverse'} flex-col lg:h-[100vh] lg:h-auto w-full pb-25 lg:pb-10 shadow-2xl`}
                        >
                            <BackgroundOnScroll
                                backgroundImageUrl={image as string}
                                className="lg:w-1/2 lg:h-150 h-80"
                                bgClassName="object-contain"
                            />
                            <div className="text-black lg:w-1/2">
                                <TextFade className="lg:p-10 lg:h-full flex justify-center lg:items-center">
                                    <div className="relative flex flex-col lg:text-4xl text-2xl p-3 w-full h-full text-stone-300 lg:text-center justify-center items-center">
                                        <div className="pb-2 font-bold">
                                            {item}
                                        </div>
                                        <div className="absolute -bottom-20 lg:bottom-10 left-0 w-full flex items-center justify-center">
                                            <Link
                                                href={'#kontakt'}
                                                className="text-3xl bg-blue-300 py-2 px-5 rounded-lg text-black transition-all duration-300 hover:text-4xl"
                                            >
                                                Kontakt
                                            </Link>
                                        </div>
                                    </div>
                                </TextFade>
                            </div>
                        </div>
                    );
                })}
                <div
                    id="kontakt"
                    className="w-full flex flex-col items-center py-20 gap-5"
                >
                    <div className="text-4xl text-center">
                        ZOSTAW EMAIL ABY DOWIEDZIEĆ SIĘ WIĘCEJ
                    </div>
                    <form
                        className="w-full flex flex-col items-center gap-5 px-5 lg:px-0"
                        onSubmit={(e) => saveEmailForNotifications(e)}
                    >
                        <Input
                            className="lg:w-1/4"
                            placeholder="EMAIL"
                            name="email"
                            type="email"
                            required
                            value={user?.email}
                        />
                        <Button
                            type="submit"
                            className="text-3xl bg-blue-300 py-7 px-5 rounded-lg text-black transition-all duration-300 hover:scale-120 hover:bg-blue-500"
                        >
                            Poinformuj mnie
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
