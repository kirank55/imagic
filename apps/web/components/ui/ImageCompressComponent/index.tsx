// import React, { useContext } from "react";
// import { v4 as uuidv4 } from "uuid";

// import ListofCompressedimages from "../List/List";
// // import "../ListOfConvertedFiles/list.css";
// import fileContext from "context/uploadPagefileContext/fileContext";
// import { FileContextType } from "@repo/ui/types/Filetype";

// type FileData = { uuid: string; filedata: File };

const ImageCompressComponent: React.FC = () => {
  // const fileCtx = useContext(fileContext);

  // if (!fileCtx) {
  //   throw new Error(
  //     "fileContext is undefined. Make sure FileInput is wrapped in a FileContextProvider."
  //   );
  // }

  // const {
  //   UploadedFiles,
  //   setUploadedFiles,
  //   // CompressionLevel,
  //   // setCompressionLevel,
  //   // Compressedimages,
  //   // setCompressedimages,
  //   // zipStatus,
  //   // setZipStatus,
  // } = fileCtx as FileContextType;

  // const handleClearAllClick = () => {
  //   setUploadedFiles([]);
  // };

  // const handleDownloadClick = () => {
  //   setZipStatus(true);
  //   return;
  // };

  // const handleCompressionlevel = (level: "high" | "medium") => {
  //   setCompressionLevel(level);
  //   if (!UploadedFiles.length) return;
  //   let tempfilearr: FileData[] = [];
  //   for (const file of UploadedFiles) {
  //     tempfilearr = [
  //       ...tempfilearr,
  //       { uuid: uuidv4(), filedata: file.filedata },
  //     ];
  //   }
  //   setCompressedimages([]);
  //   setUploadedFiles(tempfilearr);
  // };

  return (
    <div className="converted-files">
      <h3 style={{ textAlign: "center" }}>
        100kb of Minimum Image size required.
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
      </div>
      {UploadedFiles.length !== 0 && (
        <div className="converted-files">
          <div className="convfileheading">
            <h2>{`Here's your compressed files`}</h2>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <button
                className="med-link styled-corner-small"
                onClick={handleClearAllClick}
              >
                Clear All
              </button>
              <button
                className="med-link styled-corner-small"
                onClick={handleDownloadClick}
              >
                Download All as Zip
              </button>
            </div>
          </div>
          <ol className="converted-files-list">
            <ListofCompressedimages />
            {/* 
            UploadedFiles={UploadedFiles}
            setUploadedFiles={setUploadedFiles}
            CompressionLevel={CompressionLevel}
            Compressedimages={Compressedimages}
            setCompressedimages={setCompressedimages}
            zipStatus={zipStatus}
            setZipStatus={setZipStatus}
            /> 
          </ol>
        </div>
      )} 
          */}
    </div>
  );
};

export default ImageCompressComponent;
