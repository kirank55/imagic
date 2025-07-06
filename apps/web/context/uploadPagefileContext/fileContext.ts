"use client";
import React from "react";
import { FileContextType } from "@repo/ui/types/Filetype";
const fileContext = React.createContext<FileContextType | undefined>(undefined);

export default fileContext;
