"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import styles from "./Header.module.css";

const navigation = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Book Tests",
    href: "/patient/test-list",
  },
  {
    label: "Health Packages",
    href: "/patient/health-packages",
  },
  {
    label: "Our Centres",
    href: "/our-centres",
  },
  {
    label: "About Us",
    href: "/about-us",
  },
];

interface NavigationLinksProps {
  mobile?: boolean;
}

function isActiveRoute(
  pathname: string,
  href: string
): boolean {
  // Home must be active only on the homepage.
  if (href === "/") {
    return pathname === "/";
  }

  // Highlight listing links on their nested pages.
  if (
    pathname === href ||
    pathname.startsWith(`${href}/`)
  ) {
    return true;
  }

  // The Test Details preview currently uses a
  // separate route rather than a nested test-list route.
  if (
    href === "/patient/test-list" &&
    (pathname === "/patient/test-details" ||
      pathname.startsWith("/patient/test-details/"))
  ) {
    return true;
  }

  return false;
}

export default function NavigationLinks({
  mobile = false,
}: Readonly<NavigationLinksProps>) {
  const pathname = usePathname();

  return (
    <>
      {navigation.map((item) => {
        const isActive = isActiveRoute(
          pathname,
          item.href
        );

        const className = mobile
          ? `${styles.mobileNavLink} ${
              isActive ? styles.mobileNavLinkActive : ""
            }`
          : `${styles.navLink} ${
              isActive ? styles.navLinkActive : ""
            }`;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={className}
            aria-current={
              pathname === item.href
                ? "page"
                : isActive
                  ? "location"
                  : undefined
            }
          >
            {item.label}
          </Link>
        );
      })}
    </>
  );
}