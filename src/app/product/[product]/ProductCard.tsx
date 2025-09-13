import { Card, CardContent } from "@/components/ui/card";
import {
  CloseOutlined,
  QuestionCircleOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ProductType, ProductTypeType } from "../../../api/produktApi";
import pkg from "lodash";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SIZE_WEIGHT } from "../../../common/constants";
import "react-image-gallery/styles/css/image-gallery.css";
import ImageGalery from "../../../pages/components/ImageGalery";
import { redirect } from "next/navigation";

type ProductCardProps = {
  product?: ProductType;
  products?: ProductTypeType[];
  addToCart: (item: { id: string; amount: number }) => void;
};

export default function ProductCard({
  product,
  products,
  addToCart,
}: ProductCardProps) {
  const [pickedProduct, setPickedProduct] = useState<ProductTypeType>();
  const [size, setSize] = useState<string>("");
  const [colors, setColors] = useState<string[]>([]);
  const [sizes, setSizes] = useState<ProductTypeType[]>([]);
  const [pickedColor, setPickedColor] = useState<string>("");
  const { isEmpty } = pkg;

  useEffect(() => {
    const colorsArray: string[] = [];
    products?.forEach((item) => {
      if (!colorsArray.find((color) => color === item.color)) {
        if (item.color === null) {
          return;
        }
        colorsArray.push(item.color);
      }
    });

    setColors(colorsArray);
  }, [products]);

  useEffect(() => {
    const filterProducts = products?.filter(
      (product) => product.color === pickedColor,
    );

    const sizes = filterProducts
      ?.filter((size) => size.size !== null)
      .sort(
        (a, b) =>
          SIZE_WEIGHT[a.size as keyof typeof SIZE_WEIGHT] -
          SIZE_WEIGHT[b.size as keyof typeof SIZE_WEIGHT],
      );

    if (sizes) {
      setSizes(sizes);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pickedColor]);

  const pickProductToDisplay = (color?: string) => {
    const colorExists = color ? color : colors[0];
    const displayProductFind = products?.find(
      (item) => item.color === colorExists,
    );

    if (displayProductFind) {
      setPickedColor(displayProductFind?.color);
      setPickedProduct(displayProductFind);
    }
  };

  useEffect(() => {
    pickProductToDisplay();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colors]);

  const pickNewProduct = (size: string) => {
    const find = products?.find(
      (item) => item.size === size && item.color === pickedColor,
    );

    if (find) {
      setPickedProduct(find);
    }
  };
  const sizesExist = useMemo(
    () => (sizes.length > 0 ? size.length > 0 : true),
    [sizes, size],
  );
  const disableButton = useMemo(
    () => !pickedProduct || !pickedColor || !sizesExist,
    [pickedProduct, pickedColor, sizesExist],
  );
  const addProduct = () => {
    addToCart({ id: pickedProduct?.id as string, amount: 1 });
  };

  const displayPrice = useMemo(
    () =>
      pickedProduct
        ? Number(pickedProduct.price).toFixed(2).replace(".", ",")
        : undefined,
    [pickedProduct],
  );

  return (
    <div className="fixed top-35 left-0 w-full h-full z-50">
      <Card className="h-full rounded-none">
        <CardContent className="px-1 h-full">
          <div className="flex flex-row flex-row gap-20 h-full">
            <div className="ml-40 w-1/2">
              {pickedProduct?.images && (
                <ImageGalery images={pickedProduct?.images} />
              )}
            </div>
            <div className="flex flex-col justify-between h-[80vh] w-full ml-10">
              <div>
                <div className="flex flex-row justify-between">
                  <div className="flex flex-col justify-center">
                    <div className="flex flex-row items-center gap-15">
                      <div className="text-3xl mb-1">{product?.name}</div>
                      <div className="text-4xl font-bold pl-30">
                        {displayPrice} zł
                      </div>
                    </div>
                    <div className="text-lg">{product?.description}</div>
                  </div>
                  <div className="flex items-start mr-5">
                    <CloseOutlined onClick={() => redirect("/#products")} />
                  </div>
                </div>
                <div className="flex flex-col mt-10">
                  <div className="text-2xl">Szczegóły produktu</div>
                  <div
                    className="w-full flex flex-col h-full text-lg mt-5"
                    style={{ whiteSpace: "pre-line" }}
                  >
                    {pickedProduct?.shortDescription}
                  </div>
                </div>
              </div>
              <div className="flex justify-between mr-50 items-center mb-10">
                <div className="flex flex-col items-start text-sm justify-start gap-6">
                  {!isEmpty(colors) && (
                    <div className="flex flex-row gap-3 justify-start">
                      {colors?.map((color) => {
                        const isColorPicked = color === pickedColor;
                        const reformat = color.replaceAll(",", "");

                        return (
                          <div
                            key={product?.id + color}
                            className="rounded-full w-10 h-10 border-black shadow-lg flex justify-center items-center"
                            style={{
                              borderColor: isColorPicked ? "green" : "",
                              borderWidth: isColorPicked ? "1px" : "",
                            }}
                          >
                            <div
                              style={{
                                backgroundColor: reformat,
                              }}
                              className={`rounded-full w-8 h-8 border-black shadow-lg`}
                              onClick={() => {
                                pickProductToDisplay(color);
                                setSize("");
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {sizes.length > 0 && (
                    <div className="mr-5 flex flex-row items-center gap-2">
                      <div>
                        <div className="flex flex-row items-center">
                          <div className="pl-1 text-base">Rozmiar:</div>
                          <div>
                            <Tooltip>
                              <TooltipTrigger className="pl-3">
                                <QuestionCircleOutlined />
                              </TooltipTrigger>
                              <TooltipContent>
                                <a href="/sizes">Sprawdz nasze rozmiary</a>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </div>
                        <Select
                          onValueChange={(value: string) => {
                            pickNewProduct(value);
                            setSize(value);
                          }}
                          value={size}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Wybierz rozmiar" />
                          </SelectTrigger>
                          <SelectContent>
                            {sizes?.map((size) => {
                              return (
                                <SelectItem
                                  value={size.size}
                                  key={pickedProduct?.id + size.size}
                                >
                                  {size.size}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                  {pickedProduct?.sizePlaceHolder && (
                    <div className="mr-5 flex flex-col gap-2">
                      <div className="text-base">Rozmiar: </div>
                      <div>{pickedProduct?.sizePlaceHolder}</div>
                    </div>
                  )}
                </div>
                <Button
                  disabled={disableButton}
                  onClick={() => {
                    addProduct();
                  }}
                >
                  <ShoppingCartOutlined />
                  Dodaj do koszyka
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
