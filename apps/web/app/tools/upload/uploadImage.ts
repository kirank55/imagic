import { UploadToR2 } from "./UploadToR2";

import { UploadedFile, UploadedFileItem } from "@repo/ui/types/Filetype";

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
