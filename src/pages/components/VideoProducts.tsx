import React, { useState } from 'react';
import type { ProductType, ProductTypeType } from '../../api/produktApi';
import { Button } from '@/components/ui/button';
import type { CartItem } from '../../hooks/useCalistenics';
import TextFade from './Fade/FadeChildComponents';
import Image from 'next/image';
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

type VideoProductsProps = {
    videoProducts: ProductType[];
    productTypes: ProductTypeType[];
    addProductToProductList: (product: CartItem) => Promise<void>;
    title: string;
    description: string;
    useFont?: boolean;
    onlyTextDescription?: boolean;
};

export default function VideoProducts({
    videoProducts,
    productTypes,
    addProductToProductList,
    title,
    description,
    useFont = true,
    onlyTextDescription = false,
}: VideoProductsProps) {
    const [showLevel, setShowLevel] = useState<string>('');
    const [openAlert, setOpenAlert] = useState<string>('');
    const findProductType = (id: string) => {
        const find = productTypes.find((product) => product.productId === id);

        return find;
    };

    const formatText = (text: string) => {
        const splitText = text?.split('\\n');

        return splitText.map((item) => {
            const items = item.split(':');

            const dots = ['1', '2', '3', '4', '5'];

            return (
                <div
                    key={dots + items[0]}
                    className="flex flex-row items-center justify-between"
                >
                    <div className="font-semibold">{items[0]}</div>
                    <div className="flex flex-row gap-1">
                        {dots.map((dot, index) => {
                            const dotSelected = index <= Number(items[1]) - 1;
                            return (
                                <div
                                    key={dot}
                                    className={`${dotSelected ? 'bg-black' : 'bg-white'} rounded-full w-4 h-4 border border-black`}
                                />
                            );
                        })}
                    </div>
                </div>
            );
        });
    };

    return (
        <div className="flex flex-col lg:pt-35" id="trainings">
            <div className="flex flex-col justify-center items-center">
                <div
                    className={`relative mb-3 lg:mx-15 mx-1 lg:text-5xl text-2xl font-semibold md:mb-4 md:text-4xl lg:mb-6 mt-5 z-50 font-['Graduate']`}
                >
                    {title}
                </div>
                <div
                    className={`lg:mx-15 mx-2 lg:text-2xl text-md lg:w-2/3 text-center font-['Graduate']`}
                    dangerouslySetInnerHTML={{ __html: description }}
                />
            </div>
            <div className="flex items-stretch lg:flex-row flex-col py-20 h-max justify-evenly flex-wrap">
                {videoProducts?.map((item) => {
                    const productType = findProductType(item?.id);

                    if (!productType) {
                        return;
                    }

                    const hovered = showLevel === productType?.id;

                    const saleActive = Number(productType?.sale_amount) > 0;
                    console.log(
                        saleActive,
                        productType?.sale_amount,
                        productType,
                    );
                    return (
                        <div
                            key={item?.id}
                            onMouseEnter={() => setShowLevel(productType?.id)}
                            onMouseLeave={() => setShowLevel('')}
                            onTouchStart={() => setShowLevel(productType?.id)}
                            onTouchEnd={() => setShowLevel('')}
                            className="relative shadow-xl lg:w-[28vw] mb-5 lg:mb-0 h-auto mx-5 flex flex-col items-center min-h-1/3 rounded-xl min-w-[25vw] hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                        >
                            <div onClick={() => setOpenAlert(productType?.id)}>
                                <div className="relative w-full">
                                    {hovered && (
                                        <div
                                            className={`absolute top-[40%] left-0 w-full flex text-5xl py-5 px-3 font-medium items-center justify-center bg-[oklch(0.61_0.16_252.06)] text-white z-30 shadow-xl ${useFont ? "font-['Graduate']" : ''} text-center`}
                                        >
                                            {item?.name}
                                        </div>
                                    )}
                                    <Image
                                        src={item?.image}
                                        alt={item?.id}
                                        width={1000}
                                        height={1000}
                                        className="h-max lg:w-max w-full object-center object-contain rounded-tl-lg rounded-t-lg rounded-tr-lg z-20"
                                    />
                                    {hovered && (
                                        <div className="absolute bottom-0 right-0 w-full text-3xl font-semibold text-white text-shadow-lg/30 flex  justify-center">
                                            <div
                                                className={`flex flex-col gap-5 ${!hovered ? 'bg-transparent' : 'bg-[oklch(0.61_0.16_252.06)] animate-bounce'} text-center w-fit py-4 px-3 rounded-tr-xl rounded-tl-xl px-4`}
                                            >
                                                <div className="relative inline-block ">
                                                    {Number(productType?.price)
                                                        ?.toFixed(2)
                                                        .replace('.', ',')}{' '}
                                                    zł
                                                    {saleActive && (
                                                        <svg
                                                            className="absolute top-0 left-0 w-full h-full"
                                                            preserveAspectRatio="none"
                                                        >
                                                            <line
                                                                x1="0"
                                                                y1="9"
                                                                x2="100%"
                                                                y2="90%"
                                                                stroke="red"
                                                                strokeWidth="2"
                                                            />
                                                        </svg>
                                                    )}
                                                </div>
                                                {saleActive && (
                                                    <div>
                                                        {productType.sale_price}{' '}
                                                        zł
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="text-center w-full flex flex-col justify-between h-full mt-5">
                                    <div className="flex flex-col">
                                        <TextFade>
                                            <div
                                                className={`text-3xl text-center font-bold lg:px-10 px-1 pb-5 indent-4 prose ${useFont ? "font-['Graduate']" : ''}`}
                                                style={{
                                                    whiteSpace: 'pre-line',
                                                }}
                                            >
                                                {item?.name}
                                            </div>
                                        </TextFade>
                                        <TextFade>
                                            <div
                                                className="flex flex-col text-lg text-justify px-15 pb-5 prose"
                                                style={{
                                                    whiteSpace: 'pre-line',
                                                }}
                                            >
                                                {!onlyTextDescription
                                                    ? formatText(
                                                          item.description as string,
                                                      )
                                                    : item.description}
                                            </div>
                                        </TextFade>
                                        {productType.shortDescription && (
                                            <TextFade>
                                                <div
                                                    className="flex flex-col text-lg text-start px-15 pb-5 prose"
                                                    dangerouslySetInnerHTML={{
                                                        __html: productType.shortDescription,
                                                    }}
                                                />
                                            </TextFade>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="mb-10 w-full text-center flex justify-center items-center">
                                <Button
                                    className="bg-white text-grey-900 font-bold px-6 py-3 rounded-xl hover:bg-green-600 transition"
                                    onClick={() =>
                                        addProductToProductList({
                                            id: productType?.id as string,
                                            amount: 1,
                                            trening: true,
                                        })
                                    }
                                >
                                    Dodaj do koszyka
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>
            <AlertDialog open={openAlert.length === 0 ? false : true}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle hidden>
                            Dodaj do koszynka
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Czy chcesz dodać do koszyka?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setOpenAlert('')}>
                            Nie
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                addProductToProductList({
                                    id: openAlert,
                                    amount: 1,
                                });
                                setOpenAlert('');
                            }}
                        >
                            Tak
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
