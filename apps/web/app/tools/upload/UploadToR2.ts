import { debug } from "console";
import { FileData } from "./ListofUploadedimages";

export async function UploadToR2(
  file: FileData,
  userId: string,
  detectedType: string
): Promise<string | false> {
  console.log("Starting R2 upload:", {
    fileName: file.filedata.name,
    userId,
    detectedType,
  });
  const formData = new FormData();

  formData.append("file", file.filedata);
  formData.append("userId", userId);
  formData.append("detectedType", detectedType);

  const res = await fetch("/api/upload-to-r2", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  console.log("Upload response:", { status: res.status, data });
  if (res.ok && data.success) {
    return data.url; // The public URL of the uploaded file
  }
  return false;
}
