import { useEffect, useState } from 'react';
import {
    getAllOrders,
    OrderAddressDetails,
    type OrderType,
} from '../api/orderApi';
import {
    getAllProducts,
    getAllProductTypes,
    type ProductType,
    type ProductTypeType,
} from '../api/produktApi';
import { isEmpty } from 'lodash';

type ItemType = {
    id: string;
    name: string;
    price: number;
    size: string;
    color: string;
    images: { id?: string; url?: string }[];
    size_placeholder: string;
    stock_quantity: string;
    productId: string;
};

export type Order = {
    id: string;
    createdDate: string;
    payment_date?: string;
    finalize_date?: string;
    price: number;
    items: ItemType[];
    status: string;
    orderDetails: OrderAddressDetails;
};

export type Orders = { paid: Order[]; finalized: Order[] };

type UseAdminReturnType = {
    orders: Orders;
    getOrdersRequest: () => Promise<void>;
};

export function useAdmin(): UseAdminReturnType {
    const [products, setProducts] = useState<ProductType[]>();
    const [productTypes, setProductTypes] = useState<ProductTypeType[]>();
    const [ordersData, setOrdersData] = useState<OrderType[]>();
    const [orders, setOrders] = useState<Order[]>([]);

    const getProductRequest = async () => {
        const response = await getAllProducts();
        if (response.isValid && response.data) {
            setProducts(response.data);
        }
    };

    const getProductTypesRequest = async () => {
        const response = await getAllProductTypes();
        if (response.isValid && response.data) {
            setProductTypes(response.data);
        }
    };

    const getOrdersRequest = async () => {
        const response = await getAllOrders();
        if (response.isValid && response.data) {
            setOrdersData(response.data);
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
                payment_date: order.payment_date,
                finalize_date: order.finalize_date,
                price: Number(order.price),
                items: [],
                status: order.status,
                orderDetails: JSON.parse(
                    order.orderDetails as unknown as string,
                ),
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
            paid: orders.filter(
                (order) =>
                    !isEmpty(order.payment_date) &&
                    isEmpty(order.finalize_date),
            ),
            finalized: orders.filter((order) => !isEmpty(order.finalize_date)),
        },
        getOrdersRequest,
    };
}
