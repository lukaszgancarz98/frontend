import type {
    DisplayProductType,
    DisplaySize,
} from '../../../pages/components/Cart/Cart';
import type { ProductType } from '../../../api/produktApi';
import DisplayProduct from '../../../pages/components/Cart/DisplayProduct';
import DisplayProductVideo from '../../../pages/components/Cart/DisplayProductVideo';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@radix-ui/react-dialog';
import {
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogTitle,
} from '@/components/ui/dialog';
import LoginForm from '@/pages/components/login-form';
import RegisterForm from '@/pages/components/register-form';
import useUserHook from '@/hooks/useUser';
import { updateOrder } from '@/api/orderApi';

type PaymentCartProps = {
    products: DisplayProductType[];
    allProducts: ProductType[];
    func: {
        deleteFromCart: (id: string) => void;
        deleteWholeProduct: (products: DisplaySize[]) => void;
        addToCard: (id: string) => void;
    };
    deliveryPrice: number;
    price: number;
    order: string;
};

export default function PaymentCart({
    products,
    allProducts,
    func,
    deliveryPrice,
    price,
    order,
}: PaymentCartProps) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const fullPrice = useMemo(() => {
        return (price + deliveryPrice)?.toFixed(2).replace('.', ',');
    }, [price, deliveryPrice]);

    const {
        loginFn,
        registerFn,
        googleAuth,
        loginError,
        registerError,
        logged,
        clearUser,
        user,
    } = useUserHook();

    const signupFn = () => {
        setIsLogin(false);
    };

    const loginFunction = async (e: React.FormEvent<HTMLFormElement>) => {
        const resp = await loginFn(e);

        if (resp?.email) {
            const response = await updateOrder({
                id: order,
                email: resp.email,
            });

            if (!response.isValid && !response.data) {
                clearUser();

                return;
            }
        }
    };

    const registerFunction = async (e: React.FormEvent<HTMLFormElement>) => {
        const resp = await registerFn(e);

        if (resp?.email) {
            const response = await updateOrder({
                id: order,
                email: resp.email,
            });

            if (!response.isValid && !response.data) {
                clearUser();

                return;
            }
        }
    };

    const handleDialogOpenChange = (open: boolean) => {
        setDialogOpen(open);
        if (!open) {
            setIsLogin(true);
        }
    };

    useEffect(() => {
        if (logged) {
            setDialogOpen(!logged);
        }
    }, [logged]);

    return (
        <div className="flex flex-col">
            {!user?.email && (
                <div className="flex flex-row gap-1 stext-sm pt-2 pl-2">
                    Masz już konto?{' '}
                    <div
                        className="text-blue underline decoration-solid hover:text-blue-600"
                        onClick={() => setDialogOpen(true)}
                    >
                        Zaloguj się
                    </div>{' '}
                    i śledź zamówienie
                </div>
            )}
            <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
                <DialogTitle hidden />
                <DialogContent className="w-[100vw] lg:w-[30vw] z-80">
                    {isLogin ? (
                        <LoginForm
                            loginFn={loginFunction}
                            signupFn={signupFn}
                            googleAuth={googleAuth}
                            error={loginError}
                            className="w-[80vw] lg:w-auto"
                        />
                    ) : (
                        <RegisterForm
                            registerFn={registerFunction}
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
            <div className="flex flex-col gap-3">
                <div className="text-xl font-semibold pl-5 pt-3">
                    Podsumowanie
                </div>
                <div className="flex w-full justify-between px-10">
                    <div className="">Koszty produktów</div>
                    <div>{price?.toFixed(2).replace('.', ',')} zł</div>
                </div>
                <div className="flex w-full justify-between px-10">
                    <div>Koszty przesyłki</div>
                    <div>{deliveryPrice?.toFixed(2).replace('.', ',')} zł</div>
                </div>
                <div className="flex w-full justify-between px-10 font-bold text-lg pb-5">
                    <div>Razem</div>
                    <div>{fullPrice} zł</div>
                </div>
            </div>
            <div className="border-t-2">
                <div className="text-xl font-semibold pl-5 py-5">
                    Twoje zamówienie
                </div>
                {products?.map((product) => {
                    const parent = allProducts.find(
                        (item) => item.id === product?.productId,
                    );

                    if (parent && parent.category === 'clothes') {
                        return (
                            <div className="px-5" key={product.id}>
                                <DisplayProduct
                                    product={product}
                                    parentProduct={parent}
                                    functions={func}
                                />
                            </div>
                        );
                    } else if (parent && parent.category.includes('video')) {
                        return (
                            <div className="px-5" key={product.id}>
                                <DisplayProductVideo
                                    product={product}
                                    parentProduct={parent}
                                    functions={func}
                                />
                            </div>
                        );
                    }
                    return null;
                })}
            </div>
        </div>
    );
}
