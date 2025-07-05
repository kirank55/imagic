import React, { useEffect, useState, useContext, useRef } from "react";

import { UploadToR2 } from "./UploadToR2";

import "components/ui/List/list.css";

export type FileData = {
  uuid: string;
  filedata: File;
  src?: string;
  name?: string;
  originalSize?: string;
  loading?: boolean;
  error?: boolean;
  url?: string;
};

import fileContext from "context/uploadPagefileContext/fileContext";

import { FileContextType } from "context/uploadPagefileContext/types";

import ImagesUploadedtoBucketListitem from "./ImagesUploadedtoBucketListitem";
import { getCurrentUser } from "auth/currentUser";
import { useUploadPageFileContext } from "context/uploadPagefileContext/useUploadPageFileContext";
import { uploadAll } from "./uploadImage";
import { useUserContext } from "context/UserContext/useUploadPageFileContext";

const ListofUploadedimages: React.FC = () => {
  // const [loading, setLoading] = useState(false);

  // const [userId, setUserId] = useState<string | null>(null);

  // const fileCtx = useContext(fileContext);

  // if (!fileCtx) {
  //   throw new Error(
  //     "fileContext is undefined. Make sure FileInput is wrapped in a FileContextProvider."
  //   );
  // }
  // Use useRef to persist uploaded UUIDs across renders/effect runs
  // const uploadedUUIDs = useRef<Set<string>>(new Set());

  const { UploadedFiles, setUploadedFiles } = useUploadPageFileContext();

  const { userId } = useUserContext();
  // useEffect(() => {
  //   if (UploadedFiles.length === 0) return;

  //   const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/bmp"];
  //   function isAcceptedType(file: File) {
  //     return ACCEPTED_TYPES.includes(file.type);
  //   }

  //   async function uploadAll() {
  //     if (!userId) return; // Ensure userId is available before uploading
  //     const filesAfterUploadAction: FileData[] = [];
  //     for (const file of UploadedFiles) {
  //       if (uploadedUUIDs.current.has(file.uuid)) continue; // Skip if already uploaded
  //       try {
  //         if (!isAcceptedType(file.filedata)) {
  //           const errorFile: FileData = {
  //             uuid: file.uuid,
  //             filedata: file.filedata,
  //             error: true,
  //             name: file.filedata.name,
  //             uploadStatus: false,
  //           };
  //           filesAfterUploadAction.push(errorFile);
  //           uploadedUUIDs.current.add(file.uuid);
  //           continue;
  //         }
  //         const res = await UploadToR2(file, userId);
  //         if (!res) throw new Error("Upload error");
  //         const newfile: FileData = {
  //           uuid: file.uuid,
  //           filedata: file.filedata,
  //           name: file.filedata.name,
  //           url: res,
  //           uploadStatus: true,
  //         };
  //         filesAfterUploadAction.push(newfile);
  //         uploadedUUIDs.current.add(file.uuid);
  //       } catch {
  //         const errorFile: FileData = {
  //           uuid: file.uuid,
  //           filedata: file.filedata,
  //           error: true,
  //           name: file.filedata.name,
  //           uploadStatus: false,
  //         };
  //         filesAfterUploadAction.push(errorFile);
  //         uploadedUUIDs.current.add(file.uuid);
  //       }
  //     }
  //     if (filesAfterUploadAction.length > 0) {
  //       setImagesUploadedtoBucket([
  //         ...ImagesUploadedtoBucket,
  //         ...filesAfterUploadAction,
  //       ]);
  //     }
  //   }

  //   uploadAll();
  // }, [UploadedFiles, setImagesUploadedtoBucket, userId]);

  useEffect(() => {
    //   if (ImagesUploadedtoBucket.length < UploadedFiles.length) {
    //     setLoading(true);
    //   } else {
    //     setLoading(false);
    // }

    //   console.log({
    //     UploadedFiles,
    //     ImagesUploadedtoBucket,
    //   });
    uploadAll(UploadedFiles, setUploadedFiles, userId);
  }, [UploadedFiles, setUploadedFiles, userId]);

  return (
    <div className="container">
      {/* {loading ? (
        //  <div>Loading...</div>
        <li className="converted-file loading">
          <div
            className="converted-file-content"
            style={{ justifyContent: "center" }}
          >
            <span className="filename" style={{ width: "100%" }}>
              Loading...
            </span>
          </div>
        </li>
      ) : (
        <div className="convfileheading" style={{ justifyContent: "center" }}>
          <h2>Images uploaded successfully</h2>
        </div>
      )} */}

      {/* Uploaded images... */}
      {UploadedFiles.map((file) => (
        <ImagesUploadedtoBucketListitem key={file.uuid} file={file} />
      ))}
    </div>
  );
};

export default ListofUploadedimages;
