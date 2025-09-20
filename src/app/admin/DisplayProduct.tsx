import {
    deleteProductAndProductTypes,
    ProductType,
    ProductTypeType,
    updateProduct,
    updateProductTypes,
} from '@/api/produktApi';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { FormProductTypesData } from './AddProduct';
import { isEmpty } from 'lodash';

type DisplayProductProps = {
    product: ProductType;
    productTypes: ProductTypeType[];
};

type Sizes = { sizes: string; color: string };

export default function DisplayProduct({
    product,
    productTypes,
}: DisplayProductProps) {
    const [edit, setIsEdited] = useState<boolean>();
    const [productData, setProductData] = useState<ProductType>(product);
    const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
    const [productTypesData, setProductsTypesData] =
        useState<ProductTypeType[]>(productTypes);
    const [sizes, setSizes] = useState<Sizes[]>();

    const updateProductReq = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const response = await updateProduct(productData);

        if (!response.isValid) {
            toast.error(
                'Kurwa co się dziejeeeeeeeee (coś się zjebało i nie zedytowało)',
            );

            return;
        }

        const responseTypes = await updateProductTypes({
            productTypes: productTypesData,
        });

        if (!responseTypes.isValid) {
            toast.error(
                'Kurwa co się dziejeeeeeeeee (coś się zjebało i nie zedytowało)',
            );

            return;
        }

        if (response.isValid) {
            toast.info('Udana edycja');
            setIsEdited(false);
        }
    };

    const prepareProductTypesForEdit = useMemo(() => {
        const newArr = productTypesData?.reduce(
            (arr: FormProductTypesData[], item) => {
                const exist = arr.findIndex(
                    (arrItem) => arrItem.color === item.color,
                );

                if (exist === -1) {
                    arr.push({
                        size: item.size,
                        color: item.color,
                        images: item.images?.toString(),
                        size_placeholder: item.size_placeholder,
                        price: item.price.toString(),
                        stock_quantity: item.stock_quantity,
                        sale_price: item.sale_price,
                        sale_amount: item.sale_amount,
                    });

                    return arr;
                }

                arr[exist].size += `,${item.size}`;

                return arr;
            },
            [],
        );

        const getLightness = (color: string) => {
            const match = color.match(/oklch\(([^,]+)/);
            return match ? parseFloat(match[1]) : 0;
        };

        if (isEmpty(sizes)) {
            const sizesArr: Sizes[] = [];
            newArr.forEach((arr) =>
                sizesArr?.push({ sizes: arr.size, color: arr.color }),
            );

            setSizes(sizesArr);
        }

        const sorted = newArr?.sort(
            (a, b) => getLightness(a.color) - getLightness(b.color),
        );

        return sorted;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productTypesData]);

    const updateProductType = (
        e: React.ChangeEvent<HTMLInputElement>,
        color: string,
    ) => {
        const value = e.currentTarget.value;
        const name = e.currentTarget.name;

        const findProductTypes = productTypesData.filter(
            (prod) => prod.color === color,
        );
        const notMatchedData = productTypesData.filter(
            (prod) => prod.color !== color,
        );

        const updatedProducts = findProductTypes.map((prod) => ({
            ...prod,
            [name]: value,
        }));

        setProductsTypesData([...notMatchedData, ...updatedProducts]);
    };

    const deleteProduct = async (productId: string) => {
        const resp = await deleteProductAndProductTypes(productId);

        if (!resp.isValid) {
            toast.error('Nie udało się usunąć');
        }

        if (resp.isValid) {
            toast.success('Usunięto produkt i podprodukty');
        }
    };

    return (
        <div
            className={`relative border border-black rounded p-3 ${edit ? 'w-full' : 'w-1/5'}`}
        >
            {!edit && <div>{product.name}</div>}
            <div
                className="absolute top-0 right-0 p-2 underline hover:text-blue-400"
                onClick={() => setIsEdited((prev) => !prev)}
            >
                {edit ? 'Anuluj edycję' : 'Edytuj'}
            </div>
            {edit && (
                <div>
                    <form
                        className="w-full flex flex-col justify-end items-end"
                        onSubmit={(e) => updateProductReq(e)}
                    >
                        <div className="flex flex-col gap-6 w-full">
                            <div className="text-2xl">Produkt</div>
                            <div className="flex lg:flex-row flex-col gap-5 mx-5">
                                <div className="grid gap-3 w-full">
                                    <Label htmlFor="name">Nazwa*</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        type="text"
                                        required
                                        value={productData.name}
                                        onChange={(e) =>
                                            setProductData({
                                                ...productData,
                                                name: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="grid gap-3 w-full">
                                    <Label htmlFor="image">
                                        Scieżka do zdjęcia*
                                    </Label>
                                    <Input
                                        id="image"
                                        type="text"
                                        name="image"
                                        required
                                        value={productData.image}
                                        onChange={(e) =>
                                            setProductData({
                                                ...productData,
                                                image: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="grid gap-3 w-full">
                                    <Label htmlFor="category">Kategoria*</Label>
                                    <Input
                                        id="category"
                                        type="text"
                                        name="category"
                                        required
                                        value={productData.category}
                                        onChange={(e) =>
                                            setProductData({
                                                ...productData,
                                                category: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>
                            <div className="flex lg:flex-row flex-col gap-5 mx-5">
                                <div className="grid gap-3 w-full">
                                    <Label htmlFor="page">Strona*</Label>
                                    <Input
                                        id="page"
                                        type="text"
                                        name="page"
                                        required
                                        value={productData.page}
                                        onChange={(e) =>
                                            setProductData({
                                                ...productData,
                                                page: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="grid gap-3 w-full">
                                    <Label htmlFor="tag">Tagi</Label>
                                    <Input
                                        id="tag"
                                        type="text"
                                        name="tag"
                                        value={productData.tag}
                                        onChange={(e) =>
                                            setProductData({
                                                ...productData,
                                                tag: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="grid gap-3 w-full">
                                    <Label htmlFor="size_image">
                                        Zdjęcie rozmiarówki (ścieżka)
                                    </Label>
                                    <Input
                                        id="size_image"
                                        type="text"
                                        name="size_image"
                                        value={productData.size_image}
                                        onChange={(e) =>
                                            setProductData({
                                                ...productData,
                                                size_image: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="grid gap-3 w-full">
                                    <Label htmlFor="file_id">ID pliku</Label>
                                    <Input
                                        id="file_id"
                                        type="text"
                                        name="file_id"
                                        value={productData.file_id}
                                        onChange={(e) =>
                                            setProductData({
                                                ...productData,
                                                file_id: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>
                            <div className="flex flex-row items-start justify-center w-full gap-5">
                                <div className="grid gap-3 w-3/8">
                                    <Label htmlFor="description">
                                        Opis główny
                                    </Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        value={productData.description}
                                        onChange={(e) =>
                                            setProductData({
                                                ...productData,
                                                description: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="grid gap-3 w-3/8">
                                    <Label htmlFor="short_description">
                                        Opis krótki
                                    </Label>
                                    <Textarea
                                        id="short_description"
                                        name="short_description"
                                        value={productData.short_description}
                                        onChange={(e) =>
                                            setProductData({
                                                ...productData,
                                                description: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="w-full pt-4">
                            <div className="text-2xl pb-3">Podprodukty</div>
                            {prepareProductTypesForEdit.map((item, index) => {
                                return (
                                    <div
                                        key={index}
                                        className="flex flex-col gap-6 w-full"
                                    >
                                        <div className="flex lg:flex-row flex-col gap-5 mx-5">
                                            <div className="grid gap-3 w-1/4">
                                                <Label htmlFor="size">
                                                    Rozmiary (jak chcesz dodać
                                                    to pisz do Garnka)
                                                </Label>
                                                <Input
                                                    id="size"
                                                    type="text"
                                                    name="size"
                                                    value={item.size}
                                                    readOnly
                                                />
                                            </div>
                                            <div className="grid gap-3 w-1/4">
                                                <Label htmlFor="color">
                                                    Kolor (typ oklch)*
                                                </Label>
                                                <Input
                                                    id="color"
                                                    type="text"
                                                    name="color"
                                                    value={item.color}
                                                    onChange={(value) =>
                                                        updateProductType(
                                                            value,
                                                            item.color,
                                                        )
                                                    }
                                                />
                                            </div>
                                            <div className="grid gap-3 w-2/4">
                                                <Label htmlFor="images">
                                                    Zdjęcia (ścieżki np.
                                                    /clothes/fota.jpg,/clothesfota2.jpg)
                                                </Label>
                                                <Input
                                                    id="images"
                                                    type="text"
                                                    name="images"
                                                    value={item.images}
                                                    onChange={(value) =>
                                                        updateProductType(
                                                            value,
                                                            item.color,
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>

                                        <div className="flex lg:flex-row flex-col gap-5 mx-5">
                                            <div className="grid gap-3 w-full">
                                                <Label htmlFor="size_placeholder">
                                                    Rozmiarówka placeholder
                                                    (jeżeli nie ma rozmiarów)
                                                </Label>
                                                <Input
                                                    id="size_placeholder"
                                                    type="text"
                                                    name="size_placeholder"
                                                    value={
                                                        item.size_placeholder
                                                    }
                                                    onChange={(value) =>
                                                        updateProductType(
                                                            value,
                                                            item.color,
                                                        )
                                                    }
                                                />
                                            </div>
                                            <div className="grid gap-3 w-full">
                                                <Label htmlFor="price">
                                                    Cena*
                                                </Label>
                                                <Input
                                                    id="price"
                                                    name="price"
                                                    type="number"
                                                    required
                                                    value={item.price}
                                                    onChange={(value) =>
                                                        updateProductType(
                                                            value,
                                                            item.color,
                                                        )
                                                    }
                                                />
                                            </div>
                                            <div className="grid gap-3 w-full">
                                                <Label htmlFor="stock_quantity">
                                                    Ilość produktu*
                                                </Label>
                                                <Input
                                                    id="stock_quantity"
                                                    type="text"
                                                    name="stock_quantity"
                                                    required
                                                    value={item.stock_quantity}
                                                    onChange={(value) =>
                                                        updateProductType(
                                                            value,
                                                            item.color,
                                                        )
                                                    }
                                                />
                                            </div>
                                            <div className="grid gap-3 w-full">
                                                <Label htmlFor="sale_price">
                                                    Cena na wyprzedaży
                                                </Label>
                                                <Input
                                                    id="sale_price"
                                                    type="text"
                                                    name="sale_price"
                                                    value={item.sale_price}
                                                    onChange={(value) =>
                                                        updateProductType(
                                                            value,
                                                            item.color,
                                                        )
                                                    }
                                                />
                                            </div>
                                            <div className="grid gap-3 w-full">
                                                <Label htmlFor="sale_amount">
                                                    Ilość na wyprzedaży
                                                </Label>
                                                <Input
                                                    id="sale_amount"
                                                    type="text"
                                                    name="sale_amount"
                                                    value={item.sale_amount}
                                                    onChange={(value) =>
                                                        updateProductType(
                                                            value,
                                                            item.color,
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div className="h-1 w-full bg-stone-400 my-5" />
                                    </div>
                                );
                            })}
                        </div>
                        <div className="w-fit pt-3">
                            <Button className="w-fit">Zapisz</Button>
                        </div>
                    </form>
                    <div className="absolute bottom-0 left-0 pb-3 pl-3">
                        <Button
                            className="w-fit bg-red-900"
                            onClick={() => setOpenDeleteDialog(true)}
                        >
                            Usuń
                        </Button>
                        <AlertDialog
                            open={openDeleteDialog}
                            onOpenChange={() => setOpenDeleteDialog(false)}
                        >
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle hidden>
                                        Usuwanie produktu
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Czy na peweno chcesz usunąć produkt?
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel
                                        onClick={() =>
                                            setOpenDeleteDialog(false)
                                        }
                                    >
                                        Nie
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() =>
                                            deleteProduct(product.id)
                                        }
                                    >
                                        Tak
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
            )}
        </div>
    );
}
