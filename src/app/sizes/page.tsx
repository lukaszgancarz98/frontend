'use client';

import Link from 'next/link';
import Footer2 from '../../pages/components/footer2';

export default function sizePhotos() {
    const containerClass =
        'flex flex-col w-1/2 justify-center items-center border mx-20 py-5 rounded-lg mt-10 shadow-lg';

    const linkContainer = 'text-blue-600 hover:text-blue-900 hover:underline';

    const scrollToCenter = (
        event: React.MouseEvent<HTMLAnchorElement>,
        id: string,
    ) => {
        event.preventDefault();
        const el = document.getElementById(id);
        el?.scrollIntoView({
            behavior: 'smooth',
            block: 'center', // center vertically
        });
    };

    return (
        <div>
            <div
                id="header"
                className={`flex flex-row justify-between items-center h-35 fixed top-0 left-0 w-full z-60 shadow-xl bg-black transition-all duration-1000 ease-in-out`}
            >
                <Link href="/" className="flex flex-col justify-start w-1/4">
                    <img
                        src={'/logo.jpg'}
                        className="h-24 w-40 bg-transparent ml-10"
                    />
                </Link>
                <div className="flex flex-col w-2/4 justify-around items-center h-full">
                    <img
                        src={'/text.jpg'}
                        className="object-contain w-full h-1/2"
                    />
                </div>
                <div className="w-1/4" />
            </div>
            <div className="pt-40 flex flex-col flex-wrap justify-center items-center gap-10 pb-10">
                <div className="w-1/2 text-center text-4xl pb-5 font-bold">
                    Rozmiary
                </div>
                <div className="flex flex-row justify-center items-center gap-10 pb-10">
                    <a
                        onClick={(e) => scrollToCenter(e, 'shirt')}
                        className={linkContainer}
                    >
                        Koszulka
                    </a>
                    <a
                        onClick={(e) => scrollToCenter(e, 'premiumshirt')}
                        className={linkContainer}
                    >
                        Koszulka premium
                    </a>
                    <a
                        onClick={(e) => scrollToCenter(e, 'blouse')}
                        className={linkContainer}
                    >
                        Bluza
                    </a>
                    <a
                        onClick={(e) => scrollToCenter(e, 'stanleystella')}
                        className={linkContainer}
                    >
                        Bluza stanley Stella
                    </a>
                    <a
                        onClick={(e) => scrollToCenter(e, 'sweatpants')}
                        className={linkContainer}
                    >
                        Spodnie dresowe
                    </a>
                    <a
                        onClick={(e) => scrollToCenter(e, 'cap')}
                        className={linkContainer}
                    >
                        Czapka
                    </a>
                </div>
                <div className={containerClass} id="shirt">
                    <div className="text-xl font-semibold pb-5">Koszulka</div>
                    <div className="flex flxe-row gap-10 justify-around items-center">
                        <img
                            src="/clothes/sizes/koszulkizwykle1.jpg"
                            className="object-center h-full"
                        />
                        <img src="/clothes/sizes/koszulkizwykle2.jpg" />
                    </div>
                </div>
                <div className={containerClass} id="premiumshirt">
                    <div className="text-xl font-semibold pb-5">
                        Koszulka premium
                    </div>
                    <div className="flex flxe-row gap-10 justify-around items-center">
                        <img
                            src="/clothes/sizes/koszulkapremium1.jpg"
                            className="object-center h-full"
                        />
                        <img src="/clothes/sizes/koszulkapremium2.jpg" />
                    </div>
                </div>
                <div className={containerClass} id="blouse">
                    <div className="text-xl font-semibold pb-5">Bluza</div>
                    <div className="flex flxe-row gap-10 justify-around items-center">
                        <img
                            src="/clothes/sizes/bluzakhaki1.jpg"
                            className="object-center h-full"
                        />
                        <img src="/clothes/sizes/bluzakhaki2.jpg" />
                    </div>
                </div>
                <div className={containerClass} id="stanleystella">
                    <div className="text-xl font-semibold pb-5">
                        Bluza Stanley Stella
                    </div>
                    <div className="flex flxe-row gap-10 justify-around items-center">
                        <img
                            src="/clothes/sizes/bluzastanleystella1.jpg"
                            className="object-center h-full"
                        />
                        <img src="/clothes/sizes/bluzastanleystella2.jpg" />
                    </div>
                </div>
                <div className={containerClass} id="sweatpants">
                    <div className="text-xl font-semibold pb-5">
                        Spodnie dresowe
                    </div>
                    <div className="flex flxe-row gap-10 justify-around items-center">
                        <img
                            src="/clothes/sizes/drespodnie1.jpg"
                            className="object-center h-full"
                        />
                        <img src="/clothes/sizes/drespodnie2.jpg" />
                    </div>
                </div>
                <div className={containerClass} id="cap">
                    <div className="text-xl font-semibold pb-5">Czapka</div>
                    <div className="flex flxe-row gap-10 justify-around items-center">
                        <img src="/clothes/sizes/czapkaopis.jpg" />
                    </div>
                </div>
            </div>
            <Footer2 />
        </div>
    );
}
