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
      <FileContextProvider>
        <div className="tools p-10">{children}</div>
      </FileContextProvider>
    </UserContextProvider>
  );
}
