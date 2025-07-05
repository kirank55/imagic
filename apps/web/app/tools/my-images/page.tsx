"use client";
import React, { useContext } from "react";
import "./my-images.css";
import fileContext from "context/uploadPagefileContext/fileContext";
import { FileContextType } from "context/uploadPagefileContext/types";
import Image from "next/image";

// Dummy data for demonstration. Replace with real data fetching logic.
const images = [
  {
    id: "1",
    src: "/public/sample1.jpg",
    name: "Sample 1",
  },
  {
    id: "2",
    src: "/public/sample2.jpg",
    name: "Sample 2",
  },
  {
    id: "3",
    src: "/public/sample3.jpg",
    name: "Sample 3",
  },
];

const MyImagesPage: React.FC = () => {
  const fileCtx = useContext(fileContext);

  if (!fileCtx) {
    throw new Error(
      "fileContext is undefined. Make sure FileInput is wrapped in a FileContextProvider."
    );
  }

  const { ImagesUploadedtoBucket } = fileCtx as FileContextType;

  return (
    <div className="gallery-container">
      <h1>My Images</h1>
      <div className="gallery-grid">
        {ImagesUploadedtoBucket.map((img) => (
          <div className="gallery-item" key={img._id}>
            <div className="image-wrapper">
              <Image
                src={img.url}
                alt={img.name ? img.name : "gallery-img"}
                className="gallery-img"
                width={200}
                height={200}
                unoptimized
              />
            </div>
            <div className="toolbar">
              <a href={`/tools/my-images/${img.uuid}`} className="open-btn">
                Open
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyImagesPage;
