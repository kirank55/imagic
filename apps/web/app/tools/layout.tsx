"use client";
import FileContextProvider from "context/fileContext/FileContextProvider";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <FileContextProvider>
        {children}
      </FileContextProvider>
    </>
  );
}
