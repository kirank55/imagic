import React, { useEffect, useState, useContext } from "react";

import "./list.css";

export type FileData = {
  uuid: string;
  filedata: File;
  src?: string;
  name?: string;
  originalSize?: string;
  compressedSize?: string;
  error?: boolean;
  uploadStatus: boolean;
};

import fileContext from "context/uploadPagefileContext/fileContext";

import { FileContextType } from "context/uploadPagefileContext/types";

import ImagesUploadedtoBucketListitem from "./ImagesUploadedtoBucketListitem";

const ListofUploadedimages: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const fileCtx = useContext(fileContext);

  if (!fileCtx) {
    throw new Error(
      "fileContext is undefined. Make sure FileInput is wrapped in a FileContextProvider."
    );
  }

  const {
    UploadedFiles,
    setUploadedFiles,
    ImagesUploadedtoBucket,
    setImagesUploadedtoBucket,
  } = fileCtx as FileContextType;

  useEffect(() => {
    setImagesUploadedtoBucket([]); // Clear compressed images on new upload
    if (UploadedFiles.length === 0) return;

    async function uploadAll() {
      console.log(UploadedFiles);

      const newCompressed: FileData[] = [];
      for (const file of UploadedFiles) {
        try {
          // const res = await image_to_base64(file.filedata);
          // const resized = await reduce_image_file_size(
          //   res,
          //   file.filedata.type,
          //   CompressionLevel as "high" | "medium"
          // );
          // const new_size = calc_image_size(resized) + "KB";
          const newfile: FileData = {
            uuid: file.uuid,
            filedata: file.filedata,
            // src: resized,
            name: file.filedata.name,
            // originalSize: returnFileSize(file.filedata.size),
            // compressedSize: new_size,
            uploadStatus: true,
          };
          newCompressed.push(newfile);
        } catch {
          // const errorFile: FileData = {
          //   uuid: file.uuid,
          //   filedata: file.filedata,
          //   error: true,
          //   name: file.filedata.name,
          // };
          // newCompressed.push(errorFile);
        }
      }
      setImagesUploadedtoBucket(newCompressed);
    }

    uploadAll();
  }, [UploadedFiles, setImagesUploadedtoBucket]);

  useEffect(() => {
    if (ImagesUploadedtoBucket.length < UploadedFiles.length) {
      setLoading(true);
    } else {
      setLoading(false);
    }

    console.log([UploadedFiles, ImagesUploadedtoBucket]);
  }, [UploadedFiles, ImagesUploadedtoBucket]);

  return (
    <>
      {loading && <div>Loading...</div>}
      Uploaded images...
      {ImagesUploadedtoBucket.map((file) => (
        <ImagesUploadedtoBucketListitem key={file.uuid} file={file} />
      ))}
    </>
  );
};

export default ListofUploadedimages;
