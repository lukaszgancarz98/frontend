import {
    createProductType,
    deleteProductAndProductTypes,
    deleteProductType,
    ProductType,
    ProductTypeType,
    ProductTypeTypeRaw,
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
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { isEmpty } from 'lodash';
import { REDIRECT_URL, SIZE_WEIGHT } from '@/common/constants';
import { Image, Upload, UploadFile } from 'antd';
import {
    FileType,
    generateThumb,
    getBase64,
    handleCreate,
} from '@/service/service';
import { PlusOutlined } from '@ant-design/icons';
import { UploadChangeParam } from 'antd/es/upload';

type DisplayProductProps = {
    product: ProductType;
    productTypes: ProductTypeType[];
    triggerRefresh: Dispatch<SetStateAction<boolean>>;
};

type Sizes = { sizes: string; color: string };

type FormProductTypesData = {
    id?: string;
    size: string;
    color: string;
    images: { id?: string; url?: string; file?: File; del?: boolean }[];
    size_placeholder: string;
    price: string;
    stock_quantity: string;
    sale_price: string;
    sale_amount: string;
    del?: boolean;
};

export type UploadedFile = {
    uid: string;
    lastModified: number;
    lastModifiedDate: Date;
    name: string;
    size: number;
    type: string;
    webkitRelativePath: string;
};

export default function DisplayProduct({
    product,
    productTypes,
    triggerRefresh,
}: DisplayProductProps) {
    const [edit, setIsEdited] = useState<boolean>();
    const [productData, setProductData] = useState<ProductType>(product);
    const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
    const [productTypesData, setProductsTypesData] = useState<
        (ProductTypeType & { status?: string; del?: boolean })[]
    >([]);
    const [sizes, setSizes] = useState<Sizes[]>();
    const [newSize, setNewSize] = useState<string>();
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [pending, setPending] = useState<boolean>(false);

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );

    const handleBeforeUpload = () => {
        return false;
    };

    const handleChange = async (
        info: UploadChangeParam<UploadFile<any>>,
        type: string,
    ) => {
        const removed = info.file.status === 'removed';
        const thumbUrl =
            !info.file.url &&
            !removed &&
            (await generateThumb(info.file as FileType));

        const file = info.file;
        file.thumbUrl = thumbUrl as string;

        if (type === 'main') {
            setProductData((prev) => {
                if (info.fileList.length === 0) {
                    return { ...prev, image: undefined };
                } else if (info.file.status === 'removed') {
                    return {
                        ...prev,
                        image: { ...productData.image, del: true },
                    };
                } else {
                    return {
                        ...prev,
                        image: { file: file as unknown as File },
                    };
                }
            });
        } else if (type === 'size') {
            setProductData((prev) => {
                if (info.fileList.length === 0) {
                    return { ...prev, size_image: undefined };
                } else if (info.file.status === 'removed') {
                    return {
                        ...prev,
                        size_image: { ...productData.size_image, del: true },
                    };
                } else {
                    return {
                        ...prev,
                        size_image: { file: file as unknown as File },
                    };
                }
            });
        } else {
            setProductsTypesData((prev) =>
                prev.map((item) => {
                    const matches = !item.color
                        ? type === item.id
                        : item.color === type;

                    if (!matches) return item;

                    const newImages = item.images
                        .map((img) => {
                            if (
                                img.id === info.file.uid &&
                                info.file.status === 'removed' &&
                                !img.file
                            ) {
                                return { ...img, del: true };
                            } else if (
                                (img.file as unknown as UploadFile)?.name ===
                                    info.file.name &&
                                info.file.status === 'removed' &&
                                img.file
                            ) {
                                return { ...img, del: true };
                            } else {
                                return img;
                            }
                        })
                        .filter((x) => {
                            if (x.file && x.del) {
                                return false;
                            }

                            return true;
                        });

                    if (info.file.status !== 'removed') {
                        newImages.push({ file: file as unknown as File });
                    }

                    return { ...item, images: newImages };
                }),
            );
        }
    };

    const createFileListFromImages = (
        items?: {
            id?: string;
            url?: string;
            file?: File & { thumbUrl?: string };
            del?: boolean;
        }[],
    ): UploadFile[] | undefined => {
        if (!items || items.length === 0) {
            return;
        }

        const filter = items.filter((x) => !x.del);

        return filter.map((item, index) => {
            if (item.file) {
                return {
                    uid: `${index}-${item.file.name}`,
                    name: item.file.name,
                    status: 'done',
                    originFileObj: item,
                    thumbUrl: item.file.thumbUrl,
                } as UploadFile;
            }

            return {
                uid: item.id,
                name: `image${index + 1}`,
                status: 'done',
                url: item.url!,
            } as UploadFile;
        });
    };

    const mainImage = useMemo(() => {
        return createFileListFromImages(
            productData.image ? [productData.image] : undefined,
        );
    }, [productData.image]);

    const sizeImage = useMemo(() => {
        return productData.size_image
            ? createFileListFromImages(
                  productData.size_image ? [productData.size_image] : undefined,
              )
            : undefined;
    }, [productData.size_image]);

    const handleDelete = async (publicId: string) => {
        const res = await fetch(`${REDIRECT_URL}/api/products/images`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ publicId }),
        });

        const data = await res.json();

        if (data.error) {
            return { isValid: false };
        }

        return { isValid: true, data: data };
    };

    useEffect(() => {
        setProductsTypesData(productTypes);
    }, [productTypes]);

    const updateProductReq = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setPending(true);

        if (!productData.image) {
            toast.error('zdjęcie jest wymagane w produkcie');

            setPending(false);
            return;
        }

        const imageData = !productData.image?.url
            ? await handleCreate(productData.image.file as File)
            : { isValid: true };

        const sizeImageData =
            !productData.size_image?.url && productData.size_image
                ? await handleCreate(
                      productData.size_image.file as unknown as File,
                  )
                : { isValid: true };

        const createImageString = (image: {
            url: string;
            public_id?: string;
            id?: string;
        }) => {
            if (!image) {
                return undefined;
            }

            return (image.public_id || image.id) + ':url:' + image.url;
        };

        if (!imageData?.isValid || !sizeImageData.isValid) {
            toast.error('Coś poszło nie tak');
            setPending(false);

            return;
        }

        const mainImage = imageData.data
            ? createImageString(imageData.data)
            : createImageString(
                  productData.image as { id: string; url: string },
              );

        const sizeImage = sizeImageData.data
            ? createImageString(sizeImageData.data)
            : createImageString(
                  productData.size_image as { id: string; url: string },
              );

        const requestData = {
            ...productData,
            image: mainImage,
            size_image: sizeImage,
        };

        const response = await updateProduct(requestData as ProductType);

        if (!response.isValid) {
            toast.error(
                'Kurwa co się dziejeeeeeeeee (coś się zjebało i nie zedytowało)',
            );
            setPending(false);

            return;
        }

        const deleteRequest: Promise<
            | { isValid: boolean; data?: undefined }
            | { isValid: boolean; data?: string | null }
        >[] = [];
        const createRequests: Promise<
            | { isValid: boolean; data?: undefined }
            | { isValid: boolean; data: string | null }
        >[] = [];

        const productTypeDataToUpdate: ProductTypeType[] = [];

        productTypesData.forEach((item) => {
            if (!item.status) {
                productTypeDataToUpdate.push(item);
            }

            if (item.status === 'create') {
                createRequests.push(createProductType(item));
            } else if (item.status === 'delete') {
                deleteRequest.push(deleteProductType(item.id));
            }
        });

        const resultsDelete =
            deleteRequest && (await Promise.all(deleteRequest));

        const resultsCreate =
            createRequests && (await Promise.all(createRequests));

        if (resultsDelete?.some((result) => !result.isValid)) {
            toast.error('Nie udało się usunąć rozmiaru');
            setPending(false);

            return;
        }

        if (resultsCreate?.some((result) => !result.isValid)) {
            toast.error('Nie udało się dodać rozmiaru');
            setPending(false);

            return;
        }

        const extractNonExistingImages = productTypeDataToUpdate.reduce(
            (arr: UploadedFile[], item: ProductTypeType) => {
                item.images.forEach((image) => {
                    if (!image.file) {
                        return;
                    }

                    const find = arr.find(
                        (x) =>
                            x.uid ===
                            (image.file as unknown as UploadedFile).uid,
                    );
                    if (find) {
                        return;
                    }

                    arr.push(image.file as unknown as UploadedFile);
                });

                return arr;
            },
            [],
        );

        const responseFiles =
            extractNonExistingImages &&
            (await Promise.all(
                extractNonExistingImages.map((x) =>
                    handleCreate(x as unknown as File),
                ),
            ));

        if (responseFiles?.some((result) => !result.isValid)) {
            toast.error('Nie udało dodać nowych zdjęć');
            setPending(false);

            return;
        }

        const finalRequestData = productTypeDataToUpdate.map((type) => {
            (type.images as unknown) = type.images
                .map((image) => {
                    if (image.file) {
                        const find = responseFiles.find(
                            (x) =>
                                x.data.uid ===
                                (image.file as unknown as UploadedFile).uid,
                        );

                        return find?.data.public_id + ':url:' + find?.data.url;
                    }

                    if (image.del) {
                        return;
                    }

                    return image.id + ':url:' + image?.url;
                })
                .filter((item) => item != null) as string[];

            return type;
        }) as ProductTypeTypeRaw[];

        const responseTypes = await updateProductTypes({
            productTypes: finalRequestData,
        });

        if (!responseTypes.isValid) {
            toast.error(
                'Kurwa co się dziejeeeeeeeee (coś się zjebało i nie zedytowało)',
            );
            setPending(false);

            return;
        }

        if (response.isValid) {
            setPending(true);
            toast.info(`Udana edycja ${product.name}`);
            setIsEdited(false);
            triggerRefresh(true);
        }
    };

    const prepareProductTypesForEdit = useMemo(() => {
        const newArr = productTypesData?.reduce(
            (arr: FormProductTypesData[], item) => {
                if (!item.color) {
                    arr.push({
                        id: item.id,
                        size: item.size,
                        color: item.color,
                        images: item.images,
                        size_placeholder: item.size_placeholder,
                        price: item.price?.toString(),
                        stock_quantity: item.stock_quantity,
                        sale_price: item.sale_price,
                        sale_amount: item.sale_amount,
                        del: item.del,
                    });

                    return arr;
                }

                const exist = arr.findIndex(
                    (arrItem) => arrItem.color === item.color,
                );

                if (exist === -1) {
                    arr.push({
                        size: item.size,
                        color: item.color,
                        images: item.images,
                        size_placeholder: item.size_placeholder,
                        price: item.price.toString(),
                        stock_quantity: item.stock_quantity,
                        sale_price: item.sale_price,
                        sale_amount: item.sale_amount,
                        del: item.del,
                    });

                    return arr;
                }

                arr[exist].size += `,${item.size}`;

                return arr;
            },
            [],
        );

        const getLightness = (color: string) => {
            const match = color?.match(/oklch\(([^,]+)/);
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
        const imageRequest = handleDelete(product.image?.id as string);
        const sizeImageRequest = handleDelete(product.size_image?.id as string);
        const reduce = productTypes.reduce(
            (
                arr: {
                    color: string;
                    images: {
                        id?: string;
                        url?: string;
                        file?: File;
                        del?: boolean;
                    }[];
                }[],
                item,
            ) => {
                const findColor = arr.find((x) => x.color === item.color);

                if (!findColor) {
                    arr.push({ color: item.color, images: item.images });
                }

                return arr;
            },
            [],
        );

        const requests = [];
        reduce.map((item) => {
            item.images.map((image) => {
                requests.push(handleDelete(image?.id as string));
            });
        });

        if (product.size_image) {
            requests.unshift(sizeImageRequest);
        }

        requests.unshift(imageRequest);

        const responses = await Promise.all(requests);

        if (responses?.some((result) => !result.isValid)) {
            toast.error('One or more images are invalid');

            return;
        }

        if (!resp.isValid) {
            toast.error('Nie udało się usunąć');
        }

        if (resp.isValid) {
            toast.success('Usunięto produkt i podprodukty');
            triggerRefresh(true);
        }
    };

    const deleteProductTypeFn = async (size: string, color: string) => {
        const findItemIndex = productTypesData.findIndex(
            (item) => item.size === size && item.color === color,
        );

        const newData = productTypesData;

        if (findItemIndex !== -1) {
            toast.error('Nie udało się usunąć');

            return;
        }

        newData[findItemIndex].status = 'delete';

        setProductsTypesData(newData);
    };

    const createNewSize = async (color: string) => {
        const findItem = productTypesData.find((item) => item.color === color);

        if (!findItem) {
            toast.error('Nie udało się usunąć');

            return;
        }

        const newData = {
            ...findItem,
            id: product.id,
            size: newSize as string,
            status: 'create',
        };

        setProductsTypesData((prev) => [...prev, newData]);
    };

    const deleteTypes = (type: string, action?: boolean) => {
        setProductsTypesData((prev) =>
            prev.map((item) => {
                const matches = !item.color
                    ? type === item.id
                    : item.color === type;

                if (!matches) return item;

                const images = item.images.map(() => {
                    const toDelete = !action;

                    return { ...item, del: toDelete };
                });

                return { ...item, del: !action, images: images };
            }),
        );
    };

    const disableEdit = () => {
        setProductData(product);
        setProductsTypesData(productTypes);
        setIsEdited((prev) => !prev);
    };

    return (
        <div
            className={`relative border border-black rounded p-3 ${edit ? 'w-[98%]' : 'w-1/5'}`}
        >
            {!edit && <div>{product.name}</div>}
            <div
                className="absolute top-0 right-0 p-2 underline hover:text-blue-400"
                onClick={() => disableEdit()}
            >
                {edit ? 'Anuluj edycję' : 'Edytuj'}
            </div>
            {edit && (
                <div className="w-full">
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
                                    <Label htmlFor="image">Zdjęcie*</Label>
                                    <div>
                                        <Upload
                                            listType="picture-card"
                                            fileList={mainImage}
                                            onPreview={handlePreview}
                                            beforeUpload={handleBeforeUpload}
                                            onChange={(e) =>
                                                handleChange(e, 'main')
                                            }
                                            multiple={false}
                                        >
                                            {(mainImage?.length || 0) >= 1
                                                ? null
                                                : uploadButton}
                                        </Upload>

                                        {previewImage && (
                                            <Image
                                                alt=""
                                                wrapperStyle={{
                                                    display: 'none',
                                                }}
                                                preview={{
                                                    visible: previewOpen,
                                                    onVisibleChange: (
                                                        visible,
                                                    ) =>
                                                        setPreviewOpen(visible),
                                                    afterOpenChange: (
                                                        visible,
                                                    ) =>
                                                        !visible &&
                                                        setPreviewImage(''),
                                                }}
                                                src={previewImage}
                                            />
                                        )}
                                    </div>
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
                                        Zdjęcie rozmiarówki
                                    </Label>
                                    <div>
                                        <Upload
                                            listType="picture-card"
                                            fileList={sizeImage}
                                            onPreview={handlePreview}
                                            beforeUpload={handleBeforeUpload}
                                            onChange={(e) =>
                                                handleChange(e, 'size')
                                            }
                                        >
                                            {sizeImage && sizeImage.length >= 1
                                                ? null
                                                : uploadButton}
                                        </Upload>

                                        {previewImage && (
                                            <Image
                                                alt=""
                                                wrapperStyle={{
                                                    display: 'none',
                                                }}
                                                preview={{
                                                    visible: previewOpen,
                                                    onVisibleChange: (
                                                        visible,
                                                    ) =>
                                                        setPreviewOpen(visible),
                                                    afterOpenChange: (
                                                        visible,
                                                    ) =>
                                                        !visible &&
                                                        setPreviewImage(''),
                                                }}
                                                src={previewImage}
                                            />
                                        )}
                                    </div>
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
                                const images = createFileListFromImages(
                                    item?.images,
                                );

                                const toDelete = item.del;

                                return (
                                    <div
                                        key={index}
                                        className="flex flex-col gap-6 w-full"
                                    >
                                        <div className="flex lg:flex-row flex-col gap-5 mx-5 relative">
                                            <div className="absolute left-35 top-0">
                                                <div
                                                    onClick={() =>
                                                        deleteTypes(
                                                            item.color ||
                                                                (item.id as string),
                                                            item.del,
                                                        )
                                                    }
                                                    className="bg-red-400 px-2 py-1 rounded-xl font-bold"
                                                >
                                                    {toDelete
                                                        ? 'Jednak nie usuwaj'
                                                        : 'Usuń podprodukt'}
                                                </div>
                                            </div>
                                            <div className="grid gap-3 w-1/4">
                                                <Label htmlFor="size">
                                                    Rozmiary
                                                </Label>
                                                <div className="flex flex-row gap-2">
                                                    {item.size
                                                        ?.split(',')
                                                        .sort(
                                                            (a, b) =>
                                                                SIZE_WEIGHT[
                                                                    a as keyof typeof SIZE_WEIGHT
                                                                ] -
                                                                SIZE_WEIGHT[
                                                                    b as keyof typeof SIZE_WEIGHT
                                                                ],
                                                        )
                                                        .map((size) => (
                                                            <AlertDialog
                                                                key={
                                                                    item.id +
                                                                    size
                                                                }
                                                            >
                                                                <AlertDialogTrigger
                                                                    disabled={
                                                                        toDelete
                                                                    }
                                                                >
                                                                    {size}
                                                                </AlertDialogTrigger>
                                                                <AlertDialogContent>
                                                                    <AlertDialogHeader>
                                                                        <AlertDialogTitle
                                                                            hidden
                                                                        >
                                                                            Usuwanie
                                                                            rozmiaru
                                                                        </AlertDialogTitle>
                                                                        <AlertDialogDescription>
                                                                            Czy
                                                                            na
                                                                            peweno
                                                                            chcesz
                                                                            usunąć
                                                                            rozmiar{' '}
                                                                            {
                                                                                size
                                                                            }
                                                                            ?
                                                                        </AlertDialogDescription>
                                                                    </AlertDialogHeader>
                                                                    <AlertDialogFooter>
                                                                        <AlertDialogCancel>
                                                                            Nie
                                                                        </AlertDialogCancel>
                                                                        <AlertDialogAction
                                                                            onClick={() =>
                                                                                deleteProductTypeFn(
                                                                                    size,
                                                                                    item.color,
                                                                                )
                                                                            }
                                                                        >
                                                                            Tak
                                                                        </AlertDialogAction>
                                                                    </AlertDialogFooter>
                                                                </AlertDialogContent>
                                                            </AlertDialog>
                                                        ))}
                                                    {item.size?.length > 0 &&
                                                        !toDelete && (
                                                            <AlertDialog>
                                                                <AlertDialogTrigger
                                                                    onClick={() =>
                                                                        setNewSize(
                                                                            '',
                                                                        )
                                                                    }
                                                                    className="text-green-700 pl-2"
                                                                >
                                                                    +
                                                                </AlertDialogTrigger>
                                                                <AlertDialogContent>
                                                                    <AlertDialogHeader>
                                                                        <AlertDialogTitle
                                                                            hidden
                                                                        >
                                                                            Usuwanie
                                                                            rozmiaru
                                                                        </AlertDialogTitle>
                                                                        <AlertDialogDescription>
                                                                            Dodaj
                                                                            rozmiar?
                                                                        </AlertDialogDescription>
                                                                    </AlertDialogHeader>
                                                                    <Input
                                                                        value={
                                                                            newSize
                                                                        }
                                                                        onChange={(
                                                                            val,
                                                                        ) =>
                                                                            setNewSize(
                                                                                val
                                                                                    .target
                                                                                    .value,
                                                                            )
                                                                        }
                                                                    ></Input>
                                                                    <AlertDialogFooter>
                                                                        <AlertDialogCancel>
                                                                            Nie
                                                                        </AlertDialogCancel>
                                                                        <AlertDialogAction
                                                                            onClick={() =>
                                                                                createNewSize(
                                                                                    item.color,
                                                                                )
                                                                            }
                                                                        >
                                                                            Tak
                                                                        </AlertDialogAction>
                                                                    </AlertDialogFooter>
                                                                </AlertDialogContent>
                                                            </AlertDialog>
                                                        )}
                                                </div>
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
                                                    disabled={toDelete}
                                                />
                                            </div>
                                            <div className="grid gap-3 w-2/4">
                                                <Label htmlFor="images">
                                                    Zdjęcia
                                                </Label>
                                                <div>
                                                    <Upload
                                                        listType="picture-card"
                                                        fileList={images}
                                                        onPreview={
                                                            handlePreview
                                                        }
                                                        beforeUpload={
                                                            handleBeforeUpload
                                                        }
                                                        onChange={(e) =>
                                                            handleChange(
                                                                e,
                                                                item.color ||
                                                                    (item.id as string),
                                                            )
                                                        }
                                                        multiple
                                                        disabled={toDelete}
                                                    >
                                                        {images &&
                                                        images.length >= 8
                                                            ? null
                                                            : uploadButton}
                                                    </Upload>

                                                    {previewImage && (
                                                        <Image
                                                            alt=""
                                                            wrapperStyle={{
                                                                display: 'none',
                                                            }}
                                                            preview={{
                                                                visible:
                                                                    previewOpen,
                                                                onVisibleChange:
                                                                    (visible) =>
                                                                        setPreviewOpen(
                                                                            visible,
                                                                        ),
                                                                afterOpenChange:
                                                                    (visible) =>
                                                                        !visible &&
                                                                        setPreviewImage(
                                                                            '',
                                                                        ),
                                                            }}
                                                            src={previewImage}
                                                        />
                                                    )}
                                                </div>
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
                                                    disabled={toDelete}
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
                                                    disabled={toDelete}
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
                                                    disabled={toDelete}
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
                                                    disabled={toDelete}
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
                                                    disabled={toDelete}
                                                />
                                            </div>
                                        </div>
                                        <div className="h-1 w-full bg-stone-400 my-5" />
                                    </div>
                                );
                            })}
                        </div>
                        <div className="w-fit pt-3">
                            <Button className="w-fit" disabled={pending}>
                                Zapisz
                            </Button>
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
