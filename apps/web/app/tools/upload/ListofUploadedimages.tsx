import React, { useEffect } from "react";

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

import ImagesUploadedtoBucketListitem from "./ImagesUploadedtoBucketListitem";
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
    uploadAll(UploadedFiles, setUploadedFiles, userId);
  }, [UploadedFiles, setUploadedFiles, userId]);

  if (UploadedFiles.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-500 dark:text-slate-400">
          No files uploaded yet
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">
          Processing Queue
        </h3>
        <span className="text-sm text-slate-500 dark:text-slate-400">
          {UploadedFiles.length} file{UploadedFiles.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* File List */}
      <div className="space-y-3">
        {UploadedFiles.map((file) => (
          <ImagesUploadedtoBucketListitem key={file.uuid} file={file} />
        ))}
      </div>
    </div>
  );
};

export default ListofUploadedimages;
