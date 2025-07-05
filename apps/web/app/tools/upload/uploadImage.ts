import { UploadToR2 } from "./UploadToR2";

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/bmp"];
function isAcceptedType(file: File) {
  return ACCEPTED_TYPES.includes(file.type);
}

interface UploadedFile {
  uuid: string;
  filedata: File;
  uploadStatus?: boolean;
}

interface FileData {
  uuid: string;
  filedata: File;
  name: string;
  uploadStatus: boolean;
  error?: boolean;
  url?: string;
}

export async function uploadAll(
  UploadedFiles: UploadedFile[],
  setUploadedFiles: React.Dispatch<React.SetStateAction<UploadedFile[]>>,
  userId: string | null
) {
  if (UploadedFiles.length === 0) return;
  if (!userId) return; // Ensure userId is available before uploading

  for (const file of UploadedFiles) {
    if (file.uploadStatus) continue; // Skip if already uploaded

    try {
      if (!isAcceptedType(file.filedata)) {
        const errorFile: FileData = {
          uuid: file.uuid,
          filedata: file.filedata,
          error: true,
          name: file.filedata.name,
          uploadStatus: false,
        };

        // update UploadedFiles with errorFile using setUploadedFiles
        setUploadedFiles((prevFiles) =>
          prevFiles.map((f) => (f.uuid === file.uuid ? errorFile : f))
        );
        continue;
      }

      const res = await UploadToR2(file, userId);

      if (!res) throw new Error("Upload error");

      const newfile: FileData = {
        uuid: file.uuid,
        filedata: file.filedata,
        name: file.filedata.name,
        url: res,
        uploadStatus: true,
      };

      setUploadedFiles((prevFiles) =>
        prevFiles.map((f) => (f.uuid === file.uuid ? newfile : f))
      );
    } catch {
      const errorFile: FileData = {
        uuid: file.uuid,
        filedata: file.filedata,
        error: true,
        name: file.filedata.name,
        uploadStatus: false,
      };
      // update UploadedFiles with errorFile using setUploadedFiles
      setUploadedFiles((prevFiles) =>
        prevFiles.map((f) => (f.uuid === file.uuid ? errorFile : f))
      );
    }
  }
}
