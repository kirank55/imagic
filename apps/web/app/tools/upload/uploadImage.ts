import { UploadToR2 } from "./UploadToR2";

import { UploadedFile, UploadedFileItem } from "@repo/ui/types/Filetype";

// const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/bmp"];
// function isAcceptedType(file: File) {
//   return ACCEPTED_TYPES.includes(file.type);
// }

// export async function uploadAll(
//   UploadedFiles: UploadedFile,
//   setUploadedFiles: React.Dispatch<React.SetStateAction<UploadedFile>>,
//   userId: string | null
// ) {
//   if (UploadedFiles.length === 0) return;
//   if (!userId) return; // Ensure userId is available before uploading

//   for (const file of UploadedFiles) {
//     if (file.uploadStatus) continue; // Skip if already uploaded

//     try {
//       if (!isAcceptedType(file.filedata)) {
//         const errorFile: UploadedFileItem = {
//           uuid: file.uuid,
//           filedata: file.filedata,
//           error: true,
//           name: file.filedata.name,
//           uploadStatus: false,
//         };

//         // update UploadedFiles with errorFile using setUploadedFiles
//         setUploadedFiles((prevFiles) =>
//           prevFiles.map((f) => (f.uuid === file.uuid ? errorFile : f))
//         );
//         continue;
//       }

//       // Set loading state for the file
//       const loadingFile: UploadedFileItem = {
//         uuid: file.uuid,
//         filedata: file.filedata,
//         name: file.filedata.name,
//         loading: true,
//       };
//       setUploadedFiles((prevFiles) =>
//         prevFiles.map((f) => (f.uuid === file.uuid ? loadingFile : f))
//       );

//       // Upload the file to R2
//       const res = await UploadToR2(file, userId);

//       if (!res) throw new Error("Upload error");

//       const newfile: UploadedFileItem = {
//         uuid: file.uuid,
//         filedata: file.filedata,
//         name: file.filedata.name,
//         url: res,
//         uploadStatus: true,
//         loading: false,
//       };

//       setUploadedFiles((prevFiles) =>
//         prevFiles.map((f) => (f.uuid === file.uuid ? newfile : f))
//       );
//     } catch {
//       const errorFile: UploadedFileItem = {
//         uuid: file.uuid,
//         filedata: file.filedata,
//         error: true,
//         name: file.filedata.name,
//         uploadStatus: false,
//       };
//       // update UploadedFiles with errorFile using setUploadedFiles
//       setUploadedFiles((prevFiles) =>
//         prevFiles.map((f) => (f.uuid === file.uuid ? errorFile : f))
//       );
//     }
//   }
// }

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/bmp"];
function isAcceptedType(file: File) {
  return ACCEPTED_TYPES.includes(file.type);
}

// Helper function to create an updated file item
function createFileUpdater(
  baseFile: UploadedFileItem,
  updates: Partial<UploadedFileItem>
): UploadedFileItem {
  return { ...baseFile, ...updates, loading: false };
}

export async function uploadAll(
  uploadedFiles: UploadedFile,
  setUploadedFiles: React.Dispatch<React.SetStateAction<UploadedFile>>,
  userId: string | null
) {
  if (uploadedFiles.length === 0 || !userId) return;

  // Check if there are any files that actually need uploading to prevent infinite loops.
  const needsUpload = uploadedFiles.some(
    (file) => !file.uploadStatus && !file.error && !file.loading
  );

  if (!needsUpload) return;

  // Set loading state for all files that are about to be uploaded
  setUploadedFiles((prevFiles) =>
    prevFiles.map((file) =>
      !file.uploadStatus && !file.error ? { ...file, loading: true } : file
    )
  );

  const uploadPromises = uploadedFiles.map(
    async (file): Promise<UploadedFileItem> => {
      if (file.uploadStatus || file.error) {
        return file; // Skip files that are already processed
      }

      if (!isAcceptedType(file.filedata)) {
        return createFileUpdater(file, {
          error: true,
          uploadStatus: false,
          name: file.filedata.name,
        });
      }

      try {
        const url = await UploadToR2(file, userId);
        if (!url) throw new Error("Upload failed, no URL returned.");

        return createFileUpdater(file, {
          url,
          uploadStatus: true,
          name: file.filedata.name,
        });
      } catch (error) {
        console.error("Upload error:", error);
        return createFileUpdater(file, {
          error: true,
          uploadStatus: false,
          name: file.filedata.name,
        });
      }
    }
  );

  const results = await Promise.all(uploadPromises);

  // Update state once with the results of all uploads
  setUploadedFiles(results);
}
