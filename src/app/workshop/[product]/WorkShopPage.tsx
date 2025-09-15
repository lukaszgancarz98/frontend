'use client';

import BackgroundOnScroll from '@/pages/components/Fade/BackgroundOnScroll/BackgroundOnScroll';
import TextFade from '@/pages/components/Fade/FadeChildComponents';
import Image from 'next/image';
import Link from 'next/link';

type WorkShopPageProps = { productId: string };

export default function WorkShopPage({ productId }: WorkShopPageProps) {
    return (
        <div>
            <div
                id="header"
                className={`flex flex-row justify-between items-center h-35 fixed top-0 left-0 lg:w-full w-[100vw] z-60 shadow-xl bg-black`}
            >
                <Link href="/" className="flex flex-col justify-start w-1/4">
                    <Image
                        src={'/logo.png'}
                        className="h-24 w-40 bg-transparent lg:ml-10"
                        alt="/placeholder.png"
                        width={1000}
                        height={1000}
                    />
                </Link>
                <div className="flex flex-col lg:w-2/4 w-3/4 justify-around items-center h-full">
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
            <div className="pt-35">
                <div
                    id="oboz1"
                    className="flex lg:flex-row flex-col h-[100vh] lg:h-auto w-full pb-10 bg-white shadow-2xl"
                >
                    <BackgroundOnScroll
                        backgroundImageUrl="/kalintro02.jpg"
                        className="w-[60vw] lg:h-150 h-80"
                        bgClassName=""
                        shadow="shadow-[inset_0_0_20px_20px_rgba(255,255,255,1)]"
                    />
                    <div className="lg:w-1/2 text-black">
                        <TextFade className="lg:p-10 h-full flex justify-center lg:items-center">
                            <div className="flex flex-col lg:text-3xl text-2xl p-3 w-full prose prose-stone prose-invert lg:text-justify justify-center items-center">
                                <div className="pb-2 font-bold">
                                    DOŁĄCZ DO SZKOŁY KALISTENIKI
                                </div>
                                <div className="pb-7 font-bold">
                                    ZOSTAŃ TRENEREM
                                </div>
                            </div>
                        </TextFade>
                    </div>
                </div>
                <div
                    id="oboz1"
                    className="flex lg:flex-row flex-col h-[100vh] lg:h-auto w-full pb-10 bg-white shadow-2xl"
                >
                    <div className="lg:w-1/2 text-black">
                        <TextFade className="lg:p-10 h-full flex justify-center lg:items-center">
                            <div className="flex flex-col lg:text-3xl text-2xl p-3 w-full prose prose-stone prose-invert lg:text-justify justify-center items-center">
                                <div className="pb-2 font-bold">
                                    DOŁĄCZ DO SZKOŁY KALISTENIKI
                                </div>
                                <div className="pb-7 font-bold">
                                    ZOSTAŃ TRENEREM
                                </div>
                            </div>
                        </TextFade>
                    </div>
                    <BackgroundOnScroll
                        backgroundImageUrl="/kalintro02.jpg"
                        className="w-[60vw] lg:h-150 h-80"
                        bgClassName=""
                        shadow="shadow-[inset_0_0_20px_20px_rgba(255,255,255,1)]"
                    />
                </div>
                <div
                    id="oboz1"
                    className="flex lg:flex-row flex-col h-[100vh] lg:h-auto w-full pb-10 bg-white shadow-2xl"
                >
                    <BackgroundOnScroll
                        backgroundImageUrl="/kalintro02.jpg"
                        className="w-[60vw] lg:h-150 h-80"
                        bgClassName=""
                        shadow="shadow-[inset_0_0_20px_20px_rgba(255,255,255,1)]"
                    />
                    <div className="lg:w-1/2 text-black">
                        <TextFade className="lg:p-10 h-full flex justify-center lg:items-center">
                            <div className="flex flex-col lg:text-3xl text-2xl p-3 w-full prose prose-stone prose-invert lg:text-justify justify-center items-center">
                                <div className="pb-2 font-bold">
                                    DOŁĄCZ DO SZKOŁY KALISTENIKI
                                </div>
                                <div className="pb-7 font-bold">
                                    ZOSTAŃ TRENEREM
                                </div>
                            </div>
                        </TextFade>
                    </div>
                </div>
                <div className="w-full"></div>
                <div className="w-full"></div>
                {productId}
            </div>
        </div>
    );
}
