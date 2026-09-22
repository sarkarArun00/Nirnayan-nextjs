import type { ReactNode } from "react";

interface CommerceLayoutProps {
  children: ReactNode;
}

export default function CommerceLayout({
  children,
}: Readonly<CommerceLayoutProps>) {
  return <>{children}</>;
}