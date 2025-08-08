import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | MyResto",
  description: "Access your MyResto account to manage your orders and settings.",
};

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
