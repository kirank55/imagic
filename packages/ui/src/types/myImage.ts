import React from "react";

export interface myImageType {
  _id: string; // MongoDB ObjectId
  userId: string;
  url: string;
  name: string;
  uploadedAt: Date;
  size: number;
  detectedType: string;

  tags?: string[];
}

export type MyImageContextType = {
  myImageFiles: myImageType[];
  setMyImageFiles: React.Dispatch<React.SetStateAction<myImageType[]>>;
  userId: string | null;
};

export interface OptimizationOptions {
  quality: number;
  format: "webp" | "jpeg" | "png" | "original";
  width?: number;
  height?: number;
  autoOptimize: boolean;
  autoCompress: boolean;
}

export interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenWidth: number;
  connection: string;
}
