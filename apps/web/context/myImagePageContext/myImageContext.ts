"use client";
import { MyImageContextType } from "@repo/ui/types/myImage";
import React from "react";

const myImageContext = React.createContext<MyImageContextType | undefined>(
  undefined
);

export default myImageContext;
