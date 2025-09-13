"use client";
import { useEffect, useState, useMemo, useRef } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Image from "next/image";

interface GalleryProps {
  images: string[];
}

const ImageGalery = ({ images }: GalleryProps) => {
  const mainApi = useRef<CarouselApi>(undefined);
  const thumbnailApi = useRef<CarouselApi>(undefined);
  const [current, setCurrent] = useState(0);

  const setMainApi = (e: CarouselApi) => {
    mainApi.current = e;
  };

  const setThumbnailApi = (e: CarouselApi) => {
    thumbnailApi.current = e;
  };

  const mainImage = useMemo(
    () =>
      images?.map((image, index) => (
        <CarouselItem key={index} className="relative aspect-square w-full">
          <Image
            src={image}
            alt={`Carousel Main Image ${index + 1}`}
            className="h-[60vh] object-center object-contain"
            fill
          />
        </CarouselItem>
      )),
    [images],
  );

  const handleClick = (index: number) => {
    if (!mainApi.current || !thumbnailApi.current) {
      return;
    }
    thumbnailApi.current.scrollTo(index);
    mainApi.current?.scrollTo(index);
    setCurrent(index);
  };

  useEffect(() => {
    handleClick(0);
  }, [images]);

  const thumbnailImages = useMemo(
    () =>
      images?.map((image, index) => (
        <CarouselItem
          key={index}
          className="relative aspect-square w-full basis-1/4"
          onClick={() => handleClick(index)}
        >
          <Image
            className={`${index === current ? "ring-1" : ""} rounded h-32 w-24`}
            src={image}
            alt={`Carousel Thumbnail Image ${index + 1}`}
            style={{ objectFit: "cover" }}
            fill
          />
        </CarouselItem>
      )),
    [images, current],
  );

  useEffect(() => {
    if (!mainApi.current || !thumbnailApi.current) {
      return;
    }

    const handleTopSelect = () => {
      const selected = mainApi.current?.selectedScrollSnap();
      setCurrent(selected as number);
      thumbnailApi.current?.scrollTo(selected as number);
    };

    const handleBottomSelect = () => {
      const selected = thumbnailApi.current?.selectedScrollSnap();
      setCurrent(selected as number);
      mainApi.current?.scrollTo(selected as number);
    };

    mainApi.current.on("select", handleTopSelect);
    thumbnailApi.current.on("select", handleBottomSelect);

    return () => {
      mainApi.current?.off("select", handleTopSelect);
      thumbnailApi.current?.off("select", handleBottomSelect);
    };
  }, [mainApi, thumbnailApi]);

  return (
    <div className="w-96 max-w-xl sm:w-auto">
      <Carousel setApi={setMainApi}>
        <CarouselContent className="m-1">{mainImage}</CarouselContent>
      </Carousel>
      <Carousel setApi={setThumbnailApi}>
        <CarouselContent className="m-1">{thumbnailImages}</CarouselContent>
      </Carousel>
    </div>
  );
};

export default ImageGalery;
