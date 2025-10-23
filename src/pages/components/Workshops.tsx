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
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import TextFade from './Fade/FadeChildComponents';
import Image from 'next/image';
import { ProductType, ProductTypeType } from '@/api/produktApi';
import { CartItem } from '@/hooks/useCalistenics';
import { redirect, RedirectType } from 'next/navigation';

type VideoProductsProps = {
    products: ProductType[];
    productTypes: ProductTypeType[];
    addProductToProductList: (product: CartItem) => Promise<void>;
    title: string;
    description: string;
};

export default function Workshops({
    products,
    productTypes,
    addProductToProductList,
    title,
    description,
}: VideoProductsProps) {
    const [showLevel, setShowLevel] = useState<string>('');
    const [openAlert, setOpenAlert] = useState<string>('');
    const findProductType = (id: string) => {
        const find = productTypes.find((product) => product.productId === id);

        return find;
    };

    return (
        <div className="flex flex-col lg:pt-35" id="trainings">
            <div className="flex flex-col justify-center items-center">
                <div className="relative mb-3 lg:mx-15 mx-1 lg:text-5xl text-2xl font-semibold md:mb-4 md:text-4xl lg:mb-6 mt-5 z-50 font-['Graduate']">
                    {title}
                </div>
                <div
                    className="lg:mx-15 mx-2 lg:text-2xl text-md lg:w-2/3 text-center font-['Graduate']"
                    dangerouslySetInnerHTML={{ __html: description }}
                />
            </div>
            <div className="flex items-stretch lg:flex-row flex-col py-20 h-max justify-evenly flex-wrap">
                {products?.map((item) => {
                    const productType = findProductType(item?.id);

                    if (!productType) {
                        return;
                    }

                    const hovered = showLevel === productType?.id;

                    const saleActive = Number(productType?.sale_amount) > 0;
                    const priceExist = Number(productType?.price) !== 0;

                    return (
                        <div
                            key={item?.id}
                            onMouseEnter={() => setShowLevel(productType?.id)}
                            onMouseLeave={() => setShowLevel('')}
                            onTouchStart={() => setShowLevel(productType?.id)}
                            onTouchEnd={() => setShowLevel('')}
                            className="relative shadow-xl lg:w-[28vw] mb-5 lg:mb-0 h-auto mx-5 flex flex-col items-center min-h-1/3 rounded-xl min-w-[25vw] hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                        >
                            <div
                                onClick={() =>
                                    priceExist && setOpenAlert(productType?.id)
                                }
                            >
                                <div className="relative w-full">
                                    {hovered && (
                                        <div className="absolute top-0 lg:top-[40%] left-0 w-full flex text-5xl py-5 px-3 font-medium items-center justify-center bg-black text-white z-30 shadow-xl font-['Graduate'] text-center rounded-tl-lg rounded-tr-lg lg:rounded-tl-none lg:rounded-tr-none">
                                            {item?.name}
                                        </div>
                                    )}
                                    <Image
                                        src={item?.image?.url as string}
                                        alt={item?.id}
                                        width={900}
                                        height={400}
                                        unoptimized
                                        className="h-max lg:w-max w-full object-center object-contain rounded-tl-lg rounded-t-lg rounded-tr-lg z-20"
                                    />
                                    {hovered && priceExist && (
                                        <div className="absolute bottom-0 right-0 w-full text-3xl font-semibold text-white text-shadow-lg/30 flex  justify-center">
                                            <div
                                                className={`flex flex-col gap-5 ${hovered ? 'bg-black' : 'bg-transparent'} ${hovered && saleActive ? 'animate-bounce' : ''} text-center w-fit py-4 px-3 rounded-tr-xl rounded-tl-xl px-4`}
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
                                <div className="text-center w-full flex flex-col justify-between mt-5">
                                    <div className="flex flex-col">
                                        <TextFade>
                                            <div
                                                className="text-3xl text-center font-bold lg:px-10 px-1 pb-5 indent-4 prose font-['Graduate']"
                                                style={{
                                                    whiteSpace: 'pre-line',
                                                }}
                                            >
                                                {item?.name}
                                            </div>
                                        </TextFade>
                                        <TextFade>
                                            <div className="flex flex-col text-lg text-start px-15 pb-5 prose">
                                                {item.short_description}
                                            </div>
                                        </TextFade>
                                    </div>
                                </div>
                            </div>
                            <div className="mb-10 w-full text-center flex justify-center items-center">
                                <Button
                                    className={`bg-white bg-blue-400 font-bold px-6 py-3 rounded-xl hover:bg-green-400 transition hover:scale-115`}
                                    onClick={() =>
                                        priceExist
                                            ? addProductToProductList({
                                                  id: productType?.id as string,
                                                  amount: 1,
                                                  trening: true,
                                              })
                                            : redirect(
                                                  `/workshop/${item?.id}`,
                                                  RedirectType.push,
                                              )
                                    }
                                >
                                    {priceExist
                                        ? 'DODAJ DO KOSZYKA'
                                        : 'WIĘCEJ INFO'}
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>
            <AlertDialog open={openAlert.length === 0 ? false : true}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Dodaj do koszynka</AlertDialogTitle>
                        <AlertDialogDescription>Test</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setOpenAlert('')}>
                            Cancel
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
                            Continue
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
