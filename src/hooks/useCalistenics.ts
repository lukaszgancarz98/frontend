'use client';

import pkg from 'lodash';
import { useEffect, useState } from 'react';
import {
    createOrder,
    deleteOrder,
    getOrder,
    getOrderByEmail,
    updateOrder,
    type OrderType,
} from '../api/orderApi';
import {
    getAllProducts,
    getAllProductTypes,
    type ProductType,
    type ProductTypeType,
} from '../api/produktApi';
import { useUser } from '../context/userContext';
import type { DisplaySize } from '../pages/components/Cart/Cart';
import { useOrder } from '../context/orderContext';

export type CartItem = { id: string; amount: number; trening?: boolean };

export function useCalistenics() {
    const [productListCart, setProductListCart] = useState<OrderType>();
    const [products, setProducts] = useState<ProductType[]>([]);
    const [productTypes, setProductTypes] = useState<ProductTypeType[]>([]);
    const { isEmpty } = pkg;
    const { user } = useUser();
    const {
        order,
        updateOrder: updateOrderContext,
        expandCart,
        updateExpanded,
    } = useOrder();

    const getProductsData = async () => {
        const productResponse = await getAllProducts();
        const productTypeResponse = await getAllProductTypes();
        if (
            productResponse.isValid &&
            productTypeResponse.isValid &&
            productResponse.data &&
            productTypeResponse.data
        ) {
            setProducts(productResponse.data);
            setProductTypes(productTypeResponse.data);
        }
    };

    useEffect(() => {
        getProductsData();
    }, []);

    const getOrderByEmailFunc = async () => {
        const request = await getOrderByEmail({ email: user?.email as string });

        if (!request.data) {
            return;
        }

        setProductListCart(request.data);
    };

    const getOrderFunc = async () => {
        const request = await getOrder({ id: order?.id as string });

        if (!request.data) {
            return;
        }

        setProductListCart(request.data);
    };

    useEffect(() => {
        if (user?.email) {
            getOrderByEmailFunc();
        } else if (order?.id) {
            getOrderFunc();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.email, order?.id]);

    const addProductToProductList = async (product: CartItem) => {
        const productType = productTypes.find((prod) => prod.id === product.id);

        if (!productType) {
            return;
        }

        const saveProduct = (product: OrderType) => {
            setProductListCart(product);

            return;
        };

        const isSale = Number(productType.sale_amount) > 0;

        const productPrice = isSale
            ? Number(productType.sale_price)
            : Number(productType.price);

        if (isEmpty(productListCart)) {
            const response = await createOrder({
                price: productPrice,
                products: [`${productType.id}`],
                email: user?.email as string,
                status: 'new',
            });

            if (!response.isValid) {
                return;
            }

            if (response.isValid && response.data) {
                saveProduct(response.data);
                updateOrderContext({ id: response.data.id });
            }
        }

        if (productListCart) {
            if (product.trening) {
                const exist = productListCart.products.find(
                    (item) => item === product.id,
                );

                if (exist) {
                    return;
                }
            }
            const response = await updateOrder({
                id: productListCart.id,
                price: Number(productListCart.price) + productPrice,
                products: [...productListCart.products, product.id],
                email: user?.email ? user?.email : '',
            });

            if (!response.isValid) {
                return;
            }

            if (response.data) {
                saveProduct(response.data);
            }
        }

        updateExpanded(true);
    };

    const deleteFromCart = async (id: string) => {
        const newOrder = productListCart;

        const findProductType = productTypes.find((item) => item.id === id);

        if (!newOrder || !findProductType) {
            return;
        }

        const index = newOrder.products.indexOf(id);
        if (index !== -1 && typeof index === 'number') {
            newOrder.products.splice(index, 1);
        }

        const response = await updateOrder({
            id: productListCart?.id as string,
            price:
                Number(productListCart?.price) - Number(findProductType.price),
            products: [...newOrder.products],
        });

        if (response.data) {
            setProductListCart(response.data);
        }
    };

    const deleteWholeProduct = async (products: DisplaySize[]) => {
        const newOrder = productListCart;

        let priceToDelete = 0;
        const array: string[] = [];

        if (!newOrder) {
            return;
        }

        products.forEach((product) => {
            priceToDelete += Number(product.price) * Number(product.amount);
            array.push(product.id);
        });

        const updateProducts = newOrder.products.filter(
            (product) => !array.includes(product),
        );

        if (updateProducts.length > 0) {
            const response = await updateOrder({
                id: productListCart?.id as string,
                price: Number(productListCart?.price) - Number(priceToDelete),
                products: updateProducts,
            });

            if (response.data) {
                setProductListCart(response.data);
            }

            return;
        }

        const response = await deleteOrder(productListCart?.id as string);

        if (response.isValid) {
            setProductListCart(undefined);
        }
    };

    const addToCard = async (id: string) => {
        const newOrder = productListCart;

        const findProductType = productTypes.find((item) => item.id === id);

        if (!newOrder || !findProductType) {
            return;
        }

        const isSale = Number(findProductType.sale_amount) > 0;

        const productPrice = isSale
            ? Number(findProductType.sale_price)
            : Number(findProductType.price);

        const response = await updateOrder({
            id: productListCart?.id as string,
            price: Number(productListCart?.price) + productPrice,
            products: [...newOrder.products, findProductType.id],
        });

        if (response.data) {
            setProductListCart(response.data);
        }
    };

    const filterProducts = (type: string) => {
        const filteredProductsArray = products.filter((product) =>
            product.category.includes(type),
        );

        return filteredProductsArray;
    };

    return {
        allProducts: products,
        products: filterProducts('clothes'),
        productTypes: productTypes,
        videoProducts: filterProducts('video'),
        productListCart,
        addProductToProductList,
        cartFunctions: { deleteFromCart, deleteWholeProduct, addToCard },
        expandCart,
        updateExpanded,
        setProductListCart,
    };
}
