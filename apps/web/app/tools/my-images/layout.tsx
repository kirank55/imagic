"use client";
import MyImageContextProvider from "context/myImagePageContext/MyImageContextProvider";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <MyImageContextProvider>{children}</MyImageContextProvider>;
}
