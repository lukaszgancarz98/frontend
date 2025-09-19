import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import type { CarouselApi } from '@/components/ui/carousel';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from '@/components/ui/carousel';
import Product from './productInGallery';
import type { ProductType, ProductTypeType } from '@/api/produktApi';
import { redirect, RedirectType } from 'next/navigation';
import Link from 'next/link';

interface Gallery6Props {
    heading: string;
    demoUrl?: string;
    items: ProductType[];
    productTypes: ProductTypeType[];
}

const Gallery6 = ({ heading, items, productTypes }: Gallery6Props) => {
    const [carouselApi, setCarouselApi] = useState<CarouselApi>();
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(true);

    const check = (e: CarouselApi) => {
        if (!carouselApi) {
            setCarouselApi(e);
        }
    };

    useEffect(() => {
        if (!carouselApi) {
            return;
        }
        const updateSelection = () => {
            setCanScrollPrev(carouselApi.canScrollPrev());
            setCanScrollNext(carouselApi.canScrollNext());
        };
        updateSelection();
        carouselApi.on('select', updateSelection);
        return () => {
            carouselApi.off('select', updateSelection);
        };
    }, [carouselApi]);

    const findSmallestPrice = (items: ProductTypeType[]) => {
        return items.reduce((min: number, item: ProductTypeType) => {
            if (item.price) {
                return Math.min(min, item.price);
            }
            return min;
        }, Infinity);
    };

    return (
        <section className="lg:pt-40 pt-5" id="products">
            <div className="relative mb-2 flex justify-center flex-row items-center w-full">
                <div className="flex flex-col font-['Graduate']">
                    <div className="lg:text-5xl text-3xl font-semibold lg:mb-6 text-center">
                        {heading}
                    </div>
                    <Link
                        href={'/shop'}
                        className="text-xl text-center bg-blue-400 rounded-lg py-1 transition hover:scale-130"
                    >
                        Przejdz do sklepu
                    </Link>
                </div>
                <div className="absolute lg:top-0 top-15 right-10 mt-8 flex shrink-0 items-center lg:justify-start justify-center gap-2">
                    <Button
                        size="icon"
                        variant="outline"
                        onClick={() => {
                            carouselApi?.scrollPrev();
                        }}
                        disabled={!canScrollPrev}
                        className="disabled:pointer-events-auto"
                    >
                        <ArrowLeft className="size-5" />
                    </Button>
                    <Button
                        size="icon"
                        variant="outline"
                        onClick={() => {
                            carouselApi?.scrollNext();
                        }}
                        disabled={!canScrollNext}
                        className="disabled:pointer-events-auto"
                    >
                        <ArrowRight className="size-5" />
                    </Button>
                </div>
            </div>
            <div className="w-full max-w-full">
                <Carousel
                    setApi={(e) => check(e)}
                    opts={{
                        breakpoints: {
                            '(max-width: 768px)': { dragFree: true },
                        },
                    }}
                    className="w-full max-w-full md:left-[-1rem]"
                >
                    <CarouselContent className="hide-scrollbar w-full max-w-full lg:mx-10 2xl:mr-[max(0rem,calc(50vw-700px-1rem))]">
                        {items?.map((item, index) => (
                            <CarouselItem
                                key={item?.id}
                                className={`ml-8 lg:max-w-[400px] max-w-[90vw] w-full shadow-lg my-8 py-8 pl-4 ${index === 0 ? '' : 'ml-8'} rounded-lg`}
                                onClick={() =>
                                    redirect(
                                        `product/${item.id}`,
                                        RedirectType.push,
                                    )
                                }
                            >
                                <Product
                                    product={item}
                                    price={findSmallestPrice(
                                        productTypes.filter(
                                            (prod) =>
                                                prod.productId === item.id,
                                        ),
                                    )}
                                />
                            </CarouselItem>
                        ))}
                        {items?.length === 0 && <div>Brak produktów</div>}
                    </CarouselContent>
                </Carousel>
            </div>
        </section>
    );
};

export default Gallery6;
