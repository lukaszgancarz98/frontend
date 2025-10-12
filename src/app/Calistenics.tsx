import TextFade from '../pages/components/Fade/FadeChildComponents';
import BackgroundOnScroll from '../pages/components/Fade/BackgroundOnScroll/BackgroundOnScroll';
import { useEffect, useMemo, useRef, useState } from 'react';
import Cart from '../pages/components/Cart/Cart';
import Gallery6 from '../pages/components/gallery6';
import { useCalistenics } from '../hooks/useCalistenics';
import VideoProducts from '../pages/components/VideoProducts';
import type { ProductType } from '@/api/produktApi';
import Menu from './Menu';
import Footer2 from '../pages/components/footer2';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Workshops from '@/pages/components/Workshops';
import { Toaster } from '@/components/ui/sonner';
import Kontakt from '@/pages/components/Kontakt';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

export default function Calistenics() {
    const randTriggered = useRef(false);
    const {
        products,
        videoProducts,
        allProducts,
        productTypes,
        productListCart,
        addProductToProductList,
        cartFunctions,
        expandCart,
        updateExpanded,
        setProductListCart,
    } = useCalistenics();
    const [randomSortedProducts, setRandomSortedProducts] =
        useState<ProductType[]>();
    const homeRef = useRef<HTMLDivElement>(null);
    const prodRef = useRef<HTMLDivElement>(null);
    const vidRef = useRef<HTMLDivElement>(null);
    const vidLevelsRef = useRef<HTMLDivElement>(null);
    const additionalActivities = useRef<HTMLDivElement>(null);
    const footerRef = useRef<HTMLDivElement>(null);
    const [menuOpen, setMenuOpen] = useState<boolean>(false);
    const [scrolled, setScrolled] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);

    useEffect(() => {
        if (!randTriggered.current && products.length > 0) {
            randTriggered.current = true;
            setRandomSortedProducts(products?.sort(() => Math.random() - 0.5));
        }
    }, [products]);

    const handleScroll = (
        e: React.MouseEvent<HTMLAnchorElement>,
        ref: HTMLDivElement | null,
    ) => {
        e.preventDefault();
        if (ref) {
            ref.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const settings = [
        { title: 'STRONA GŁÓWNA', href: '#home', ref: homeRef.current },
        {
            title: 'PLANY TRENINGOWE',
            href: '#videosLevels',
            ref: vidRef.current,
        },
        {
            title: 'TRENINGI SPECJALISTYCZNE',
            href: '#videos',
            ref: vidLevelsRef.current,
        },
        {
            title: 'USŁUGI DODATKOWE',
            href: '#activities',
            ref: additionalActivities.current,
        },
        { title: 'SKLEP', href: '#products', ref: prodRef.current },
        { title: 'KONTAKT', href: '#footer', ref: footerRef.current },
    ];

    const filteredTrainings = (type: string) => {
        const filtered = videoProducts.filter((product) =>
            product.category.includes(type),
        );
        const sortedProducts = filtered.sort(
            (a, b) =>
                Number(a.category.split('-')[2]) -
                Number(b.category.split('-')[2]),
        );

        return sortedProducts;
    };

    const productsCount = useMemo(
        () => productListCart?.products?.length ?? 0,
        [productListCart],
    );

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop =
                window.scrollY || document.documentElement.scrollTop;

            if (scrollTop >= 50) {
                setScrolled(true);
            } else if (scrollTop < 50) {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        // Cleanup
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className="h-svh relative w-[100%]">
            <div
                id="header"
                className={`flex flex-row flex-wrap lg:justify-between p-2 lg:p-0 lg:h-35 fixed top-0 left-0 w-full z-60 h-[20vh] transition-all duration-500 ease-in-out ${menuOpen || scrolled ? 'bg-black shadow-xl' : 'oklch(0.13_0.03_246.75)'}`}
            >
                <a
                    href="#home"
                    className="lg:relative fixed left-0 top-15 lg:top-2 flex flex-col justify-center w-1/4 lg:h-full h-[10vh]"
                    onClick={(e) => handleScroll(e, homeRef.current)}
                >
                    <Image
                        src={'/logo.png'}
                        className="lg:h-30 lg:w-50 bg-transparent lg:ml-10"
                        width={500}
                        height={500}
                        alt="/placeholder.png"
                    />
                </a>
                <div className="flex flex-col lg:w-2/4 w-full justify-around lg:items-center lg:h-full h-[10vh]">
                    <Image
                        src={'/text.png'}
                        className="object-contain w-full h-full"
                        width={1000}
                        height={400}
                        alt="/placeholder.png"
                    />
                </div>
                <div className="flex flex-row lg:w-1/4 w-[100vw] lg:justify-end justify-between items-center lg:gap-20">
                    {productsCount > 0 && (
                        <Cart
                            products={productListCart}
                            allProducts={allProducts}
                            productTypes={productTypes}
                            functions={cartFunctions}
                            expand={expandCart}
                            setExpanded={(val: boolean) => updateExpanded(val)}
                            disabled={menuOpen}
                        />
                    )}
                    <Menu
                        settings={settings}
                        setMenuOpen={setMenuOpen}
                        resetOrder={setProductListCart}
                    />
                </div>
            </div>
            <Toaster position="top-center" richColors />
            <div
                id="home"
                ref={homeRef}
                className="flex lg:flex-row flex-col w-full pt-[20vh] lg:pt-35 pb-10 bg-[oklch(0.13_0.03_246.56)] shadow-2xl"
            >
                <BackgroundOnScroll
                    backgroundImageUrl="/kalintro02.jpg"
                    className="w-[70vw] lg:h-200 h-80 w-full"
                    bgClassName=""
                />
                <div className="lg:w-1/2 text-white">
                    <TextFade className="lg:p-10 h-full flex justify-center lg:items-center">
                        <div className="flex flex-col gap-5 lg:text-3xl text-2xl p-3 w-full justify-center items-center font-medium lg:font-comic">
                            <div className="pb-2">KIM JESTEŚ?</div>
                            <div className="text-center">
                                JAKIE MASZ UMIEJĘTNOŚCI?
                            </div>
                            <div>JAK TRENUJESZ?</div>
                            <div className="pb-5">CO OSIĄGASZ?</div>
                            <div className="w-full text-center pb-5">
                                ZALEŻY TYLKO I WYŁĄCZNIE OD CIEBIE
                            </div>
                            <Dialog
                                open={open}
                                onOpenChange={() => {
                                    if (open) {
                                        setOpen((prev) => !prev);
                                    }
                                }}
                            >
                                <DialogTrigger asChild>
                                    <Button
                                        className="w-1/3 bg-blue-500 text-black hover:bg-green-400 hover:text-xl"
                                        onClick={() => setOpen(true)}
                                    >
                                        KONTAKT
                                    </Button>
                                </DialogTrigger>
                                <DialogTitle hidden />
                                <DialogContent className="w-[100vw] lg:w-[30vw] z-80">
                                    <Kontakt close={() => setOpen(false)} />
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button
                                                variant="outline"
                                                onClick={() => setOpen(false)}
                                            >
                                                Anuluj
                                            </Button>
                                        </DialogClose>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                            <div className="pb-2 pt-3">ZOSTAŃ JEDNYM Z NAS</div>
                        </div>
                    </TextFade>
                </div>
            </div>
            <div id="videos" ref={vidRef} className="min-h-[100%]">
                <VideoProducts
                    videoProducts={filteredTrainings('levels')}
                    productTypes={productTypes}
                    addProductToProductList={addProductToProductList}
                    title="PLANY TRENINGOWE"
                    description="ZACZYNASZ? MASZ DOSWIADCZENIE? TRENUJESZ OD LAT?<br />WYBIERZ POZIOM DLA SIEBIE"
                />
            </div>
            <div className="flex lg:flex-row flex-col-reverse h-[100vh] lg:h-auto w-full py-10 bg-[oklch(0.13_0.03_246.56)] shadow-2xl">
                <div className="lg:w-1/2 bg-[oklch(0.13_0.03_246.56)] text-white">
                    <TextFade className="lg:p-10 h-full flex justify-center lg:items-center">
                        <div className="flex flex-col gap-5 lg:text-3xl text-2xl p-3 w-full justify-center items-center font-medium lg:font-comic">
                            <div>
                                MOMENT, W KTÓRYM NIEMOŻLIWE STAJE SIĘ MOŻLIWE
                                JEST NIESAMOWITY.
                            </div>
                            <div>
                                KIEDY Z NISKIEJ SAMOOCENY WYRASTA OGROMNA
                                PEWNOŚĆ SIEBIE.
                            </div>
                            <div>
                                KIEDY PRZECIĘTNOŚĆ PRZERADZA SIĘ W WYBITNOŚĆ.
                            </div>
                        </div>
                    </TextFade>
                </div>
                <BackgroundOnScroll
                    backgroundImageUrl="/kalintro04.jpg"
                    className="w-[70vw] lg:h-200 h-80 w-full"
                    bgClassName=""
                />
            </div>
            <div
                id="videosLevels"
                ref={vidLevelsRef}
                className="min-h-[100%] lg:pb-30"
            >
                <VideoProducts
                    videoProducts={videoProducts.filter((product) =>
                        product.category.includes('extend'),
                    )}
                    productTypes={productTypes}
                    addProductToProductList={addProductToProductList}
                    title="TRENINGI SPECJALISTYCZNE"
                    description="SZUKASZ BARDZIEJ UKIERUNKOWANYCH TRENINGÓW?"
                    useFont={false}
                    onlyTextDescription={true}
                />
            </div>
            <div className="flex lg:flex-row flex-col h-[100vh] lg:h-auto w-full bg-[oklch(0.13_0.03_246.56)] pt-10 pb-20">
                <BackgroundOnScroll
                    backgroundImageUrl="/kalintro03.jpg"
                    className="w-[70vw] lg:h-200 h-80 w-full"
                    bgClassName=""
                />
                <div className=":lgw-1/2 text-white">
                    <TextFade className="lg:p-10 h-full flex items-center">
                        <div className="flex flex-col gap-10 lg:text-3xl text-2xl p-3 w-full items-center font-medium lg:font-comic">
                            <div className="text-center">
                                MASZ JEDNĄ SZANSĘ BY STAĆ SIĘ LEGENDĄ.
                            </div>
                            <div className="text-center">
                                WYWALCZ SOBIE DROGĘ ABY ZOSTAĆ ZAPAMIĘTANYM.
                            </div>
                        </div>
                    </TextFade>
                </div>
            </div>
            <div ref={additionalActivities} id="activities">
                <Workshops
                    products={filteredTrainings('optional')}
                    productTypes={productTypes}
                    addProductToProductList={addProductToProductList}
                    title=" OPCJE DODATKOWE"
                    description="CHCESZ WIECEJ? <br />SKORZYSTAJ Z ROZSZERZONEJ OFERTY"
                />
            </div>
            <div id="products" ref={prodRef}>
                <Gallery6
                    items={randomSortedProducts as ProductType[]}
                    productTypes={productTypes}
                    heading="Produkty"
                />
            </div>
            <div id="footer" ref={footerRef} className="w-[100%] pt-20">
                <Footer2 />
            </div>
        </div>
    );
}
