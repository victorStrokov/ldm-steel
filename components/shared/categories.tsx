"use client";

import { cn } from "@/lib/utils";
import { useCategoryStore } from "@/store/category";

import React from "react";

interface Props {
  className?: string;
}

const cats = [
  { id: 1, name: "Армирование" },
  { id: 2, name: "Алюминий" },
  { id: 3, name: "ПВХ" },
  { id: 4, name: "Уплотнение" },
  { id: 5, name: "Фурнитура" },
  { id: 6, name: "Комплектующие" },
];

export const Categories: React.FC<Props> = ({ className }) => {
  const categoryActiveId = useCategoryStore((state) => state.activeId);
  return (
    <div
      className={cn("inline-flex gap-1 bg-gray-50 p-1 rounded-2xl", className)}
    >
      {cats.map(({ name, id }, index) => (
        <a
          className={cn(
            "flex items-center font-bold h-12 rounded-2xl px-5",
            className,
            categoryActiveId === id &&
              "bg-white shadow-md-gray-200 text-primary"
          )}
          key={index}
          href={`/#${name}`}
        >
          <button>{name}</button>
        </a>
      ))}
    </div>
  );
};
