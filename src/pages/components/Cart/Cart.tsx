import { CloseOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import DisplayProduct from "./DisplayProduct";
import type { OrderType } from "../../../api/orderApi";
import type { ProductType, ProductTypeType } from "../../../api/produktApi";
import DisplayProductVideo from "./DisplayProductVideo";
import Link from "next/link";
import { displayProducts } from "../../../service/service";

type CartProps = {
  products?: OrderType;
  allProducts?: ProductType[];
  productTypes?: ProductTypeType[];
  functions: {
    deleteFromCart: (id: string) => void;
    deleteWholeProduct: (products: DisplaySize[]) => void;
    addToCard: (id: string) => void;
  };
  expand: boolean;
  setExpanded: (val: boolean) => void;
  disabled?: boolean;
};
export type DisplaySize = {
  name: string;
  amount: number;
  price: number;
  id: string;
};

export type DisplayProductType = ProductTypeType & {
  amount: number;
  sizes: DisplaySize[];
};

export default function Cart({
  products,
  allProducts = [],
  productTypes,
  functions,
  expand,
  setExpanded,
  disabled,
}: CartProps) {
  const [openExtended, setOpenExtended] = useState<boolean>(false);
  const productsCount = useMemo(
    () => products?.products.length ?? 0,
    [products],
  );
  const [showContinue, setShowContinue] = useState<boolean>(false);
  const [sum, setSum] = useState<number>(0);
  const [cartProducts, setCartProducts] = useState<DisplayProductType[]>([]);
  const transportCost = 15;

  useEffect(() => {
    let priceSum = 0;

    products?.products.forEach((itemId) => {
      const product = productTypes?.find((product) => product.id === itemId);
      if (product) {
        priceSum += Number(product.price);
      }
    });

    setSum(priceSum);
  }, [products, productTypes]);

  useEffect(() => {
    if (products && productTypes && allProducts) {
      const data = displayProducts({
        products,
        productTypes,
        allProducts,
      });
      setCartProducts(data);
    }
  }, [products, productTypes, allProducts]);

  useEffect(() => {
    if (expand && !openExtended) {
      setShowContinue(true);
      setOpenExtended(true);
    }
  }, [expand, openExtended]);

  return (
    <div>
      <div
        onClick={() => {
          if (!disabled) {
            setOpenExtended(true);
          }
        }}
        className={`${disabled ? "bg-[oklch(0.6_0_0)]" : "bg-white"} p-2 rounded-full relative cursor-pointer`}
      >
        <ShoppingCartOutlined className="lg:text-3xl text-2xl" />
        <div
          className={`absolute ${disabled ? "bg-red-100" : "bg-red-200"} bottom-0 -left-1 w-5 h-5 rounded-full flex justify-center items-center text-sm font-semibold`}
        >
          {productsCount}
        </div>
      </div>
      {openExtended && (
        <div className="fixed inset-y-0 right-0 lg:w-[30vw] w-[100vw] min-w-96 bg-white shadow-lg z-50 flex flex-col">
          <div className="p-5 flex-1 overflow-auto">
            <div className="flex justify-between">
              <h2 className="text-xl font-bold mb-4">Zakupy</h2>
              <CloseOutlined
                onClick={() => {
                  setOpenExtended(false);
                  if (showContinue) {
                    setExpanded(false);
                    setShowContinue(false);
                  }
                }}
                className="pb-5"
              />
            </div>
            {productsCount > 0 &&
              cartProducts.map((product, index) => {
                const parent = allProducts.find(
                  (item) => item.id === product?.productId,
                );

                if (parent && parent.type === "clothes") {
                  return (
                    <DisplayProduct
                      key={product.id + index}
                      product={product}
                      parentProduct={parent}
                      functions={functions}
                    />
                  );
                } else if (parent && parent.type.includes("video")) {
                  return (
                    <DisplayProductVideo
                      key={product.id + index}
                      product={product}
                      parentProduct={parent}
                      functions={functions}
                    />
                  );
                }
                return null;
              })}
            {productsCount === 0 && (
              <div className="flex justify-center items-center h-9/10">
                Jeszcze nic tu nie ma....
              </div>
            )}
          </div>
          {productsCount > 0 && (
            <div className="p-4 flex flex-col gap-2">
              <div className="flex flex-col gap-1">
                <div className="flex flex-row justify-between items-center text-sm">
                  <div>Suma</div>
                  <div>{sum.toFixed(2).replace(".", ",")} zł</div>
                </div>
                <div className="flex flex-row justify-between items-center  text-sm">
                  <div>Koszt dostawy</div>
                  <div>{transportCost.toFixed(2).replace(".", ",")} zł</div>
                </div>
                <div className="flex flex-row justify-between items-center text-2xl mt-3">
                  <div className="font-bold">Koszt całkowity</div>
                  <div className="font-bold">
                    {(sum + transportCost).toFixed(2).replace(".", ",")} zł
                  </div>
                </div>
              </div>
              <Link
                className="bg-green-400 hover:bg-green-800 rounded-md px-10 h-[36px] w-full flex items-center justify-center text-white text-md font-medium"
                href={`/payment/${products?.id}`}
              >
                Przechodzę do płatności
              </Link>
              {showContinue && (
                <Button
                  className="bg-green-400 text-md hover:bg-green-800"
                  onClick={() => {
                    setOpenExtended(false);
                    setShowContinue(false);
                    setExpanded(false);
                  }}
                >
                  Kontynuuj zakupy
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
