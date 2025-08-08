import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MyResto — Create and Manage Your Restaurant Effortlessly",
  description:
    "MyResto is the all-in-one platform to create, manage, and grow your restaurant business online. Manage menus, orders, reservations, and more—all in one place.",
  keywords: [
    "MyResto",
    "restaurant management",
    "restaurant creator",
    "manage restaurant online",
    "menu management",
    "order management",
    "restaurant dashboard",
    "restaurant software",
  ],
  openGraph: {
    title: "MyResto — Create and Manage Your Restaurant Effortlessly",
    description:
      "Manage your restaurant menus, orders, and reservations with MyResto's easy-to-use platform.",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: "MyResto",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/MyRestoLogo.svg`,
        width: 1200,
        height: 630,
        alt: "MyResto - Restaurant management platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MyResto — Create and Manage Your Restaurant Effortlessly",
    description:
      "Manage your restaurant menus, orders, and reservations with MyResto's easy-to-use platform.",
    images: [`${process.env.NEXT_PUBLIC_SITE_URL}/MyRestoLogo.svg`],
    creator: "@saadksioui",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {children}
      </body>
    </html>
  );
}
