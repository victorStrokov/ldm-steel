import { Header } from "@/components/shared";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LDM Steel | Главная",
};

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen">
      <Header />

      {children}
    </main>
  );
}
