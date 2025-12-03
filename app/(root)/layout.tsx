import { Header } from '@/shared/components/shared';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'LDM Steel | Главная',
};

export default function HomeLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen flex flex-col">
      <Suspense>
        <Header />
      </Suspense>
      <div className="flex-1 container mx-auto px-4 md:px-6">{children}</div>
      {modal}
    </main>
  );
}
