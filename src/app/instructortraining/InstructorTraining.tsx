'use client';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogTitle,
} from '@/components/ui/dialog';
import TextFade from '@/pages/components/Fade/FadeChildComponents';
import Footer2 from '@/pages/components/footer2';
import Kontakt from '@/pages/components/Kontakt';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export default function InstructorTraining() {
    const basicRef = useRef<HTMLDivElement>(null);
    const advancedRef = useRef<HTMLDivElement>(null);
    const mentoringRef = useRef<HTMLDivElement>(null);
    const [breakPoint, setBreakPoint] = useState(false);
    const [open, setOpen] = useState<boolean>(false);

    useEffect(() => {
        const handleResize = () => {
            setBreakPoint(window.innerWidth > 1024);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleScroll = (
        e: React.MouseEvent<HTMLAnchorElement>,
        ref: HTMLDivElement | null,
    ) => {
        e.preventDefault();
        if (ref) {
            const offset = breakPoint ? 100 : 50;
            const top =
                ref.getBoundingClientRect().top + window.scrollY - offset;

            window.scrollTo({ top, behavior: 'smooth' });
        }
    };

    return (
        <div>
            <div
                id="header"
                className="flex flex-row flex-wrap lg:items-center lg:h-35 fixed top-0 left-0 w-full z-60 h-auto py-2 lg:py-0 bg-black"
            >
                <Link
                    href={'/'}
                    className="flex flex-col justify-center lg:w-1/4 w-1/3 lg:h-full h-auto"
                >
                    <Image
                        src={'/logo.png'}
                        className="lg:h-30 lg:w-50 bg-transparent lg:ml-10"
                        width={500}
                        height={500}
                        alt="/placeholder.png"
                    />
                </Link>
                <div className="flex flex-col lg:w-2/4 w-2/3 pr-3 lg:pr-0 justify-around lg:items-center lg:h-full h-auto">
                    <Image
                        src={'/text.png'}
                        className="object-contain w-full h-full"
                        width={1000}
                        height={400}
                        alt="/placeholder.png"
                    />
                </div>
            </div>
            <div className="flex flex-col items-center justify-center lg:font-comic lg:h-screen h-max lg:pt-35 pt-25">
                <div className="text-5xl font-semibold pt-5 text-center lg:w-[80%]">
                    ZOSTAŃ INSTRUKTOREM KALISTENIKI
                </div>
                <div className="text-2xl pt-5 lg:text-center text-justify w-[90%] lg:w-[80%]">
                    Trzy etapy. Jeden cel – zostać instruktorem, który potrafi
                    uczyć, inspirować i prowadzić ludzi do wyników.
                </div>
                <div className="text-2xl pt-5 lg:text-center text-justify w-[90%] lg:w-[80%]">
                    Zapomnij o suchych filmikach i monotonnych wykładach
                    on-line. Uczysz się w ruchu, na drążku, z ludźmi, którzy
                    dzielą się swoją pasją! To program dla tych, którzy chcą być
                    prawdziwymi trenerami kalisteniki – nie teoretykami, tylko
                    praktykami ze świadomością ciała, marką trenerską lub
                    własnym studio.
                </div>
                <div className="flex lg:w-[50%] w-[90vw] items-center lg:justify-evenly justify-between pt-5 text-xl font-semibold">
                    <a
                        onClick={(e) => handleScroll(e, basicRef.current)}
                        className="transition-transform hover:scale-120"
                    >
                        BASIC
                    </a>
                    <a
                        onClick={(e) => handleScroll(e, advancedRef.current)}
                        className="transition-transform hover:scale-120"
                    >
                        ADVANCED
                    </a>
                    <a
                        onClick={(e) => handleScroll(e, mentoringRef.current)}
                        className="transition-transform hover:scale-120"
                    >
                        MENTORING
                    </a>
                </div>
            </div>
            <TextFade
                ref={basicRef}
                className="lg:p-10 h-full flex justify-center lg:items-center pt-10"
            >
                <div className="flex flex-col gap-2 lg:text-3xl text-2xl p-3 w-full justify-center items-center font-medium lg:font-comic">
                    <div className="text-4xl font-semibold pt-5 text-center lg:w-[80%]">
                        BASIC – Fundamenty Trenera Kalisteniki
                    </div>
                    <div className="text-2xl font-semibold pt-5 lg:text-center text-justify w-[90%] lg:w-[80%]">
                        Zbuduj solidne podstawy, zrozum ciało i naucz się
                        prowadzić pierwsze treningi.
                    </div>
                    <div className="text-2xl font-semibold pt-5 lg:text-center text-justify w-[90%] lg:w-[80%]">
                        To start Twojej drogi jako instruktora. Na tym etapie
                        uczysz się fundamentów – jak analizować ruch, uczyć
                        poprawnej techniki i prowadzić bezpieczne, skuteczne
                        treningi. Nie ma tu suchej teorii – od pierwszego dnia
                        działasz w praktyce.
                    </div>
                    <div className="text-2xl font-semibold pt-5 lg:text-center text-start w-[90%] lg:w-[80%]">
                        W programie: <br />✅ Jak porusza się ciało –
                        praktycznie i skutecznie <br />✅ Technika i progresje
                        podstawowych ćwiczeń
                        <br />✅ Nauczanie krok po kroku i korygowanie błędów
                        <br />✅ Bezpieczeństwo, mobilność i prewencja kontuzji
                        <br />✅ Podstawy komunikacji i prowadzenia treningu
                    </div>
                    <div className="text-2xl font-semibold pt-5 text-center w-[90%] lg:w-[80%]">
                        Forma: <br />2 dni praktyki (10h intensywnych zajęć)
                        <br />
                        Mała grupa – maks. 5 osób <br />
                        Certyfikat: Instruktor Kalisteniki – BASIC <br />
                        Koszt 1100 zł
                    </div>
                    <div className="text-2xl font-semibold pt-5 lg:text-center text-justify w-[90%] lg:w-[80%]">
                        Efekt: Potrafisz prowadzić skuteczne treningi, rozumiesz
                        ciało, wiesz jak przekazywać wiedzę dalej.
                    </div>
                    <Button
                        className="bg-blue-500 mt-3 text-black hover:bg-green-400 hover:text-xl"
                        onClick={() => setOpen(true)}
                    >
                        KONTAKT
                    </Button>
                </div>
            </TextFade>
            <div className="h-[2px] bg-stone-300 shadow-xl m-2" />
            <TextFade
                ref={advancedRef}
                className="lg:p-10 h-full flex justify-center lg:items-center pt-10"
            >
                <div className="flex flex-col gap-2 lg:text-3xl text-2xl p-3 w-full justify-center items-center font-medium lg:font-comic">
                    <div className="text-4xl font-semibold pt-5 text-center lg:w-[80%]">
                        ADVANCED – Next Level Coaching
                    </div>
                    <div className="text-2xl font-semibold pt-5 lg:text-center text-justify w-[90%] lg:w-[80%]">
                        Wejdź na poziom trenera, który potrafi programować,
                        motywować i budować wyniki swoich podopiecznych
                    </div>
                    <div className="text-2xl font-semibold pt-5 lg:text-center text-justify w-[90%] lg:w-[80%]">
                        To szkolenie dla tych, którzy mają już doświadczenie w
                        treningu lub ukończyli FOUNDATION i chcą rozwinąć markę
                        trenerską lub swoje studio do treningu. Tutaj uczysz się
                        myśleć jak trener – analizować, planować i prowadzić
                        ludzi do długofalowego progresu.
                    </div>
                    <div className="text-2xl font-semibold pt-5 lg:text-center text-start w-[90%] lg:w-[80%]">
                        W programie: <br />✅ Zaawansowane metody treningowe{' '}
                        <br />✅ Praca z różnymi grupami (początkujący,
                        zaawansowani, kobiety, seniorzy) <br />✅ Komunikacja i
                        motywacja podopiecznych <br />✅ Prowadzenie zajęć w
                        praktyce – analiza i feedback <br />✅ Tworzenie
                        autorskich planów i programów treningowych
                    </div>
                    <div className="text-2xl font-semibold pt-5 text-center lg:w-[80%]">
                        Forma: <br />3 dni praktyki (6h każdego dnia) <br />
                        Prowadzenie sesji z prawdziwymi podopiecznymi <br />
                        Certyfikat: Instruktor Kalisteniki – ADVANCED <br />
                        Koszt 2100 zł
                    </div>
                    <div className="text-2xl font-semibold pt-5 lg:text-center text-justify w-[90%] lg:w-[80%]">
                        Efekt: Potrafisz prowadzić różnorodne grupy, budować
                        progresję, inspirować i działać jak profesjonalny
                        trener.
                    </div>
                    <Button
                        className="bg-blue-500 mt-3 text-black hover:bg-green-400 hover:text-xl"
                        onClick={() => setOpen(true)}
                    >
                        KONTAKT
                    </Button>
                </div>
            </TextFade>
            <div className="h-[2px] bg-stone-300 shadow-xl m-2" />
            <TextFade
                ref={mentoringRef}
                className="lg:p-10 h-full flex justify-center lg:items-center pt-10"
            >
                <div className="flex flex-col gap-2 lg:text-3xl text-2xl p-3 w-full justify-center items-center font-medium lg:font-comic">
                    <div className="text-4xl font-semibold pt-5 text-center lg:w-[80%]">
                        MENTORING – PRO COACH 1:1
                    </div>
                    <div className="text-2xl font-semibold pt-5 lg:text-center text-justify w-[90%] lg:w-[80%]">
                        Indywidualna praca nad Twoim stylem, budowanie własnej
                        marki trenerskiej, pomoc w otwarciu/rozwijaniu Twojego
                        studio do kalisteniki.
                    </div>
                    <div className="text-2xl font-semibold pt-5 text-center lg:w-[80%]">
                        To nie kurs – to współpraca.
                    </div>
                    <div className="text-2xl font-semibold pt-5 lg:text-center text-justify w-[90%] lg:w-[80%]">
                        Spotykamy się 1:1, żeby przeanalizować Twój trening,
                        sposób prowadzenia ludzi i pomóc Ci wejść na poziom PRO
                        COACH. Mentoring to dopracowanie detali, które robią
                        różnicę między „prowadzącym trening” a prawdziwym
                        coachem.
                    </div>
                    <div className="text-2xl font-semibold pt-5 lg:text-center text-start w-[90%] lg:w-[80%]">
                        W ramach mentoringu: <br />✅ Analiza Twoich treningów,
                        komunikacji i stylu pracy <br />✅ Personalne wskazówki
                        metodyczne i techniczne <br />✅ Pomoc w budowie marki
                        trenerskiej i oferty <br />✅ Strategia rozwoju Twojej
                        kariery trenerskiej <br />✅ Pełne wsparcie 1:1
                    </div>
                    <div className="text-2xl font-semibold pt-5 text-center lg:w-[80%]">
                        Forma: <br />
                        Indywidualne sesje (na sali lub w plenerze)
                        <br />
                        Elastyczny harmonogram dopasowany do Ciebie <br />
                        Certyfikat: PRO COACH CALISTHENICS <br />
                        Koszt – Oferta dopasowana indywidualnie. Skontaktuj się
                        !
                    </div>
                    <div className="text-2xl font-semibold pt-5 lg:text-center text-justify w-[90%] lg:w-[80%]">
                        Efekt: Stajesz się trenerem z własnym stylem, pewnością
                        siebie i kierunkiem. Nie powielasz – tworzysz.
                    </div>
                    <Button
                        className="bg-blue-500 mt-3 text-black hover:bg-green-400 hover:text-xl"
                        onClick={() => setOpen(true)}
                    >
                        KONTAKT
                    </Button>
                </div>
            </TextFade>
            <Dialog
                open={open}
                onOpenChange={() => {
                    if (open) {
                        setOpen((prev) => !prev);
                    }
                }}
            >
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
            <div id="footer" className="w-[100%] pt-20">
                <Footer2 />
            </div>
        </div>
    );
}
