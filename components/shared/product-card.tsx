/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import React from "react";
import { Title } from "./title";
import { Button } from "../ui";
import { Plus } from "lucide-react";

interface Props {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  className?: string;
}

export const ProductCard: React.FC<Props> = ({
  id,
  name,
  price,
  imageUrl,
  className,
}) => {
  return (
    <div className={className}>
      <Link href={`/products/${id}`}>
        <div className="flex justify-center p-6 bg-secondary rounded-lg h-[260px]">
          <img className="w-[215px] h-[215px]" src={imageUrl} alt={name} />
        </div>
        <Title text={name} size="sm" className="mb-1 mt-3 font-bold " />
        <p className="text-sm text-gray-500">
          ALUPLAST 229001, п-образный,APM 30 x 30, длинна 6-метров, 600 метров,
        </p>

        <div className="flex justify-between items-center mt-4">
          <span className="text-[20px]">
            от <b>{price} п/м ₽</b>
          </span>
          <Button variant="default" className="font-bold text-base">
            <Plus size={20} className="mr-1" />
            Купить
          </Button>
        </div>
      </Link>
    </div>
  );
};
