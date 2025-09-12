import TextFade from '../pages/components/Fade/FadeChildComponents';
import BackgroundOnScroll from '../pages/components/Fade/BackgroundOnScroll/BackgroundOnScroll';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import LoginForm from '../pages/components/login-form';
import RegisterForm from '../pages/components/register-form';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useUser } from '../context/userContext';
import Cart from '../pages/components/Cart/Cart';
import useUserHook from '../hooks/useUser';
import Gallery6 from '../pages/components/gallery6';
import { useCalistenics } from '../hooks/useCalistenics';
import VideoProducts from '../pages/components/VideoProducts';
import type { ProductType } from '@/api/produktApi';
import Menu from '../pages/components/Menu/Menu';
import Footer2 from '../pages/components/footer2';
import { Button } from '@/components/ui/button';

export default function Calistenics() {
    const [isLogin, setIsLogin] = useState(true);
    const { clearUser } = useUser();
    const randTriggered = useRef(false);
    const {
        loginFn,
        registerFn,
        googleAuth,
        loginError,
        registerError,
        logged,
    } = useUserHook();
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
    } = useCalistenics();
    const [randomSortedProducts, setRandomSortedProducts] =
        useState<ProductType[]>();
    const [dialogOpen, setDialogOpen] = useState(false);
    const homeRef = useRef<HTMLDivElement>(null);
    const prodRef = useRef<HTMLDivElement>(null);
    const vidRef = useRef<HTMLDivElement>(null);
    const vidLevelsRef = useRef<HTMLDivElement>(null);
    const additionalActivities = useRef<HTMLDivElement>(null);
    const footerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (!randTriggered.current && products.length > 0) {
            randTriggered.current = true;
            setRandomSortedProducts(products?.sort(() => Math.random() - 0.5));
        }
    }, [products]);

    const signupFn = () => {
        setIsLogin(false);
    };

    const handleDialogOpenChange = (open: boolean) => {
        setDialogOpen(open);
        if (!open) {
            setIsLogin(true);
        }
    };

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
        { title: 'Strona główna', href: '#home', ref: homeRef.current },
        { title: 'Treningi', href: '#videos', ref: vidRef.current },
        {
            title: 'Treningi poziomy',
            href: '#videosLevels',
            ref: vidLevelsRef.current,
        },
        {
            title: 'Dodatkowe usługi',
            href: '#activities',
            ref: additionalActivities.current,
        },
        { title: 'Produkty', href: '#products', ref: prodRef.current },
        { title: 'Kontakt', href: '#footer', ref: footerRef.current },
    ];

    const levelTrainings = useMemo(() => {
        const vidLvlProd = videoProducts.filter((product) =>
            product.type.includes('levels'),
        );
        const sortedProducts = vidLvlProd.sort(
            (a, b) =>
                Number(a.type.split('-')[2]) - Number(b.type.split('-')[2]),
        );

        return sortedProducts;
    }, [videoProducts]);

    const productsCount = useMemo(
        () => productListCart?.products.length ?? 0,
        [products],
    );

    return (
        <div className="h-svh relative">
            <div
                id="header"
                className={`flex flex-row justify-between items-center h-35 fixed top-0 left-0 w-full z-60 shadow-xl bg-black`}
            >
                <a
                    href="#home"
                    className="flex flex-col justify-start w-1/4"
                    onClick={(e) => handleScroll(e, homeRef.current)}
                >
                    <img
                        src={'/logo.jpg'}
                        className="h-24 w-40 bg-transparent ml-10"
                    />
                </a>
                <div className="flex flex-col w-2/4 justify-around items-center h-full">
                    <img
                        src={'/text.jpg'}
                        className="object-contain w-full h-1/2"
                    />
                </div>
                <div className="flex flex-row w-1/4 justify-end items-center gap-20">
                    {logged ? (
                        <Button
                            onClick={() => {
                                clearUser();
                                handleDialogOpenChange(false);
                            }}
                        >
                            Wyloguj się
                        </Button>
                    ) : (
                        <Dialog
                            open={dialogOpen}
                            onOpenChange={handleDialogOpenChange}
                        >
                            <DialogTrigger asChild>
                                <Button variant="outline">Zaloguj się</Button>
                            </DialogTrigger>
                            <DialogTitle hidden />
                            <DialogContent className="sm:max-w-[425px]">
                                {isLogin ? (
                                    <LoginForm
                                        loginFn={loginFn}
                                        signupFn={signupFn}
                                        googleAuth={googleAuth}
                                        error={loginError}
                                    />
                                ) : (
                                    <RegisterForm
                                        registerFn={registerFn}
                                        error={registerError}
                                    />
                                )}
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button
                                            variant="outline"
                                            onClick={() => setIsLogin(true)}
                                        >
                                            Anuluj
                                        </Button>
                                    </DialogClose>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    )}
                    {productsCount > 0 && (
                        <Cart
                            products={productListCart}
                            allProducts={allProducts}
                            productTypes={productTypes}
                            functions={cartFunctions}
                            expand={expandCart}
                            setExpanded={(val: boolean) => updateExpanded(val)}
                        />
                    )}
                    <Menu settings={settings} />
                </div>
            </div>
            <div
                id="home"
                ref={homeRef}
                className="flex flex-row w-full pt-35 pb-10 bg-[oklch(0.13_0.03_246.56)] shadow-2xl"
            >
                <BackgroundOnScroll
                    backgroundImageUrl="/kalintro02.jpg"
                    className="w-[70vw] h-200"
                    bgClassName=""
                />
                <div className="w-1/2 text-white">
                    <TextFade className="p-10 h-full flex justify-center items-center">
                        <div className="text-3xl p-3 w-full prose prose-stone prose-invert text-justify">
                            NIE MUSISZ BYĆ SILNYM ŻEBY ZACZĄĆ TRENOWAĆ, ALE
                            MUSISZ ZACZĄĆ BY SILNYM SIĘ STAĆ.
                        </div>
                    </TextFade>
                </div>
            </div>
            <div id="videos" ref={vidRef} className="min-h-[100%]">
                <VideoProducts
                    videoProducts={videoProducts.filter((product) =>
                        product.type.includes('extend'),
                    )}
                    productTypes={productTypes}
                    addProductToProductList={addProductToProductList}
                    title="Plany treningowe"
                    description="Niezależnie od tego, czy dopiero zaczynasz swoją przygodę z
                    kalisteniką, czy masz już solidne doświadczenie – mamy coś
                    dla Ciebie! Nasz zestaw nagrań video został stworzony z
                    myślą o trzech poziomach zaawansowania, dzięki czemu możesz
                    trenować skutecznie, bezpiecznie i z realnymi efektami."
                />
            </div>
            <div className="flex flex-row w-full pt-35 pb-10 bg-[oklch(0.13_0.03_246.56)] shadow-2xl">
                <div className="w-1/2 bg-[oklch(0.13_0.03_246.56)] text-white">
                    <TextFade className="p-10">
                        <div className="text-3xl p-3 w-full prose prose-stone prose-invert indent-8 text-justify">
                            CYTATY
                        </div>
                    </TextFade>
                </div>
                <BackgroundOnScroll
                    backgroundImageUrl="/kalintro03.jpg"
                    className="w-[70vw] h-200"
                    bgClassName=""
                />
            </div>
            <div
                id="videosLevels"
                ref={vidLevelsRef}
                className="min-h-[100%] pb-30"
            >
                <VideoProducts
                    videoProducts={levelTrainings}
                    productTypes={productTypes}
                    addProductToProductList={addProductToProductList}
                    title="Plany treningowe - poziomy zaawasnowania"
                    description="Niezależnie od tego, czy dopiero zaczynasz swoją przygodę z
                    kalisteniką, czy masz już solidne doświadczenie – mamy coś
                    dla Ciebie! Nasz zestaw nagrań video został stworzony z
                    myślą o trzech poziomach zaawansowania, dzięki czemu możesz
                    trenować skutecznie, bezpiecznie i z realnymi efektami."
                />
            </div>
            <div className="flex flex-row w-full bg-[oklch(0.13_0.03_246.56)] pt-10 pb-20">
                <BackgroundOnScroll
                    backgroundImageUrl="/kalintro01.jpg"
                    className="w-[70vw] h-200"
                    bgClassName=""
                />
                <div className="w-1/2 text-white">
                    <TextFade className="p-10 h-full flex justify-center items-center">
                        <div className="text-3xl p-3 w-full prose prose-stone prose-invert indent-8 text-justify">
                            CYTATY
                        </div>
                    </TextFade>
                </div>
            </div>
            <div
                className="pt-40 mb-10 ml-15 font-semibold text-4xl"
                ref={additionalActivities}
                id="activities"
            >
                Trening personalny szkolenia, obozy
            </div>
            <div
                className="relative w-auto h-auto flex flex-row flex-wrap shadow-2xl"
                id="photos"
            >
                <div className="w-1/2">
                    <img src="/img1.jpg" className="h-full" />
                </div>
                <div className="w-1/2">
                    <img src="/img2.jpg" />
                </div>
                <div className="w-1/2">
                    <img src="/intro2.jpg" />
                </div>
                <div className="w-1/2 -mt-10">
                    <img src="/intro3.jpg" />
                </div>
                <div className="absolute w-1/2 bottom-0 right-0">
                    <img src="/kal8.jpg" />
                </div>
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
