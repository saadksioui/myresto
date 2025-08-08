import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Orders",
  description: "Orders page of the application",
};

const OrdersLayout = ({
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

export default OrdersLayout
