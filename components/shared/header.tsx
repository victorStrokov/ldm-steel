import { cn } from "@/lib/utils";

import React from "react";
// import { Button } from "../ui/button";
import { Container } from "./container";
import Image from "next/image";
import Link from "next/link";
import { CartButton } from "./cart-button";

interface Props {
  className?: string;
}
export const Header: React.FC<Props> = ({ className }) => {
  return (
    <header className={cn(" border-b", className)}>
      <Container className="flex items-center justify-between py-8 ">
        {/* Левая часть  */}
        <Link href={"/"}>
          <div className="flex items-center gap-4 ">
            <Image src="/logo2.jpg" alt="Logo" width={40} height={40} />
            <div>
              <h1 className="uppercase font-black text-2xl">NEXT LDM STEEL</h1>
              <p className="text-sm text-gray-500 leading-3">
                Комплектующие для производства металлопластиковых окон
              </p>
            </div>
          </div>
        </Link>

        {/* {hasSearch && ( */}
        <div className="mx-10 flex-1">{/* <SearchInput /> */}</div>
        {/* )} */}

        {/* Правая часть */}
        <div className="flex items-center gap-3">
          {/* <AuthModal open={openAuthModal} onClose={() => setOpenAuthModal(false)} /> */}

          {/* <ProfileButton onClickSignIn={() => setOpenAuthModal(true)} /> */}

          {/* {hasCart && } */}
          <CartButton />
        </div>
      </Container>
    </header>
  );
};
