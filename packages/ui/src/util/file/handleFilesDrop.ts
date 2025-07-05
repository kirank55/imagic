import {
  preventDefaultAndPropagation,
  removeDraggingFileClass,
} from "../helpers";
import { v4 as uuidv4 } from "uuid";

export interface HandleFilesByDropEvent extends DragEvent {
  dataTransfer: DataTransfer;
}
/**
 * Utility to convert a FileList to an array of UploadedFile objects with UUIDs.
 */
function fileListToUploadedFiles(
  fileList: FileList,
  currentFiles: UploadedFile[]
): UploadedFile[] {
  const files = Array.from(fileList);
  const deduped = deduplicateFilesByNameAndSize(files, currentFiles);
  return deduped.map((file) => ({ uuid: uuidv4(), filedata: file }));
}

function deduplicateFilesByNameAndSize(
  newFiles: File[],
  currentFiles: UploadedFile[]
): File[] {
  const existing = new Set(
    currentFiles.map((f) => `${f.filedata.name}_${f.filedata.size}`)
  );
  return newFiles.filter((f) => !existing.has(`${f.name}_${f.size}`));
}

/**
 * Handles files dropped via drag-and-drop.
 */
export async function handleFilesByDrop(
  event: HandleFilesByDropEvent,
  setUploadedFiles: SetUploadedFiles
): Promise<void> {
  preventDefaultAndPropagation(event);

  const droppedFiles: FileList = event.dataTransfer.files;
  if (droppedFiles.length > 0) {
    // Clear state before adding new files
    setUploadedFiles(() => []);
    setUploadedFiles((currentFiles: UploadedFile[]) => {
      const newFiles = fileListToUploadedFiles(droppedFiles, currentFiles);
      const merged = [...currentFiles, ...newFiles];
      return merged;
    });
    removeDraggingFileClass();
  }
}

// export async function handleFilesByDrop(
//   event: HandleFilesByDropEvent,
//   setUploadedFiles: SetUploadedFiles
// ): Promise<void> {
//   preventDefaultAndPropagation(event);

//   const droppedfiles: FileList = event.dataTransfer.files;

//   let newfilearr: UploadedFile[] = [];

//   if (droppedfiles.length > 0) {
//     for (const file of droppedfiles) {
//       newfilearr = [...newfilearr, { uuid: uuidv4(), filedata: file }];
//     }

//     setUploadedFiles((currentFiles: UploadedFile[]) => [...currentFiles, ...newfilearr]);

//     // console.log(newfilearr);

//     removeDraggingFileClass();
//   }
// }

interface UploadedFile {
  uuid: string;
  filedata: File;
}

export interface HandleFilesByInputEvent extends Event {
  target: EventTarget & { files: FileList };
}

type SetUploadedFiles = (
  updater: (currentFiles: UploadedFile[]) => UploadedFile[]
) => void;

export async function handleFilesByInput(
  event: HandleFilesByInputEvent,
  setUploadedFiles: SetUploadedFiles
): Promise<void> {
  preventDefaultAndPropagation(event);

  const droppedfiles = event.target.files;

  if (droppedfiles.length > 0) {
    // Clear state before adding new files
    setUploadedFiles(() => []);
    setUploadedFiles((currentFiles: UploadedFile[]) => {
      const newFiles = fileListToUploadedFiles(droppedfiles, currentFiles);
      const merged = [...currentFiles, ...newFiles];
      return merged;
    });
    removeDraggingFileClass();
  }
}
