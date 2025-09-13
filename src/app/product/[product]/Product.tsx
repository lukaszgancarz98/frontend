"use client";

import ProductCard from "./ProductCard";
import {
  getProduct,
  getProductTypesByProductId,
  type ProductType,
  type ProductTypeType,
} from "../../../api/produktApi";
import { useEffect, useState } from "react";
import type { CartItem } from "../../../hooks/useCalistenics";
import {
  createOrder,
  getOrder,
  updateOrder,
  type OrderType,
} from "../../../api/orderApi";
import pkg from "lodash";
import { redirect } from "next/navigation";
import { useOrder } from "@/context/orderContext";
import { useUser } from "@/context/userContext";
import Link from "next/link";
import Image from "next/image";

type ProductProps = {
  productId: string;
};

export default function Product({ productId }: ProductProps) {
  const [product, setProduct] = useState<ProductType>();
  const [order, setOrder] = useState<OrderType>();
  const [productTypes, setProductTypes] = useState<ProductTypeType[]>();
  const { isEmpty } = pkg;
  const { user } = useUser();
  const {
    order: orderId,
    updateOrder: updateOrderContext,
    updateExpanded,
  } = useOrder();
  const getProductRequest = async (id: string) => {
    const response = await getProduct(id);

    if (response.isValid && response.data) {
      setProduct(response.data);
    }
  };

  const getProductTypesRequest = async (id: string) => {
    const response = await getProductTypesByProductId(id);

    if (response.isValid && response.data) {
      setProductTypes(response.data);
    }
  };

  const getOrderRequest = async (id: string) => {
    const response = await getOrder({ id });

    if (response.isValid && response.data) {
      setOrder(response.data);
    }
  };

  useEffect(() => {
    if (orderId && !order) {
      getOrderRequest(orderId?.id);
    }
  }, [orderId, order]);

  useEffect(() => {
    if (productId && !product) {
      getProductRequest(productId);
    }
  }, [productId, product]);

  useEffect(() => {
    if (productId && !product) {
      getProductTypesRequest(productId);
    }
  }, [productId, product]);

  const addProductToProductList = async (product: CartItem) => {
    const productType = productTypes?.find((prod) => prod.id === product.id);

    if (!productType) {
      return;
    }

    if (isEmpty(order)) {
      const response = await createOrder({
        price: Number(productType.price),
        products: [`${productType.id}`],
        email: user?.email as string,
        status: "new",
      });

      if (response.isValid && response.data) {
        updateOrderContext({ id: response.data.id });
      }
    }

    if (order) {
      await updateOrder({
        id: order.id,
        price: Number(order.price) + Number(productType.price),
        products: [...order.products, product.id],
        email: user?.email ? user?.email : "",
      });
    }

    updateExpanded(true);

    redirect("/#products");
  };

  return (
    <div id={productId}>
      <div
        id="header"
        className={`flex flex-row justify-between items-center h-35 fixed top-0 left-0 lg:w-full w-[100vw] z-60 shadow-xl bg-black`}
      >
        <Link href="/" className="flex flex-col justify-start w-1/4">
          <Image
            src={"/logo.jpg"}
            className="h-24 w-40 bg-transparent lg:ml-10"
            alt="/placeholder.png"
            width={1000}
            height={1000}
          />
        </Link>
        <div className="flex flex-col lg:w-2/4 w-3/4 justify-around items-center h-full">
          <Image
            src={"/text.jpg"}
            className="object-contain w-full h-1/2 pr-1 lg:pr-0"
            alt="/placeholder.png"
            width={500}
            height={500}
          />
        </div>
        <div className="lg:w-1/4" />
      </div>
      <ProductCard
        product={product}
        products={productTypes}
        addToCart={addProductToProductList}
      />
    </div>
  );
}
