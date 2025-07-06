"use client";
import React from "react";
import "./my-images.css";
import Image from "next/image";
import { useMyImageContext } from "context/myImagePageContext/useUploadPageFileContext";

const MyImagesPage: React.FC = () => {
  const { myImageFiles } = useMyImageContext();

  console.log(myImageFiles);
  return (
    <div className="gallery-container">
      <h1>My Images</h1>
      <div className="gallery-grid">
        {/* {myImageFiles.map((img) => (
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
              <a href={`/tools/my-images/${img._id}`} className="open-btn">
                Open
              </a>
            </div>
          </div>
        ))} */}
      </div>
    </div>
  );
};

export default MyImagesPage;
