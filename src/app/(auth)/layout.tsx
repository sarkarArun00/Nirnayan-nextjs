import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({
  children,
}: Readonly<AuthLayoutProps>) {
  return <>{children}</>;
}