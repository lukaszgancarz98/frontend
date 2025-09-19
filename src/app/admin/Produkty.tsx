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

export default function Produkty() {
    const [products, setProducts] = useState<ProductType[]>();
    const [productsTypes, setProductsTypes] = useState<ProductTypeType[]>();
    const [edit, setEdit] = useState<boolean>(true);

    const getProductsRequest = async () => {
        const getProd = await getAllProducts();
        const getType = await getAllProductTypes();

        if (!getProd.isValid && !getType.isValid) {
            toast.error('Request to get products failed');
        }

        setProducts(getProd.data as ProductType[]);
        setProductsTypes(getType.data as ProductTypeType[]);
    };

    useEffect(() => {
        getProductsRequest();
    }, []);

    return (
        <div>
            <div className="flex flex-col gap-5 items-end">
                <div className="w-1/5">
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
                    <div className="flex flex-row flex-wrap gap-5 justify-center">
                        {products?.map((product) => {
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
                                />
                            );
                        })}
                    </div>
                ) : (
                    <AddProduct />
                )}
            </div>
        </div>
    );
}
