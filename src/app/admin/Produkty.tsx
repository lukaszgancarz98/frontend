import {
    getAllProducts,
    getAllProductTypes,
    ProductType,
    ProductTypeType,
} from '@/api/produktApi';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import DisplayProduct from './DisplayProduct';
import { Button } from '@/components/ui/button';
import AddProduct from './AddProduct';
import { Input } from '@/components/ui/input';
import { isEmpty } from 'lodash';

export default function Produkty() {
    const [products, setProducts] = useState<ProductType[]>();
    const [productsTypes, setProductsTypes] = useState<ProductTypeType[]>();
    const [edit, setEdit] = useState<boolean>(true);
    const [filteredProducts, setFilteredProducts] = useState<ProductType[]>();
    const [refreshData, setRefresh] = useState<boolean>(false);

    const getProductsRequest = async () => {
        const getProd = await getAllProducts();
        const getType = await getAllProductTypes();

        if (!getProd.isValid && !getType.isValid) {
            toast.error('Request to get products failed');
        }

        const data = getProd.data?.sort((a, b) =>
            a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }),
        );

        setProducts(getProd.data as ProductType[]);
        setFilteredProducts(data);
        setProductsTypes(getType.data as ProductTypeType[]);
    };

    useEffect(() => {
        getProductsRequest();
    }, []);

    useEffect(() => {
        if (refreshData) {
            getProductsRequest();
            setRefresh(false);
        }
    }, [refreshData]);

    const filterProductData = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.currentTarget.value;

        if (isEmpty(value)) {
            setFilteredProducts(products);

            return;
        }

        const valueLoverCase = value.toLowerCase();

        const res = filteredProducts?.filter((prod) =>
            prod.name.toLowerCase().includes(valueLoverCase),
        );

        setFilteredProducts(res);
    };

    const closeCreation = () => {
        setEdit(true);
        setRefresh(true);
    };

    return (
        <div>
            <div className="flex flex-col gap-5 items-end">
                <div className="w-full flex flex-row justify-evenly">
                    <Input
                        placeholder="Wyszukaj produkt"
                        className="w-1/5"
                        onChange={(value) => filterProductData(value)}
                        disabled={!edit}
                    />
                    <Button
                        className="w-fit"
                        onClick={() => setEdit((prev) => !prev)}
                    >
                        {edit
                            ? 'Dodaj nowy produkt'
                            : 'Anuluj dodawanie produktów'}
                    </Button>
                </div>
                {edit ? (
                    <div className="flex flex-row flex-wrap gap-5 justify-center w-full">
                        {filteredProducts?.map((product) => {
                            const productTypesData = productsTypes?.filter(
                                (type) => type.productId === product.id,
                            );

                            if (!productTypesData) {
                                return;
                            }

                            return (
                                <DisplayProduct
                                    key={product.id}
                                    product={product}
                                    productTypes={productTypesData}
                                    triggerRefresh={setRefresh}
                                />
                            );
                        })}
                    </div>
                ) : (
                    <AddProduct close={() => closeCreation()} />
                )}
            </div>
        </div>
    );
}
