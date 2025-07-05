"use client";
import FileContextProvider from "context/uploadPagefileContext/FileContextProvider";
import UserContextProvider from "context/UserContext/UserContextProvider";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UserContextProvider>
      <FileContextProvider>{children}</FileContextProvider>
    </UserContextProvider>
  );
}
