import { useEffect, useState } from 'react';
import { getAllOrders, type OrderType } from '../api/orderApi';
import {
    getAllProducts,
    getAllProductTypes,
    type ProductType,
    type ProductTypeType,
} from '../api/produktApi';

type ItemType = {
    id: string;
    name: string;
    price: number;
    size: string;
    color: string;
    images: string[];
    sizePlaceHolder: string;
    stock_quantity: string;
    productId: string;
};

type Order = {
    id: string;
    createdDate: string;
    paymentDate?: string;
    price: number;
    items: ItemType[];
    status: string;
};

type UseAdminReturnType = {
    orders: { new: Order[]; paid: Order[]; finalized: Order[] };
};

export function useAdmin(): UseAdminReturnType {
    const [products, setProducts] = useState<ProductType[]>();
    const [productTypes, setProductTypes] = useState<ProductTypeType[]>();
    const [ordersData, setOrdersData] = useState<OrderType[]>();
    const [orders, setOrders] = useState<Order[]>([]);

    const getProductRequest = async () => {
        const response = await getAllProducts();
        if (response.isValid) {
            setProducts(response.data as any);
        }
    };

    const getProductTypesRequest = async () => {
        const response = await getAllProductTypes();
        if (response.isValid) {
            setProductTypes(response.data as any);
        }
    };

    const getOrdersRequest = async () => {
        const response = await getAllOrders();
        if (response.isValid) {
            setOrdersData(response.data as any);
        }
    };

    useEffect(() => {
        getProductRequest();
        getProductTypesRequest();
        getOrdersRequest();
    }, []);

    const prepareOrderData = (
        products: ProductType[],
        productTypes: ProductTypeType[],
        ordersData: OrderType[],
    ) => {
        const newData: Order[] = [];
        ordersData.forEach((order) => {
            const orderData: Order = {
                id: order.id,
                createdDate: order.createDate,
                paymentDate: order.paymentDate,
                price: Number(order.price),
                items: [],
                status: order.status,
            };

            order.products.forEach((product) => {
                const productType = productTypes.find(
                    (type) => type.id === product,
                );
                const productData = products.find(
                    (type) => type.id === productType?.productId,
                );

                if (productType && productData) {
                    orderData.items.push({
                        ...productType,
                        name: productData.name,
                    });
                }
            });

            newData.push(orderData);
        });

        setOrders(newData);
    };

    useEffect(() => {
        if (productTypes && products && ordersData) {
            prepareOrderData(products, productTypes, ordersData);
        }
    }, [productTypes, products, ordersData]);

    return {
        orders: {
            new: orders.filter((order) => order.status === 'new'),
            paid: orders.filter((order) => order.status === 'paid'),
            finalized: orders.filter((order) => order.status === 'finalized'),
        },
    };
}
