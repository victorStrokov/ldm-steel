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
      <Container className="flex items-center justify-between py-8">
        {/* Левая часть  */}
        <Link href={'/'}>
          <div className="flex items-center gap-4">
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
              <h1 className="text-blue-deep/90 text-2xl font-black uppercase">NEXT LDM STEEL</h1>
              <p className="text-blue-medium text-sm leading-3">
                Комплектующие <br />
                для производства <br />
                металлопластиковых окон
              </p>
            </div>
          </div>
        </Link>

        {hasSearch && <div className="mx-10 flex-1">{<SearchInput />}</div>}

        {/* Правая часть */}
        <div className="flex items-center gap-3">
          <AuthModal open={openAuthModal} onClose={() => setOpenAuthModal(false)} />

          <ProfileButton onClickSignIn={() => setOpenAuthModal(true)} />

          {hasCart && <CartButton />}
        </div>
      </Container>
    </header>
  );
};
