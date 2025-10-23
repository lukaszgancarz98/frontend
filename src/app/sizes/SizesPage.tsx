'use client';

import Link from 'next/link';
import Footer2 from '../../pages/components/footer2';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getAllProducts, ProductType } from '@/api/produktApi';

export default function SizesPage() {
    const [products, setProducts] = useState<ProductType[]>();
    const containerClass =
        'flex flex-col lg:w-1/2 justify-center items-center border mx-1 lg:mx-20 py-5 rounded-lg mt-10 shadow-lg';

    const linkContainer = 'text-blue-600 hover:text-blue-900 hover:underline';
    const picturesContainer =
        'flex flex-col lg:flex-row gap-10 justify-around items-center';

    const scrollToCenter = (
        event: React.MouseEvent<HTMLAnchorElement>,
        id: string,
    ) => {
        event.preventDefault();
        const el = document.getElementById(id);
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    const fetchProducts = async () => {
        const response = await getAllProducts();

        if (response.isValid && response.data) {
            const filter = response.data.filter((item) =>
                item.category.includes('clothes'),
            );
            setProducts(filter);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <div>
            <div
                id="header"
                className={`flex flex-row lg:justify-between items-center lg:h-35 fixed top-0 left-0 w-full z-60 shadow-xl bg-black h-[15vh]`}
            >
                <Link href="/" className="flex flex-col justify-start w-1/4">
                    <Image
                        src={'/logo.png'}
                        className="lg:h-24 h-18 w-40 bg-transparent lg:ml-10"
                        alt="/placeholder.png"
                        width={1000}
                        height={1000}
                    />
                </Link>
                <div className="flex flex-col lg:w-2/4 w-3/4 justify-around items-center h-full">
                    <Image
                        src={'/text.png'}
                        className="object-contain lg:w-full h-1/2"
                        alt="/placeholder.png"
                        width={1000}
                        height={200}
                    />
                </div>
                <div className="lg:w-1/4" />
            </div>
            <div className="pt-40 flex flex-col flex-wrap lg:justify-center lg:items-center gap-10 w-[100%] pb-10">
                <div className="lg:w-1/2 text-center text-4xl pb-5 font-bold">
                    Rozmiary
                </div>
                <div className="flex flex-row flex-wrap lg:w-[70vw] justify-center items-center gap-5 lg:gap-10 lg:pb-10">
                    {products?.map((product) => (
                        <a
                            key={product.name}
                            onClick={(e) => scrollToCenter(e, product.id)}
                            className={linkContainer}
                        >
                            {product.name}
                        </a>
                    ))}
                </div>
                {products?.map((product) => (
                    <div
                        className={containerClass}
                        id={product.id}
                        key={product.id}
                    >
                        <div className="text-xl font-semibold pb-5">
                            {product.name}
                        </div>
                        <div className={picturesContainer}>
                            <Image
                                src={product.size_image?.url as string}
                                className="object-center h-full"
                                alt="/placeholder.png"
                                width={500}
                                height={500}
                                unoptimized
                            />
                        </div>
                    </div>
                ))}
            </div>
            <Footer2 />
        </div>
    );
}
