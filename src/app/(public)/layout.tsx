import type { ReactNode } from "react";

import Footer from "@/components/layout/Footer/Footer";
import Header from "@/components/layout/Header/Header";

interface PublicLayoutProps {
  children: ReactNode;
}

export default function PublicLayout({
  children,
}: Readonly<PublicLayoutProps>) {
  return (
    <>
      <Header />

      <main id="main-content">{children}</main>

      <Footer />
    </>
  );
}