import { CheckCircleFilled } from "@ant-design/icons";
import React from "react";
import type { ProductType, ProductTypeType } from "../../api/produktApi";
import { Button } from "@/components/ui/button";
import type { CartItem } from "../../hooks/useCalistenics";
import TextFade from "./Fade/FadeChildComponents";
import Image from "next/image";

type VideoProductsProps = {
  videoProducts: ProductType[];
  productTypes: ProductTypeType[];
  addProductToProductList: (product: CartItem) => Promise<void>;
  title: string;
  description: string;
};

export default function VideoProducts({
  videoProducts,
  productTypes,
  addProductToProductList,
  title,
  description,
}: VideoProductsProps) {
  const findProductType = (id: string) => {
    const find = productTypes.find((product) => product.productId === id);

    return find;
  };

  const formatText = (text: string) => {
    const splitText = text?.split("\n\n");

    return splitText?.map((para, pIndex) => (
      <p key={pIndex} className="pb-5 text-lg/7">
        {para
          ?.split(/(-)/)
          ?.map((part, i) =>
            part === "-" ? (
              <CheckCircleFilled
                key={i}
                style={{ color: "green", marginRight: 4 }}
              />
            ) : (
              <React.Fragment key={i}>{part}</React.Fragment>
            ),
          )}
      </p>
    ));
  };

  return (
    <div className="flex flex-col lg:pt-35" id="trainings">
      <div>
        <div className="mb-3 lg:mx-15 mx-1 lg:text-3xl text-2xl font-semibold md:mb-4 md:text-4xl lg:mb-6 mt-5">
          {title}
        </div>
        <div className="lg:mx-15 mx-2 lg:text-lg text-md lg:w-2/3">
          {description}
        </div>
      </div>
      <div className="flex items-stretch lg:flex-row flex-col py-20 h-max justify-evenly flex-wrap">
        {videoProducts?.map((item) => {
          const productType = findProductType(item?.id);

          return (
            <div
              key={item?.id}
              className="relative shadow-xl lg:w-[28vw] mb-5 lg:mb-0 h-auto mx-5 flex flex-col items-center min-h-1/3 rounded-xl min-w-[25vw] hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="relative w-full">
                <Image
                  src={item?.image}
                  alt={item?.id}
                  width={500}
                  height={500}
                  className="h-max lg:w-max w-full object-center object-contain rounded-tl-lg rounded-t-lg rounded-tr-lg opacity-80"
                />
                <div className="absolute bottom-0 right-0 text-3xl font-semibold pr-4 pb-3 text-white text-shadow-lg/30">
                  {Number(productType?.price)?.toFixed(2).replace(".", ",")} zł
                </div>
              </div>
              <div className="absolute top-0 left-0 flex text-2xl py-2 px-3 font-medium items-center bg-[oklch(0.61_0.16_252.06)] text-white rounded-br-lg rounded-tl-lg">
                {item?.name}
              </div>
              <div className="text-center w-full flex flex-col justify-between h-full mt-5">
                <div className="flex flex-col">
                  <TextFade>
                    <div
                      className="text-lg text-justify lg:px-10 px-1 pb-5 indent-4 prose"
                      style={{ whiteSpace: "pre-line" }}
                    >
                      {item?.description}
                    </div>
                  </TextFade>
                  <TextFade>
                    <div
                      className="text-lg text-justify px-10 pb-5 indent-4 prose"
                      style={{ whiteSpace: "pre-line" }}
                    >
                      {formatText(productType?.shortDescription as string)}
                    </div>
                  </TextFade>
                </div>
                <div className="mb-10 w-full text-center flex justify-center items-center">
                  <Button
                    className="bg-white text-grey-900 font-bold px-6 py-3 rounded-xl hover:bg-green-600 transition"
                    onClick={() =>
                      addProductToProductList({
                        id: productType?.id as string,
                        amount: 1,
                      })
                    }
                  >
                    Zacznij już teraz!
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
