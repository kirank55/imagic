"use client"
import React, { useEffect, useState,useContext } from "react";

import"./list.css"

export type FileData = {
  uuid: string;
  filedata: File;
  src?: string;
  name?: string;
  originalSize?: string;
  compressedSize?: string;
  error?: boolean;
};


import fileContext from "context/fileContext/fileContext";
import { FileContextType } from "context/fileContext/types";
import CompressedImageListitem from "./CompressedImageListitem";
import { calc_image_size, image_to_base64, reduce_image_file_size, returnFileSize } from "@repo/ui/util/helpers";



const ListofCompressedimages: React.FC = ( ) => {
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
    CompressionLevel,
    setCompressionLevel,
    Compressedimages,
    setCompressedimages,
    zipStatus,
    setZipStatus,
  } = fileCtx as FileContextType;

  useEffect(() => {
    setCompressedimages([]); // Clear compressed images on new upload
    if (UploadedFiles.length === 0) return;
    async function compressAll() {
      const newCompressed: FileData[] = [];
      for (const file of UploadedFiles) {
        try {
          const res = await image_to_base64(file.filedata);
          const resized = await reduce_image_file_size(
            res,
            file.filedata.type,
            CompressionLevel as "high" | "medium"
          );
          const new_size = calc_image_size(resized) + "KB";
          const newfile: FileData = {
            uuid: file.uuid,
            filedata: file.filedata,
            src: resized,
            name: file.filedata.name,
            originalSize: returnFileSize(file.filedata.size),
            compressedSize: new_size,
          };
          newCompressed.push(newfile);
        } catch {
          const errorFile: FileData = {
            uuid: file.uuid,
            filedata: file.filedata,
            error: true,
            name: file.filedata.name,
          };
          newCompressed.push(errorFile);
        }
      }
      setCompressedimages(newCompressed);
    }

    compressAll();

  }, [UploadedFiles, CompressionLevel, setCompressedimages]);

  useEffect(() => {
    console.log(Compressedimages);
  }, [Compressedimages]);

  useEffect(() => {

    if (Compressedimages.length < UploadedFiles.length) {
      setLoading(true);
    } else {
      setLoading(false);
    }

    console.log([UploadedFiles, Compressedimages])

  }, [UploadedFiles, Compressedimages]);


  return (
    <>
      {loading && (
        <div>Loading...</div>
      )}

      {Compressedimages.map((file) => (
        <CompressedImageListitem key={file.uuid} file={file} setUploadedFiles={setUploadedFiles} setCompressedimages={setCompressedimages} />
      ))}
    </>
  );
};

export default ListofCompressedimages;
