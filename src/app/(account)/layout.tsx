import type { ReactNode } from "react";

interface AccountLayoutProps {
  children: ReactNode;
}

export default function AccountLayout({
  children,
}: Readonly<AccountLayoutProps>) {
  return <>{children}</>;
}