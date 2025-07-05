"use client";
import React from "react";
import { FileContextType } from "./types";

const fileContext = React.createContext<FileContextType | undefined>(undefined);

export default fileContext;
