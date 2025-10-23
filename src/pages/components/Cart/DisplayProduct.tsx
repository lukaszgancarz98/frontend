import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import type { ProductType } from '../../../api/produktApi';
import type { DisplayProductType, DisplaySize } from './Cart';
import Image from 'next/image';

type DispalyProductProps = {
    product: DisplayProductType;
    parentProduct: ProductType;
    functions: {
        deleteFromCart: (id: string) => void;
        deleteWholeProduct: (products: DisplaySize[]) => void;
        addToCard: (id: string) => void;
    };
};

export default function DisplayProduct({
    product,
    parentProduct,
    functions,
}: DispalyProductProps) {
    const url = product?.images[0]?.url;

    return (
        <div className="flex flex-col  border rounded-lg mb-2 p-2">
            <div className="flex flex-row pt-2 px-2">
                <Image
                    className="h-26 w-26 rounded-lg bg-top object-contain min-w-24 min-h-24"
                    src={url as string}
                    alt="/palceholder.png"
                    width={50}
                    height={50}
                    unoptimized
                />
                <div className="pl-2 flex flex-row w-full justify-between">
                    <div>
                        <p className="pt-1 font-bold">{parentProduct?.name}</p>
                        <p className="pt-1 font-light text-xs">
                            {parentProduct?.short_description}
                        </p>
                    </div>
                    <div className="flex items-start">
                        <DeleteOutlined
                            onClick={() =>
                                functions?.deleteWholeProduct(product?.sizes)
                            }
                        />
                    </div>
                </div>
            </div>
            <div className="flex justify-between pt-5 px-2">
                <div className="flex flex-col justify-center items-center content-center">
                    <div className="font-semibold">Rozmiar</div>
                    {product?.sizes?.map((size) => {
                        return (
                            <div
                                className="h-9 flex items-center"
                                key={product?.id + size?.name}
                            >
                                <div>{size?.name}</div>
                            </div>
                        );
                    })}
                </div>
                <div className="flex flex-col">
                    <div className="font-semibold">Ilość</div>
                    {product?.sizes?.map((size) => {
                        return (
                            <div
                                className="flex flex-row justify-between items-center w-full pt-1 h-9"
                                key={product?.id + size?.id}
                            >
                                <div className="flex gap-2 border-1 border-black rounded-sm">
                                    {size?.amount === 1 ? (
                                        <DeleteOutlined
                                            onClick={() =>
                                                functions?.deleteFromCart(
                                                    size?.id,
                                                )
                                            }
                                            className="border-black border-r p-1"
                                        />
                                    ) : (
                                        <MinusOutlined
                                            onClick={() =>
                                                functions?.deleteFromCart(
                                                    size?.id,
                                                )
                                            }
                                            className="border-black border-r p-1"
                                        />
                                    )}
                                    <div className="w-10 flex items-center justify-center">
                                        {size?.amount}
                                    </div>
                                    <PlusOutlined
                                        onClick={() =>
                                            functions?.addToCard(size?.id)
                                        }
                                        className="border-black border-l p-1"
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="flex flex-col justify-end content-center items-end">
                    <div className="font-semibold">Cena</div>
                    {product?.sizes?.map((size) => {
                        return (
                            <div
                                className="h-9 flex items-center"
                                key={product?.id + size?.id + size?.price}
                            >
                                <div>
                                    {Number(size?.price * size?.amount)
                                        ?.toFixed(2)
                                        .replace('.', ',')}{' '}
                                    zł
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
