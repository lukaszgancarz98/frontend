import {
    createProductAndProductTypes,
    ProductType,
    ProductTypeType,
} from '@/api/produktApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

type FormProductTypesData = {
    size: string;
    color: string;
    shortDescription: string;
    images: string;
    sizePlaceHolder: string;
    price: string;
    stock_quantity: string;
    sale_price: string;
    sale_amount: string;
};

export default function AddProduct() {
    const [productTypesAmount, setProductTypesAmount] = useState<number>(1);

    const array = useMemo(
        () => Array(productTypesAmount).fill(''),
        [productTypesAmount],
    );

    const createProduct = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const data: Partial<ProductType> = {
            name: formData.get('name') as string,
            description: formData.get('description') as string,
            image: formData.get('image') as string,
            category: formData.get('category') as string,
            page: formData.get('page') as string,
            tag: formData.get('tag') as string,
            size_image: formData.get('size_image') as string,
            file_id: formData.get('file_id') as string,
        };

        const dataTypes: FormProductTypesData[] = [];

        array.forEach((item, index) => {
            const data: FormProductTypesData = {
                size: formData.get(`size-${index}`) as string,
                color: formData.get(`color-${index}`) as string,
                shortDescription: formData.get(
                    `shortDescription-${index}`,
                ) as string,
                images: formData.get(`images-${index}`) as string,
                sizePlaceHolder: formData.get(
                    `sizePlaceHolder-${index}`,
                ) as string,
                price: formData.get(`price-${index}`) as string,
                stock_quantity: formData.get(
                    `stock_quantity-${index}`,
                ) as string,
                sale_price: formData.get(`sale_price-${index}`) as string,
                sale_amount: formData.get(`sale_amount-${index}`) as string,
            };

            dataTypes.push(data);
        });

        const productTypesDataReq = dataTypes.reduce(
            (arr: Partial<ProductTypeType>[], item) => {
                const images = item.images.split(',');
                item.size.split(',').forEach((s) => {
                    return arr.push({
                        ...item,
                        size: s,
                        price: Number(item.price),
                        images: images,
                    });
                });
                return arr;
            },
            [],
        );

        const response = await createProductAndProductTypes({
            product: data,
            productTypes: productTypesDataReq,
        });

        if (!response.isValid) {
            toast.error('Coś poszło nie tak');

            return;
        }

        if (response.isValid) {
            toast.info('Dodano produkt i podprodukty');
        }
    };

    return (
        <div className="w-full">
            <form
                className="w-full flex flex-col justify-end items-end"
                onSubmit={(e) => createProduct(e)}
            >
                <div className="w-full text-center text-3xl pt-5 pb-5">
                    Produkt
                </div>
                <div className="flex flex-col gap-6 w-full">
                    <div className="flex lg:flex-row flex-col gap-5 mx-5">
                        <div className="grid gap-3 w-full">
                            <Label htmlFor="name">Nazwa*</Label>
                            <Input id="name" name="name" type="text" required />
                        </div>
                        <div className="grid gap-3 w-full">
                            <Label htmlFor="description">Opis główny</Label>
                            <Input
                                id="description"
                                type="text"
                                name="description"
                            />
                        </div>
                        <div className="grid gap-3 w-full">
                            <Label htmlFor="image">Scieżka do zdjęcia*</Label>
                            <Input
                                id="image"
                                type="text"
                                name="image"
                                required
                            />
                        </div>
                        <div className="grid gap-3 w-full">
                            <Label htmlFor="category">Kategoria*</Label>
                            <Input
                                id="category"
                                type="text"
                                name="category"
                                required
                            />
                        </div>
                    </div>
                    <div className="flex lg:flex-row flex-col gap-5 mx-5">
                        <div className="grid gap-3 w-full">
                            <Label htmlFor="page">Strona*</Label>
                            <Input id="page" type="text" name="page" required />
                        </div>
                        <div className="grid gap-3 w-full">
                            <Label htmlFor="tag">Tagi</Label>
                            <Input id="tag" type="text" name="tag" />
                        </div>
                        <div className="grid gap-3 w-full">
                            <Label htmlFor="size_image">
                                Zdjęcie rozmiarówki (ścieżka)
                            </Label>
                            <Input
                                id="size_image"
                                type="text"
                                name="size_image"
                            />
                        </div>
                        <div className="grid gap-3 w-full">
                            <Label htmlFor="file_id">ID pliku</Label>
                            <Input id="file_id" type="text" name="file_id" />
                        </div>
                    </div>
                </div>
                <div className="h-1 w-full bg-stone-400 my-5" />
                <div className="flex w-full justify-center items-center gap-5 pt-10 pb-5">
                    <div className="text-3xl">Podprodukt</div>
                    <div className="flex flex-row gap-3">
                        <Button
                            onClick={() =>
                                setProductTypesAmount((prev) => prev + 1)
                            }
                        >
                            Dodaj kolor
                        </Button>
                        <Button
                            onClick={() =>
                                setProductTypesAmount((prev) => {
                                    if (prev === 1) {
                                        return prev;
                                    }

                                    return prev - 1;
                                })
                            }
                        >
                            Usuń kolor
                        </Button>
                    </div>
                </div>
                {array.map((item, index) => {
                    return (
                        <div key={index} className="flex flex-col gap-6 w-full">
                            <div className="flex lg:flex-row flex-col gap-5 mx-5">
                                <div className="grid gap-3 w-full">
                                    <Label htmlFor={`size-${index}`}>
                                        Rozmiary (np. XL,XXL)
                                    </Label>
                                    <Input
                                        id={`size-${index}`}
                                        type="text"
                                        name={`size-${index}`}
                                    />
                                </div>
                                <div className="grid gap-3 w-full">
                                    <Label htmlFor={`color-${index}`}>
                                        Kolor (typ oklch)*
                                    </Label>
                                    <Input
                                        id={`color-${index}`}
                                        type="text"
                                        name={`color-${index}`}
                                    />
                                </div>
                                <div className="grid gap-3 w-full">
                                    <Label
                                        htmlFor={`shortDescription-${index}`}
                                    >
                                        Opis podproduktu (nowa linia dodaj po
                                        zdaniu \n)*
                                    </Label>
                                    <Input
                                        id={`shortDescription-${index}`}
                                        type="text"
                                        name={`shortDescription-${index}`}
                                        required
                                    />
                                </div>
                                <div className="grid gap-3 w-full">
                                    <Label htmlFor={`images-${index}`}>
                                        Zdjęcia (ścieżki np.
                                        /clothes/fota.jpg,/clothesfota2.jpg)
                                    </Label>
                                    <Input
                                        id={`images-${index}`}
                                        type="text"
                                        name={`images-${index}`}
                                    />
                                </div>
                            </div>

                            <div className="flex lg:flex-row flex-col gap-5 mx-5">
                                <div className="grid gap-3 w-full">
                                    <Label htmlFor={`sizePlaceHolder-${index}`}>
                                        Rozmiarówka placeholder (jeżeli nie ma
                                        rozmiarów)
                                    </Label>
                                    <Input
                                        id={`sizePlaceHolder-${index}`}
                                        type="text"
                                        name={`sizePlaceHolder-${index}`}
                                    />
                                </div>
                                <div className="grid gap-3 w-full">
                                    <Label htmlFor={`price-${index}`}>
                                        Cena*
                                    </Label>
                                    <Input
                                        id={`price-${index}`}
                                        name={`price-${index}`}
                                        type="number"
                                        required
                                    />
                                </div>
                                <div className="grid gap-3 w-full">
                                    <Label htmlFor={`stock_quantity-${index}`}>
                                        Ilość produktu*
                                    </Label>
                                    <Input
                                        id={`stock_quantity-${index}`}
                                        type="text"
                                        name={`stock_quantity-${index}`}
                                        required
                                    />
                                </div>
                                <div className="grid gap-3 w-full">
                                    <Label htmlFor={`sale_price-${index}`}>
                                        Cena na wyprzedaży
                                    </Label>
                                    <Input
                                        id={`sale_price-${index}`}
                                        type="text"
                                        name={`sale_price-${index}`}
                                    />
                                </div>
                                <div className="grid gap-3 w-full">
                                    <Label htmlFor={`sale_amount-${index}`}>
                                        Ilość na wyprzedaży
                                    </Label>
                                    <Input
                                        id={`sale_amount-${index}`}
                                        type="text"
                                        name={`sale_amount-${index}`}
                                    />
                                </div>
                            </div>
                            <div className="h-1 w-full bg-stone-400 my-5" />
                        </div>
                    );
                })}

                <div className="w-fit pt-3">
                    <Button className="w-fit">Zapisz</Button>
                </div>
            </form>
        </div>
    );
}
