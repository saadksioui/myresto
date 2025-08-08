import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Livreurs",
  description: "Livreurs page of the application",
};

const LivreursLayout = ({
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

export default LivreursLayout
