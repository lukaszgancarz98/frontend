import type {
  DisplayProductType,
  DisplaySize,
} from "../../../pages/components/Cart/Cart";
import type { ProductType } from "../../../api/produktApi";
import DisplayProduct from "../../../pages/components/Cart/DisplayProduct";
import DisplayProductVideo from "../../../pages/components/Cart/DisplayProductVideo";
import { useMemo } from "react";

type User = {
  email: string;
};

type PaymentCartProps = {
  products: DisplayProductType[];
  allProducts: ProductType[];
  func: {
    deleteFromCart: (id: string) => void;
    deleteWholeProduct: (products: DisplaySize[]) => void;
    addToCard: (id: string) => void;
  };
  deliveryPrice: number;
  price: number;
  user: User | null;
};

export default function PaymentCart({
  products,
  allProducts,
  func,
  deliveryPrice,
  price,
  user,
}: PaymentCartProps) {
  const fullPrice = useMemo(() => {
    return (price + deliveryPrice)?.toFixed(2).replace(".", ",");
  }, [price, deliveryPrice]);

  return (
    <div className="flex flex-col">
      {!user?.email && <div>Masz już konto?</div>}
      <div className="flex flex-col gap-3">
        <div className="text-xl font-semibold pl-5 pt-5">Podsumowanie</div>
        <div className="flex w-full justify-between px-10">
          <div className="">Koszty produktów</div>
          <div>{price?.toFixed(2).replace(".", ",")} zł</div>
        </div>
        <div className="flex w-full justify-between px-10">
          <div>Koszty przesyłki</div>
          <div>{deliveryPrice?.toFixed(2).replace(".", ",")} zł</div>
        </div>
        <div className="flex w-full justify-between px-10 font-bold text-lg pb-5">
          <div>Razem</div>
          <div>{fullPrice} zł</div>
        </div>
      </div>
      <div className="border-t-2">
        <div className="text-xl font-semibold pl-5 py-5">Twoje zamówienie</div>
        {products?.map((product) => {
          const parent = allProducts.find(
            (item) => item.id === product?.productId,
          );

          if (parent && parent.type === "clothes") {
            return (
              <div className="px-5" key={product.id}>
                <DisplayProduct
                  product={product}
                  parentProduct={parent}
                  functions={func}
                />
              </div>
            );
          } else if (parent && parent.type === "video") {
            return (
              <div className="px-5" key={product.id}>
                <DisplayProductVideo
                  product={product}
                  parentProduct={parent}
                  functions={func}
                />
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}
