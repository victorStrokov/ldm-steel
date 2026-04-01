'use client';
import { cn } from '@/shared/lib/utils';

import React from 'react';
import { Container } from './container';
import Image from 'next/image';
import Link from 'next/link';
import { CartButton } from './cart-button';
import { SearchInput } from './search-input';
import { ProfileButton } from './profile-button';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { AuthModal } from './modals';

interface Props {
  hasSearch?: boolean;
  hasCart?: boolean;
  className?: string;
}
export const Header: React.FC<Props> = ({ hasSearch = true, hasCart = true, className }) => {
  const router = useRouter();
  const [openAuthModal, setOpenAuthModal] = React.useState(false);

  const searchParams = useSearchParams();

  React.useEffect(() => {
    let toastMessage = '';

    if (searchParams.has('paid')) {
      toastMessage = 'Оплата прошла успешно! 🎉 Информация отправлена на почту.';
    }

    if (searchParams.has('verified')) {
      toastMessage = 'Подтверждение прошло успешно! 🎉';
    }

    if (toastMessage) {
      setTimeout(() => {
        router.replace('/');
        toast.success(toastMessage, {
          duration: 3000,
        });
      }, 1000);
    }
  }, [router, searchParams]);

  return (
    <header className={cn('border-b', className)}>
      <Container className="flex flex-col md:flex-row items-center justify-between py-4 sm:py-6 md:py-8 px-2 sm:px-4 md:px-8 gap-3 md:gap-0 w-full">
        {/* Левая часть  */}
        <Link href={'/'} className="w-full md:w-auto">
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="relative h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16">
              <Image
                src="/logoLDM.png"
                alt="Logo"
                fill
                className="object-contain"
                sizes="(max-width: 640px) 40px, (max-width: 768px) 48px, 64px"
              />
            </div>

            <div>
              <h1 className="text-blue-deep/90 text-lg sm:text-2xl font-black uppercase leading-tight">
                NEXT LDM STEEL
              </h1>
              <p className="text-blue-medium text-xs sm:text-sm leading-3 max-w-[180px] sm:max-w-none">
                Комплектующие <br />
                для производства <br />
                металлопластиковых окон
              </p>
            </div>
          </div>
        </Link>

        {hasSearch && (
          <div className="w-full md:mx-10 flex-1 order-3 md:order-none mt-3 md:mt-0">
            <SearchInput />
          </div>
        )}

        {/* Правая часть */}
        <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto justify-end order-2 md:order-none mt-3 md:mt-0">
          <AuthModal open={openAuthModal} onClose={() => setOpenAuthModal(false)} />

          <ProfileButton onClickSignIn={() => setOpenAuthModal(true)} />

          {hasCart && <CartButton />}
        </div>
      </Container>
    </header>
  );
};
