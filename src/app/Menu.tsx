import { Dispatch, SetStateAction, useRef, useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { Button } from '@/components/ui/button';
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
import { useUser } from '@/context/userContext';
import useUserHook from '@/hooks/useUser';
import { useOrder } from '@/context/orderContext';
import { OrderType } from '@/api/orderApi';
import Link from 'next/link';

type MenuItem = { title: string; href: string; ref: HTMLDivElement | null };

type MenuProps = {
    settings: MenuItem[];
    setMenuOpen: Dispatch<SetStateAction<boolean>>;
    resetOrder: Dispatch<SetStateAction<OrderType | undefined>>;
};

export default function Menu({
    settings,
    setMenuOpen: setInfoOpenMenu,
    resetOrder,
}: MenuProps) {
    const [menuOpen, setMenuOpen] = useState(false);
    const scrollPosition = useRef(0);
    const [isLogin, setIsLogin] = useState(true);
    const { clearUser } = useUser();
    const { clearOrder } = useOrder();
    const [dialogOpen, setDialogOpen] = useState(false);
    const {
        loginFn,
        registerFn,
        googleAuth,
        loginError,
        registerError,
        logged,
    } = useUserHook();

    const signupFn = () => {
        setIsLogin(false);
    };

    const handleDialogOpenChange = (open: boolean) => {
        setDialogOpen(open);
        if (!open) {
            setIsLogin(true);
        }
    };

    const scrollBehaviourController = (
        disable: boolean,
        shouldScroll?: HTMLDivElement | null,
    ) => {
        const body = document.body;
        if (disable) {
            scrollPosition.current = window.scrollY;

            body.style.overflowY = 'hidden';
            body.style.position = 'fixed';
            body.style.top = `-${scrollPosition.current}px`;
            body.style.width = 'w-[100%]';
        } else {
            body.style.overflowY = '';
            body.style.position = '';
            body.style.top = '';
            body.style.width = 'w-[100%]';

            window.scrollTo(0, scrollPosition.current);

            if (shouldScroll) {
                shouldScroll.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    const openMenu = () => {
        const prev = menuOpen;
        setMenuOpen(!prev);
        setInfoOpenMenu(!prev);

        scrollBehaviourController(!prev);
    };

    const handleScroll = (
        e: React.MouseEvent<HTMLAnchorElement>,
        ref: HTMLDivElement | null,
    ) => {
        e.preventDefault();
        setMenuOpen(false);
        setInfoOpenMenu(false);
        scrollBehaviourController(false, ref);
    };

    const barBase =
        'absolute left-1/2 top-1/2 w-10 h-[3px] rounded-full transform -translate-x-1/2 -translate-y-1/2';

    const lineBase = 'absolute left-0 w-10 h-[3px] rounded-full transform';

    const container: Variants = {
        closed: {
            transition: { when: 'afterChildren', staggerChildren: 0.05 },
        },
        open: { transition: { when: 'beforeChildren', staggerChildren: 0.05 } },
    };

    const leftBar: Variants = {
        closed: {
            x: 20,
            y: 20,
            rotate: 45,
            width: 30,
            opacity: 0,
            transition: {
                type: 'spring',
                stiffness: 250,
                damping: 30,
                delay: 0,
            },
        },
        open: {
            x: 0,
            y: 0,
            rotate: 45,
            width: 30,
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 250,
                damping: 30,
                delay: 0.5,
            },
        },
    };

    const rightBar: Variants = {
        closed: {
            x: -20,
            y: 20,
            rotate: -45,
            width: 30,
            opacity: 0,
            transition: {
                type: 'spring',
                stiffness: 250,
                damping: 30,
                delay: 0,
            },
        },
        open: {
            x: 0,
            y: 0,
            rotate: -45,
            width: 30,
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 250,
                damping: 30,
                delay: 0.5,
            },
        },
    };

    const topLine: Variants = {
        open: {
            x: 20,
            y: 0,
            width: 30,
            opacity: 0,
            transition: {
                type: 'spring',
                stiffness: 250,
                damping: 30,
                delay: 0,
            },
        },
        closed: {
            x: 0,
            y: 0,
            width: 30,
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 250,
                damping: 30,
                delay: 0.15,
            },
        },
    };

    const middleLine: Variants = {
        open: {
            x: 20,
            y: 0,
            width: 30,
            opacity: 0,
            transition: {
                type: 'spring',
                stiffness: 250,
                damping: 30,
                delay: 0.1,
            },
        },
        closed: {
            x: 0,
            y: 0,
            width: 30,
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 250,
                damping: 30,
                delay: 0.17,
            },
        },
    };

    const bottomLine: Variants = {
        open: {
            x: 20,
            y: 0,
            width: 30,
            opacity: 0,
            transition: {
                type: 'spring',
                stiffness: 250,
                damping: 30,
                delay: 0.2,
            },
        },
        closed: {
            x: 0,
            y: 0,
            width: 20,
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 250,
                damping: 30,
                delay: 0.19,
            },
        },
    };

    return (
        <div className="fixed right-0 pb-5 lg:relative">
            <div
                className="flex flex-row lg:mr-15 mr-5 gap-2 items-center transition-all duration-300 ease-in-out hover:scale-110"
                onClick={openMenu}
            >
                <div className="text-white text-2xl">MENU</div>
                <div className="relative flex flex-col items-start justify-around w-[20px] h-[20px]">
                    <motion.div
                        className="relative w-full h-full"
                        variants={container}
                        initial="closed"
                        animate={menuOpen ? 'open' : 'closed'}
                    >
                        <motion.span
                            className={`${barBase} bg-white`}
                            variants={leftBar}
                            style={{ originX: '50%', originY: '50%' }}
                        />
                        <motion.span
                            className={`${barBase} bg-white`}
                            variants={rightBar}
                            style={{ originX: '50%', originY: '50%' }}
                        />
                        <motion.span
                            className={`${lineBase} top-0 bg-white`}
                            variants={topLine}
                        />
                        <motion.span
                            className={`${lineBase} top-[45%] bg-white`}
                            variants={middleLine}
                        />
                        <motion.span
                            className={`${lineBase} bottom-0 bg-white`}
                            variants={bottomLine}
                        />
                    </motion.div>
                </div>
            </div>
            {menuOpen && (
                <div
                    id="menu"
                    className="fixed lg:top-30 top-[20vh] right-0 w-[100vw] lg:h-[90vh] h-[80vh] shadow-lg z-50 flex flex-col justify-center justify-around items-center text-white"
                >
                    <div className="absolute inset-0 backdrop-blur-md bg-black/40 z-40"></div>
                    <div className="relative z-50 flex flex-col h-2/3 justify-between items-center mb-15">
                        {settings.map((item) => (
                            <a
                                href={item.href}
                                onClick={(e) => handleScroll(e, item.ref)}
                                className="hover:text-blue-500 px-3 py-2 text-2xl font-medium transition duration-300 hover:scale-150"
                                key={item.title}
                            >
                                {item.title}
                            </a>
                        ))}
                        {logged ? (
                            <Link
                                className="ml-3 lg:ml-0 px-2 py-3 bg-transparent border-none text-2xl hover:text-blue-500 hover:bg-transparent font-medium transition duration-300 hover:scale-150"
                                href={'/user/orders'}
                            >
                                ZAMÓWIENIA
                            </Link>
                        ) : (
                            <Link
                                className="ml-3 lg:ml-0 px-2 py-3 bg-transparent border-none text-2xl hover:text-blue-500 hover:bg-transparent font-medium transition duration-300 hover:scale-150"
                                href={'/order'}
                            >
                                ZAMÓWIENIA
                            </Link>
                        )}
                        {logged ? (
                            <Button
                                onClick={() => {
                                    clearUser();
                                    clearOrder();
                                    resetOrder(undefined);
                                    handleDialogOpenChange(false);
                                }}
                                className="ml-3 lg:ml-0 bg-transparent border-none hover:bg-transparent"
                            >
                                <div className="text-2xl transition duration-300 hover:scale-150 hover:text-blue-500">
                                    WYLOGUJ SIĘ
                                </div>
                            </Button>
                        ) : (
                            <Dialog
                                open={dialogOpen}
                                onOpenChange={handleDialogOpenChange}
                            >
                                <DialogTrigger asChild>
                                    <Button
                                        className="ml-3 lg:ml-0 bg-transparent border-none hover:bg-transparent"
                                        variant="outline"
                                    >
                                        <div className="text-2xl transition duration-300 hover:scale-150 hover:text-blue-500">
                                            ZALOGUJ SIĘ
                                        </div>
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
                    </div>
                </div>
            )}
        </div>
    );
}
