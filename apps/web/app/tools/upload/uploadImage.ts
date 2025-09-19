import { UploadToR2 } from "./UploadToR2";

import { UploadedFile, UploadedFileItem } from "@repo/ui/types/Filetype";

const ACCEPTED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/bmp",
  "image/gif",
  "image/webp",
  "image/svg+xml",
];

function isAcceptedType(file: File) {
  const detectedType = detectImageType(file);
  return (
    ACCEPTED_TYPES.includes(detectedType) || ACCEPTED_TYPES.includes(file.type)
  );
}

/**
 * Detects image type from file extension and validates it
 * @param file The file to detect type for
 * @returns The detected MIME type or fallback type
 */
function detectImageType(file: File): string {
  // console.log(
  //   "detectImageType called with file:",
  //   file.name,
  //   "original type:",
  //   file.type
  // );

  // First try to use the file's native type if it's valid
  if (file.type && ACCEPTED_TYPES.includes(file.type)) {
    // console.log("Using native file type:", file.type);
    return file.type;
  }

  // If no type or invalid type, detect from file extension
  const fileName = file.name.toLowerCase();
  // console.log("Detecting from filename:", fileName);

  if (fileName.endsWith(".jpg") || fileName.endsWith(".jpeg")) {
    // console.log("Detected as JPEG");
    return "image/jpeg";
  } else if (fileName.endsWith(".png")) {
    // console.log("Detected as PNG");
    return "image/png";
  } else if (fileName.endsWith(".bmp")) {
    // console.log("Detected as BMP");
    return "image/bmp";
  } else if (fileName.endsWith(".gif")) {
    // console.log("Detected as GIF");
    return "image/gif";
  } else if (fileName.endsWith(".webp")) {
    // console.log("Detected as WebP");
    return "image/webp";
  } else if (fileName.endsWith(".svg")) {
    // console.log("Detected as SVG");
    return "image/svg+xml";
  }

  // Default fallback
  console.log("Using fallback type: image/jpeg");
  return "image/jpeg";
}

// Helper function to create an updated file item
function createFileUpdater(
  baseFile: UploadedFileItem,
  updates: Partial<UploadedFileItem>
): UploadedFileItem {
  return { ...baseFile, ...updates, loading: false };
}

/**
 * Handles the upload logic for a single file.
 * @param file The file item to upload.
 * @param userId The ID of the user uploading the file.
 * @returns A promise that resolves to the updated file item.
 */
async function uploadOne(
  file: UploadedFileItem,
  userId: string
): Promise<UploadedFileItem> {
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
    const detectedType = detectImageType(file.filedata);
    // console.log(
    //   "Detected type for file:",
    //   file.filedata.name,
    //   "->",
    //   detectedType
    // );
    // console.log("Original file.type:", file.filedata.type);

    const url = await UploadToR2(file, userId, detectedType);
    if (!url) throw new Error("Upload failed, no URL returned.");

    console.log({ url });

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

export async function uploadAll(
  uploadedFiles: UploadedFile,
  setUploadedFiles: React.Dispatch<React.SetStateAction<UploadedFile>>,
  userId: string | null
) {
  if (uploadedFiles.length === 0 || !userId) return;

  const uploadPromises: Promise<UploadedFileItem>[] = [];
  let needsStateUpdate = false;

  const updatedFiles = uploadedFiles.map((file) => {
    // Check if the file needs to be uploaded.
    if (!file.uploadStatus && !file.error && !file.loading) {
      needsStateUpdate = true;
      // Add the upload promise to the list.
      uploadPromises.push(uploadOne(file, userId));
      // Return the file with the loading state set to true.
      return { ...file, loading: true };
    } else {
      // If the file doesn't need to be uploaded, add a resolved promise for it.
      uploadPromises.push(Promise.resolve(file));
      return file;
    }
  });

  // If no files needed an upload, we can exit early.
  if (!needsStateUpdate) return;

  // Update the state to show the loading indicators.
  setUploadedFiles(updatedFiles);

  // Wait for all uploads to complete.
  const results = await Promise.all(uploadPromises);

  // Update the state once with the final results of all uploads.
  setUploadedFiles(results);
}
