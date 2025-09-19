import pkg from 'lodash';
import type { ProductType } from '../../api/produktApi';
import Image from 'next/image';

const { isEmpty } = pkg;
type Product = ProductType;

type ProductProps = { product: ProductType; price: number };

export default function Product({ product, price }: ProductProps) {
    const imagesExisting = !isEmpty(product?.image);

    return (
        <div className="group flex flex-col justify-between">
            <div>
                <div className="aspect-3/2 flex overflow-clip rounded-xl">
                    <div className="flex-1 relative">
                        <div className="h-full w-full origin-bottom transition duration-300 group-hover:scale-105">
                            <Image
                                src={
                                    imagesExisting
                                        ? product?.image
                                        : '/app/img/placeholder.png'
                                }
                                alt={product?.name}
                                className="h-full w-full object-center object-contain"
                                fill
                            />
                        </div>
                        <div className="absolute top-0 right-0 mr-5 shadow-md rounded-sm px-2 py-1 text-md self-center font-medium transition duration-300 group-hover:scale-130">
                            {price?.toFixed(2).replace('.', ',')} zł
                        </div>
                    </div>
                </div>
            </div>
            <div className="mb-2 line-clamp-3 break-words pt-4 text-lg font-medium md:mb-3 md:pt-4 md:text-xl lg:pt-4 lg:text-2xl text-center">
                {product?.name}
            </div>
            {product?.description && (
                <div className="text-muted-foreground mb-8 line-clamp-2 text-sm md:mb-12 md:text-base lg:mb-9">
                    {product?.description}
                </div>
            )}
        </div>
    );
}
