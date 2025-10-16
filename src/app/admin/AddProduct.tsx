import {
    createProductAndProductTypes,
    ProductTypeRaw,
    ProductTypeTypeRaw,
} from '@/api/produktApi';
import { PAGE } from '@/common/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileType, getBase64, handleCreate } from '@/service/service';
import { PlusOutlined } from '@ant-design/icons';
import { Image, Upload, UploadFile } from 'antd';
import { UploadChangeParam } from 'antd/es/upload';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

export type FormProductTypesData = {
    id?: string;
    size: string;
    color: string;
    images: string[];
    size_placeholder: string;
    price: string;
    stock_quantity: string;
    sale_price: string;
    sale_amount: string;
};

type AddProductProps = { close: () => void };

export default function AddProduct({ close }: AddProductProps) {
    const [productTypesAmount, setProductTypesAmount] = useState<number>(1);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [mainImage, saveMainImage] = useState<UploadFile[]>([]);
    const [sizeImage, saveSizeImage] = useState<UploadFile[]>([]);
    const [fileList, setFileList] = useState<
        { images: UploadFile[]; index: string }[]
    >([]);
    const [submitPending, setSubmitPending] = useState<boolean>(false);

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const handleBeforeUpload = () => {
        return false;
    };

    const handleChange = async (
        info: UploadChangeParam<UploadFile<any>>,
        type: string,
    ) => {
        if (type === 'main') {
            saveMainImage(info.fileList);
        } else if (type === 'size') {
            saveSizeImage(info.fileList);
        } else {
            setFileList((prev) => {
                const index = prev.findIndex((item) => item.index === type);
                const newImages = info.fileList;
                if (index !== -1) {
                    const newArr = [...prev];
                    newArr[index] = { ...newArr[index], images: newImages };
                    return newArr;
                } else {
                    return [...prev, { index: type, images: newImages }];
                }
            });
        }
    };

    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );

    const array = useMemo(
        () => Array(productTypesAmount).fill(''),
        [productTypesAmount],
    );

    const createProduct = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitPending(true);

        const formData = new FormData(e.currentTarget);

        const imageData = await handleCreate(
            mainImage[0]?.originFileObj as File,
        );
        const sizeImageData = await handleCreate(
            sizeImage[0]?.originFileObj as File,
        );

        if (!imageData.isValid || !sizeImageData.isValid) {
            toast.error('Coś poszło nie tak');
            setSubmitPending(false);

            return;
        }

        const data: Partial<ProductTypeRaw> = {
            name: formData.get('name') as string,
            description: formData.get('description') as string,
            short_description: formData.get('short_description') as string,
            image: imageData.data?.public_id + ':url:' + imageData.data?.url,
            category: formData.get('category') as string,
            page: PAGE,
            tag: formData.get('tag') as string,
            size_image:
                sizeImageData.data?.public_id +
                ':url:' +
                sizeImageData.data?.url,
            file_id: formData.get('file_id') as string,
        };

        const dataTypes: FormProductTypesData[] = [];

        for (const [index, item] of array.entries()) {
            const images = fileList.find(
                (color) => color.index === index.toString(),
            );

            const requests = images?.images.map((item) =>
                handleCreate(item?.originFileObj as File),
            );

            const results = requests && (await Promise.all(requests));

            if (results?.some((result) => !result.isValid)) {
                toast.error('One or more images are invalid');
                setSubmitPending(false);

                return;
            }

            const imageArray =
                results?.reduce((arr: string[], item) => {
                    arr.push(item.data?.public_id + ':url:' + item.data?.url);

                    return arr;
                }, []) || [];

            const data: FormProductTypesData = {
                size: formData.get(`size-${index}`) as string,
                color: formData.get(`color-${index}`) as string,
                images: imageArray,
                size_placeholder: formData.get(
                    `size_placeholder-${index}`,
                ) as string,
                price: formData.get(`price-${index}`) as string,
                stock_quantity: formData.get(
                    `stock_quantity-${index}`,
                ) as string,
                sale_price: formData.get(`sale_price-${index}`) as string,
                sale_amount: formData.get(`sale_amount-${index}`) as string,
            };

            dataTypes.push(data);
        }

        const productTypesDataReq = dataTypes.reduce(
            (arr: Partial<ProductTypeTypeRaw>[], item) => {
                const images = item.images;
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
            setSubmitPending(false);

            return;
        }

        if (response.isValid) {
            toast.info('Dodano produkt i podprodukty');

            close();
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
                            <Label htmlFor="image">Zdjęcie*</Label>
                            <div>
                                <Upload
                                    listType="picture-card"
                                    fileList={mainImage}
                                    onPreview={handlePreview}
                                    beforeUpload={handleBeforeUpload}
                                    onChange={(e) => handleChange(e, 'main')}
                                    maxCount={1}
                                >
                                    {mainImage?.length >= 1
                                        ? null
                                        : uploadButton}
                                </Upload>
                                {previewImage && (
                                    <Image
                                        alt=""
                                        wrapperStyle={{ display: 'none' }}
                                        preview={{
                                            visible: previewOpen,
                                            onVisibleChange: (visible) =>
                                                setPreviewOpen(visible),
                                            afterOpenChange: (visible) =>
                                                !visible && setPreviewImage(''),
                                        }}
                                        src={previewImage}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex lg:flex-row flex-col gap-5 mx-5">
                        <div className="grid gap-3 w-full">
                            <Label htmlFor="category">Kategoria*</Label>
                            <Input
                                id="category"
                                type="text"
                                name="category"
                                required
                            />
                        </div>
                        <div className="grid gap-3 w-full">
                            <Label htmlFor="tag">Tagi</Label>
                            <Input id="tag" type="text" name="tag" />
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
                                    onChange={(e) => handleChange(e, 'size')}
                                    maxCount={1}
                                >
                                    {sizeImage?.length >= 1
                                        ? null
                                        : uploadButton}
                                </Upload>
                                {previewImage && (
                                    <Image
                                        alt=""
                                        wrapperStyle={{ display: 'none' }}
                                        preview={{
                                            visible: previewOpen,
                                            onVisibleChange: (visible) =>
                                                setPreviewOpen(visible),
                                            afterOpenChange: (visible) =>
                                                !visible && setPreviewImage(''),
                                        }}
                                        src={previewImage}
                                    />
                                )}
                            </div>
                        </div>
                        <div className="grid gap-3 w-full">
                            <Label htmlFor="file_id">ID pliku</Label>
                            <Input id="file_id" type="text" name="file_id" />
                        </div>
                    </div>
                    <div className="flex flex-row items-start justify-center w-full gap-5">
                        <div className="grid gap-3 w-3/8">
                            <Label htmlFor="description">Opis główny</Label>
                            <Textarea id="description" name="description" />
                        </div>
                        <div className="grid gap-3 w-3/8">
                            <Label htmlFor="short_description">
                                Opis krótki
                            </Label>
                            <Textarea
                                id="short_description"
                                name="short_description"
                            />
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
                    const colorIndex = index.toString();
                    const colorImages =
                        fileList.find((f) => f.index === colorIndex)?.images ||
                        [];

                    return (
                        <div key={index} className="flex flex-col gap-6 w-full">
                            <div className="flex lg:flex-row flex-col gap-5 mx-5">
                                <div className="grid gap-3 w-1/4">
                                    <Label htmlFor={`size-${index}`}>
                                        Rozmiary (np. XL,XXL)
                                    </Label>
                                    <Input
                                        id={`size-${index}`}
                                        type="text"
                                        name={`size-${index}`}
                                    />
                                </div>
                                <div className="grid gap-3 w-1/4">
                                    <Label htmlFor={`color-${index}`}>
                                        Kolor (typ oklch)*
                                    </Label>
                                    <Input
                                        id={`color-${index}`}
                                        type="text"
                                        name={`color-${index}`}
                                    />
                                </div>
                                <div className="grid gap-3 w-2/4">
                                    <Label htmlFor={`images-${index}`}>
                                        Zdjęcia
                                    </Label>
                                    <div>
                                        <Upload
                                            listType="picture-card"
                                            fileList={colorImages}
                                            onPreview={handlePreview}
                                            beforeUpload={handleBeforeUpload}
                                            onChange={(e) =>
                                                handleChange(e, colorIndex)
                                            }
                                            multiple
                                        >
                                            {colorImages.length >= 8
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
                            </div>

                            <div className="flex lg:flex-row flex-col gap-5 mx-5">
                                <div className="grid gap-3 w-full">
                                    <Label
                                        htmlFor={`size_placeholder-${index}`}
                                    >
                                        Rozmiarówka placeholder (jeżeli nie ma
                                        rozmiarów)
                                    </Label>
                                    <Input
                                        id={`size_placeholder-${index}`}
                                        type="text"
                                        name={`size_placeholder-${index}`}
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
                    <Button className="w-fit" disabled={submitPending}>
                        Zapisz
                    </Button>
                </div>
            </form>
        </div>
    );
}
