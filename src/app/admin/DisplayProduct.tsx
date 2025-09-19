import { ProductType, updateProduct } from '@/api/produktApi';
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
import { useState } from 'react';
import { toast } from 'sonner';

type DisplayProductProps = { product: ProductType };

export default function DisplayProduct({ product }: DisplayProductProps) {
    const [edit, setIsEdited] = useState<boolean>();
    const [productData, setProductData] = useState<ProductType>(product);
    const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);

    const updateProductReq = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const response = await updateProduct(productData);

        if (!response.isValid) {
            toast.error(
                'Kurwa co się dziejeeeeeeeee (coś się zjebało i nie zedytowało)',
            );
        }

        if (response.isValid) {
            toast.info('Udana edycja');
            setIsEdited(false);
        }
    };

    const deleteProduct = () => {};

    return (
        <div
            className={`relative border border-black rounded p-3 ${edit ? 'w-full' : 'w-1/5'}`}
        >
            {!edit && <div>{product.name}</div>}
            <div
                className="absolute top-0 right-0 p-2 underline hover:text-blue-400"
                onClick={() => setIsEdited((prev) => !prev)}
            >
                Edytuj
            </div>
            {edit && (
                <div>
                    <form
                        className="w-full flex flex-col justify-end items-end"
                        onSubmit={(e) => updateProductReq(e)}
                    >
                        <div className="flex flex-col gap-6 w-full">
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
                                    <Label htmlFor="description">
                                        Opis główny
                                    </Label>
                                    <Input
                                        id="description"
                                        type="text"
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
                                        onClick={() => deleteProduct()}
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
