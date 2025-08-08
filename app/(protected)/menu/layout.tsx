import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Menu",
  description: "Menu page of the application",
};

const MenuLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      {children}
    </>
  )
};

export default MenuLayout
