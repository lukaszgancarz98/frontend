'use client';

import Image from 'next/image';
import { useMemo } from 'react';
import Cart from '@/pages/components/Cart/Cart';
import { useCalistenics } from '@/hooks/useCalistenics';
import Link from 'next/link';
import Product from '@/pages/components/productInGallery';
import { ProductType } from '@/api/produktApi';
import { redirect, RedirectType } from 'next/navigation';

export default function Shop() {
    const {
        products,
        allProducts,
        productTypes,
        productListCart,
        cartFunctions,
        expandCart,
        updateExpanded,
    } = useCalistenics();

    const productsCount = useMemo(
        () => productListCart?.products?.length ?? 0,
        [productListCart],
    );

    const findPrice = (prod: ProductType) => {
        const firstProductType = productTypes.find(
            (item) => item.productId === prod.id,
        );

        if (firstProductType) {
            return firstProductType.price;
        }

        return 0;
    };

    const tagProducts = (tag: string) => {
        const filter = products.filter((item) =>
            item.tag?.split(':').includes(tag),
        );

        return filter;
    };

    const settings = [
        { tag: 'male', title: 'MĘSKIE' },
        { tag: 'female', title: 'DAMSKIE' },
        { tag: 'unisex', title: 'UNISEX' },
    ];

    return (
        <div>
            <div
                id="header"
                className="flex flex-row flex-wrap lg:justify-between lg:items-center lg:h-35 fixed top-0 left-0 w-full z-60 h-[20vh] bg-black"
            >
                <Link
                    href={'/'}
                    className="flex flex-col justify-center lg:w-1/4 w-1/3 lg:h-full h-[10vh]"
                >
                    <Image
                        src={'/logo.png'}
                        className="lg:h-30 lg:w-50 bg-transparent lg:ml-10"
                        width={500}
                        height={500}
                        alt="/placeholder.png"
                    />
                </Link>
                <div className="flex flex-col lg:w-2/4 w-2/3 pr-3 lg:pr-0 justify-around lg:items-center lg:h-full h-[10vh]">
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
                        <div className="pr-10">
                            <Cart
                                products={productListCart}
                                allProducts={allProducts}
                                productTypes={productTypes}
                                functions={cartFunctions}
                                expand={expandCart}
                                setExpanded={(val: boolean) =>
                                    updateExpanded(val)
                                }
                            />
                        </div>
                    )}
                </div>
            </div>
            <div className="h-screen flex flex-col pt-35 font-comic">
                {settings.map((setting, index) => {
                    const products = tagProducts(setting.tag);

                    return (
                        <div
                            key={index}
                            className="w-full h-full flex flex-col pt-10"
                        >
                            <div className="w-full text-center text-4xl font-semibold">
                                {setting.title}
                            </div>
                            <div className="flex flex-row flex-wrap">
                                {products.map((product) => {
                                    const price = findPrice(product) | 0;

                                    return (
                                        <div
                                            key={product.id}
                                            className="ml-8 lg:max-w-[400px] max-w-[90vw] w-full shadow-lg my-8 py-8 pl-4 rounded-lg"
                                            onClick={() =>
                                                redirect(
                                                    `/shop/${product.id}`,
                                                    RedirectType.push,
                                                )
                                            }
                                        >
                                            <Product
                                                product={product}
                                                price={price}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="h-[3px] w-full bg-stone-200 shadow-xl mt-10" />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
