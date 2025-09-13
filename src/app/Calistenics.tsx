import TextFade from "../pages/components/Fade/FadeChildComponents";
import BackgroundOnScroll from "../pages/components/Fade/BackgroundOnScroll/BackgroundOnScroll";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import LoginForm from "../pages/components/login-form";
import RegisterForm from "../pages/components/register-form";
import { useEffect, useMemo, useRef, useState } from "react";
import { useUser } from "../context/userContext";
import Cart from "../pages/components/Cart/Cart";
import useUserHook from "../hooks/useUser";
import Gallery6 from "../pages/components/gallery6";
import { useCalistenics } from "../hooks/useCalistenics";
import VideoProducts from "../pages/components/VideoProducts";
import type { ProductType } from "@/api/produktApi";
import Menu from "../pages/components/Menu/Menu";
import Footer2 from "../pages/components/footer2";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Calistenics() {
  const [isLogin, setIsLogin] = useState(true);
  const { clearUser } = useUser();
  const randTriggered = useRef(false);
  const { loginFn, registerFn, googleAuth, loginError, registerError, logged } =
    useUserHook();
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
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

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
      ref.scrollIntoView({ behavior: "smooth" });
    }
  };

  const settings = [
    { title: "Strona główna", href: "#home", ref: homeRef.current },
    { title: "Treningi", href: "#videos", ref: vidRef.current },
    {
      title: "Treningi poziomy",
      href: "#videosLevels",
      ref: vidLevelsRef.current,
    },
    {
      title: "Dodatkowe usługi",
      href: "#activities",
      ref: additionalActivities.current,
    },
    { title: "Produkty", href: "#products", ref: prodRef.current },
    { title: "Kontakt", href: "#footer", ref: footerRef.current },
  ];

  const levelTrainings = useMemo(() => {
    const vidLvlProd = videoProducts.filter((product) =>
      product.type.includes("levels"),
    );
    const sortedProducts = vidLvlProd.sort(
      (a, b) => Number(a.type.split("-")[2]) - Number(b.type.split("-")[2]),
    );

    return sortedProducts;
  }, [videoProducts]);

  const productsCount = useMemo(
    () => productListCart?.products.length ?? 0,
    [productListCart],
  );

  return (
    <div className="h-svh relative">
      <div
        id="header"
        className={`flex flex-row flex-wrap lg:flex-nowrap lg:justify-between lg:items-center lg:h-35 fixed top-0 left-0 w-full z-60 shadow-xl bg-black h-[20vh]`}
      >
        <a
          href="#home"
          className="flex flex-col justify-start lg:w-1/4 w-1/3 lg:h-full h-[10vh]"
          onClick={(e) => handleScroll(e, homeRef.current)}
        >
          <Image
            src={"/logo.jpg"}
            className="lg:h-24 lg:w-40 bg-transparent lg:ml-10"
            width={500}
            height={500}
            alt="/placeholder.png"
          />
        </a>
        <div className="flex flex-col lg:w-2/4 w-2/3 pr-3 lg:pr-0 justify-around lg:items-center lg:h-full h-[10vh]">
          <Image
            src={"/text.jpg"}
            className="object-contain w-full h-1/2"
            width={400}
            height={200}
            alt="/placeholder.png"
          />
        </div>
        <div className="flex flex-row lg:w-1/4 w-[100vw] lg:justify-end justify-between items-center lg:gap-20">
          {logged ? (
            <Button
              onClick={() => {
                clearUser();
                handleDialogOpenChange(false);
              }}
              className="ml-3 lg:ml-0"
              disabled={menuOpen}
            >
              Wyloguj się
            </Button>
          ) : (
            <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
              <DialogTrigger asChild>
                <Button
                  className="ml-3 lg:ml-0"
                  variant="outline"
                  disabled={menuOpen}
                >
                  Zaloguj się
                </Button>
              </DialogTrigger>
              <DialogTitle hidden />
              <DialogContent className="w-[100vw] lg:w-[30vw] z-80">
                {isLogin ? (
                  <LoginForm
                    loginFn={loginFn}
                    signupFn={signupFn}
                    googleAuth={googleAuth}
                    error={loginError}
                    className="w-[80vw] lg:w-auto"
                  />
                ) : (
                  <RegisterForm registerFn={registerFn} error={registerError} />
                )}
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline" onClick={() => setIsLogin(true)}>
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
              disabled={menuOpen}
            />
          )}
          <Menu settings={settings} setMenuOpen={setMenuOpen} />
        </div>
      </div>
      <div
        id="home"
        ref={homeRef}
        className="flex lg:flex-row flex-col h-[100vh] lg:h-auto w-full pt-[20vh] lg:pt-35 pb-10 bg-[oklch(0.13_0.03_246.56)] shadow-2xl"
      >
        <BackgroundOnScroll
          backgroundImageUrl="/kalintro02.jpg"
          className="w-[70vw] lg:h-200 h-80 w-full"
          bgClassName=""
        />
        <div className="lg:w-1/2 text-white">
          <TextFade className="lg:p-10 h-full flex justify-center lg:items-center">
            <div className="lg:text-3xl text-2xl p-3 w-full prose prose-stone prose-invert lg:indent-8 lg:text-justify">
              NIE MUSISZ BYĆ SILNYM ŻEBY ZACZĄĆ TRENOWAĆ, ALE MUSISZ ZACZĄĆ BY
              SILNYM SIĘ STAĆ.
            </div>
          </TextFade>
        </div>
      </div>
      <div id="videos" ref={vidRef} className="min-h-[100%]">
        <VideoProducts
          videoProducts={videoProducts.filter((product) =>
            product.type.includes("extend"),
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
      <div className="flex lg:flex-row flex-col-reverse h-[100vh] lg:h-auto w-full py-10 bg-[oklch(0.13_0.03_246.56)] shadow-2xl">
        <div className="lg:w-1/2 bg-[oklch(0.13_0.03_246.56)] text-white">
          <TextFade className="lg:p-10">
            <div className="lg:text-3xl text-2xl p-3 w-full prose prose-stone prose-invert lg:indent-8 lg:text-justify">
              CYTATY
            </div>
          </TextFade>
        </div>
        <BackgroundOnScroll
          backgroundImageUrl="/kalintro03.jpg"
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
      <div className="flex lg:flex-row flex-col h-[100vh] lg:h-auto w-full bg-[oklch(0.13_0.03_246.56)] pt-10 pb-20">
        <BackgroundOnScroll
          backgroundImageUrl="/kalintro01.jpg"
          className="w-[70vw] lg:h-200 h-80 w-full"
          bgClassName=""
        />
        <div className=":lgw-1/2 text-white">
          <TextFade className="lg:p-10 h-full flex justify-center items-center">
            <div className="lg:text-3xl text-2xl p-3 w-full prose prose-stone prose-invert lg:indent-8 lg:text-justify">
              SZEROKOŚĆ ZDJECIA ZALEŻNA OD ILOSCI TEKSTU i SZEROKOSCI ZDJECIA
            </div>
          </TextFade>
        </div>
      </div>
      <div
        className="lg:pt-40 pt-10 pt-3 lg:mb-10 mb-2 lg:ml-15 ml-3 font-semibold lg:text-4xl text-2xl"
        ref={additionalActivities}
        id="activities"
      >
        Trening personalny szkolenia, obozy
      </div>
      <div
        className="relative w-auto h-auto flex lg:flex-row flex-col flex-wrap shadow-2xl"
        id="photos"
      >
        <div className="lg:w-1/2">
          <Image
            src="/img1.jpg"
            className="h-full"
            width={1000}
            height={500}
            alt="/placeholder.png"
          />
        </div>
        <div className="lg:w-1/2">
          <Image
            src="/img2.jpg"
            width={1000}
            height={500}
            alt="/placeholder.png"
          />
        </div>
        <div className="lg:w-1/2">
          <Image
            src="/intro2.jpg"
            width={1000}
            height={500}
            alt="/placeholder.png"
          />
        </div>
        <div className="lg:w-1/2 lg:-mt-10">
          <Image
            src="/intro3.jpg"
            width={1000}
            height={500}
            alt="/placeholder.png"
          />
        </div>
        <div className="lg:absolute lg:w-1/2 bottom-0 right-0">
          <Image
            src="/kal8.jpg"
            width={1000}
            height={500}
            alt="/placeholder.png"
          />
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
