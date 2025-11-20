import { cn } from '@/shared/lib/utils';

import React from 'react';
// import { Button } from "../ui/button";
import { Container } from './container';
import Image from 'next/image';
import Link from 'next/link';
import { CartButton } from './cart-button';
import { SearchInput } from './search-input';
import { ProfileButton } from './profile-button';

interface Props {
  className?: string;
}
export const Header: React.FC<Props> = ({ className }) => {
  return (
    <header className={cn('border-b', className)}>
      <Container className="flex items-center justify-between py-8 ">
        {/* Левая часть  */}
        <Link href={'/'}>
          <div className="flex items-center gap-4 ">
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16">
              <Image
                src="/logoLDM.png"
                alt="Logo"
                fill
                className="object-contain"
                sizes="(max-width: 640px) 40px, (max-width: 768px) 48px, 64px"
              />
            </div>

            <div>
              <h1 className="uppercase font-black text-2xl text-blue-deep/90 ">NEXT LDM STEEL</h1>
              <p className="text-sm text-blue-medium leading-3">
                Комплектующие <br />
                для производства <br />
                металлопластиковых окон
              </p>
            </div>
          </div>
        </Link>

        {/* {hasSearch && ( */}
        <div className="mx-10 flex-1">{<SearchInput />}</div>
        {/* )} */}

        {/* Правая часть */}
        <div className="flex items-center gap-3">
          {/* <AuthModal open={openAuthModal} onClose={() => setOpenAuthModal(false)} /> */}

          {/* <ProfileButton onClickSignIn={() => setOpenAuthModal(true)} /> */}
          <ProfileButton />
          {/* {hasCart && } */}
          <CartButton />
        </div>
      </Container>
    </header>
  );
};
