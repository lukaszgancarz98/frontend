'use client';

import { getAllProducts, ProductType } from '@/api/produktApi';
import {
    getAllWorkShopReceivers,
    ReciverResponseData,
} from '@/api/workShopApi';
import { MailOutlined, SendOutlined } from '@ant-design/icons';
import { isEmpty } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

type DispalyWorkShop = {
    name: string;
    id: string;
    workshops: ReciverResponseData[];
};

export default function WorkShopsPage() {
    const [workshops, setWorkShops] = useState<ReciverResponseData[]>();
    const [products, setProducts] = useState<ProductType[]>();

    const getAllProductsRequest = async () => {
        const response = await getAllWorkShopReceivers();

        if (!response.isValid) {
            toast.error('Błąd przy pobieraniu danych newslettera');
        }

        if (response.isValid) {
            setWorkShops(response.data as ReciverResponseData[]);
        }
    };

    const handleClick = (workshops: ReciverResponseData[], name: string) => {
        const emails = workshops.reduce((arr: string[], item) => {
            arr.push(item.email);

            return arr;
        }, []);

        const toEmails = emails;

        const subject = name;

        // Tworzymy link mailto
        const mailtoLink = `mailto:${toEmails.join(',')}?subject=${encodeURIComponent(subject)}`;

        window.location.href = mailtoLink;
    };

    const workShopsToDispaly = useMemo(() => {
        const filterProducts = products?.filter((prod) =>
            prod.category.includes('optional'),
        );

        const workShopFilter = workshops?.reduce(
            (arr: DispalyWorkShop[], item) => {
                const findProduct = filterProducts?.find(
                    (prod) => prod.id === item.workshop_id,
                );
                const exist = arr.findIndex((x) => x.id === findProduct?.id);
                if (!findProduct) {
                    const productIdEmpty = isEmpty(item.workshop_id);

                    const emptyIdInArrayExist = arr.findIndex((x) =>
                        isEmpty(x.id),
                    );
                    console.log(emptyIdInArrayExist, 'XD!2', arr);
                    if (productIdEmpty && emptyIdInArrayExist !== -1) {
                        console.log(arr[emptyIdInArrayExist], 'XD!1');
                        arr[emptyIdInArrayExist]?.workshops.push(item);

                        return arr;
                    }
                }

                if (exist === -1) {
                    arr.push({
                        name: findProduct?.name || 'Praca',
                        id: findProduct?.id || '',
                        workshops: [item],
                    });

                    return arr;
                }

                arr[exist].workshops.push(item);

                return arr;
            },
            [],
        );

        return workShopFilter;
    }, [products, workshops]);

    const getAllRequest = async () => {
        const response = await getAllProducts();

        if (!response.isValid) {
            toast.error('Błąd przy pobieraniu danych produktów');
        }

        if (response.isValid) {
            setProducts(response.data as ProductType[]);
        }
    };

    useEffect(() => {
        if (isEmpty(workshops) && isEmpty(products)) {
            getAllProductsRequest();
            getAllRequest();
        }
    }, [workshops, products]);

    return (
        <div className="w-screen flex flex-row gap-10 w-full">
            {workShopsToDispaly?.map((item, index) => {
                return (
                    <div key={item.id} className="w-full pl-5 flex flex-row">
                        {index !== 0 && (
                            <div className="w-1 h-full bg-stone-200 mr-5" />
                        )}
                        <div className="w-full">
                            <div className="flex flex-row items-center justify-between pb-5">
                                <div className="text-3xl">{item.name}</div>
                                <div
                                    className="flex flex-row gap-1 items-center justify-center transition hover:scale-130"
                                    onClick={() => {
                                        if (item.workshops.length > 0) {
                                            handleClick(
                                                item.workshops,
                                                item.name,
                                            );

                                            return;
                                        }

                                        toast.error(
                                            'Chopie nie widzisz że tablica jest pusta?',
                                        );
                                    }}
                                >
                                    All
                                    <MailOutlined />
                                    <SendOutlined />
                                </div>
                            </div>
                            {item.workshops.map((section, index) => {
                                return (
                                    <div
                                        key={section.email + index}
                                        className="flex flex-row justify-start gap-6 pb-2"
                                    >
                                        <div>● {section.email}</div>
                                        {isEmpty(item.id) && (
                                            <div
                                                className="flex flex-row gap-1 items-center justify-center transition hover:scale-130"
                                                onClick={() => {
                                                    if (
                                                        item.workshops.length >
                                                        0
                                                    ) {
                                                        handleClick(
                                                            [section],
                                                            item.name,
                                                        );

                                                        return;
                                                    }

                                                    toast.error(
                                                        'Chopie nie widzisz że tablica jest pusta?',
                                                    );
                                                }}
                                            >
                                                <MailOutlined />
                                                <SendOutlined />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
