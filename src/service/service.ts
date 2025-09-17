import type { OrderType } from '../api/orderApi';
import type { ProductType, ProductTypeType } from '../api/produktApi';
import type { DisplayProductType } from '../pages/components/Cart/Cart';

type DisplayProductPropsType = {
    products: OrderType;
    allProducts: ProductType[];
    productTypes: ProductTypeType[];
};

export const displayProducts = ({
    products,
    productTypes,
    allProducts,
}: DisplayProductPropsType) => {
    const arrayOfProducts = products?.products.reduce<DisplayProductType[]>(
        (arr, item) => {
            const find = productTypes?.find((product) => product.id === item);
            const parentType = allProducts.find(
                (prod) => prod.id === find?.productId,
            );

            if (find && parentType) {
                if (parentType?.category === 'clothes') {
                    const repeatedItem = arr.findIndex(
                        (x) => find.color === x.color,
                    );
                    if (repeatedItem !== -1) {
                        const itemData = arr[repeatedItem];
                        const sizeExistIndex = itemData.sizes.findIndex(
                            (i) => i.name === find.size,
                        );
                        if (sizeExistIndex !== -1 && itemData.sizes) {
                            itemData.sizes[sizeExistIndex].amount += 1;
                        } else {
                            itemData.sizes.push({
                                name: find.size,
                                amount: 1,
                                price: find.price,
                                id: find.id,
                            });
                        }
                        itemData.amount += 1;

                        arr[repeatedItem] = itemData;
                    } else {
                        arr.push({
                            ...find,
                            amount: 1,
                            sizes: [
                                {
                                    name: find.size,
                                    amount: 1,
                                    price: find.price,
                                    id: find.id,
                                },
                            ],
                        });
                    }
                } else {
                    arr.push({ ...find, amount: 1, sizes: [] });
                }
            }

            return arr;
        },
        [],
    );

    return arrayOfProducts;
};
