import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | MyResto",
  description: "Create your account to start ordering delicious meals on MyResto.",
};

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
