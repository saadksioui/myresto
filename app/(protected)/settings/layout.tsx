import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
  description: "Settings page of the application",
};

const SettingsLayout = ({
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

export default SettingsLayout
