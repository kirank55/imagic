import React from "react";

export interface myImageType {
  userId: string;
  url: string;
  name: string;
  uploadedAt: Date;
  _id: string;
}

export type MyImageContextType = {
  myImageFiles: myImageType[];
  setMyImageFiles: React.Dispatch<React.SetStateAction<myImageType[]>>;
  userId: string | null;
};
