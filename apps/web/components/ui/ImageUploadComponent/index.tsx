"use client"
import React, { useContext } from "react";

import ListofUploadedimages from "../List/ListofUploadedimages";
// import "../ListOfConvertedFiles/list.css";
import fileContext from "context/fileContext/fileContext";
import { FileContextType } from "context/fileContext/types"; // Adjust the import path as necessary

type FileData = { uuid: string; filedata: File };

const ImageUploadComponent: React.FC = () => {
  const fileCtx = useContext(fileContext);

  if (!fileCtx) {
    throw new Error(
      "fileContext is undefined. Make sure FileInput is wrapped in a FileContextProvider."
    );
  }

  const {
    UploadedFiles,
    // setUploadedFiles,
    // CompressionLevel,
    // setCompressionLevel,
    // Compressedimages,
    // setCompressedimages,
  } = fileCtx as FileContextType;

  // const handleClearAllClick = () => {
  //   setUploadedFiles([]);
  // };
 

  return (
    <div className="converted-files">
      <h3 style={{ textAlign: "center" }}>
        10kb of Minimum Image size required.
      </h3>
      {/* <div className="convfileheading">
        <h2>Compression Level</h2>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button
            className={`med-link styled-corner-small${
              CompressionLevel === "medium" ? " active" : ""
            }`}
            onClick={() => handleCompressionlevel("medium")}
          >
            Medium
          </button>
          <button
            className={`med-link styled-corner-small${
              CompressionLevel === "high" ? " active" : ""
            }`}
            onClick={() => handleCompressionlevel("high")}
          >
            High
          </button>
        </div>
      </div> */}
    
      {UploadedFiles.length !== 0 && (
        <div className="converted-files">
       
          <div className="convfileheading">
            <h2>Images uploaded successfully</h2>
s
          </div>

          <ol className="converted-files-list">
            
              <ListofUploadedimages />
   
          </ol>
        </div>
      )}
    </div>
  );
};

export default ImageUploadComponent;
