import { Nunito } from 'next/font/google';

import './globals.css';
import { Providers } from '@/shared/components';

const nunito = Nunito({
  subsets: ['cyrillic'],
  variable: '--font-nunito',
  weight: ['400', '500', '600', '700', '800', '900'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link data-rh="true" rel="icon" href="/logoLDM.png" />
      </head>
      <body className={`${nunito.className} min-h-screen bg-white text-neutral-900 antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
