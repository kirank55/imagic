import {
  preventDefaultAndPropagation,
  removeDraggingFileClass,
} from "../helpers";

import { v4 as uuidv4 } from "uuid";

export interface HandleFilesByDropEvent extends DragEvent {
  dataTransfer: DataTransfer;
}

/**
 * Converts a FileList to an array of UploadedFile objects, each with a unique UUID.
 * Skips files that are already in the currentFiles array (by name and size).
 */
function fileListToUploadedFiles(
  fileList: FileList
  // currentFiles: UploadedFile[]
): UploadedFile[] {
  // Convert FileList to a regular array
  const filesArray = Array.from(fileList);

  // Remove files that are already uploaded (by name and size)
  // const uniqueFiles = removeDuplicateFiles(filesArray, currentFiles);

  // Create UploadedFile objects with a new UUID for each file
  return filesArray.map((file) => ({
    uuid: uuidv4(),
    filedata: file,
  }));
}

/**
 * Removes files from newFiles that already exist in currentFiles (by name and size).
 */
// function removeDuplicateFiles(
//   newFiles: File[],
//   currentFiles: UploadedFile[]
// ): File[] {
//   // Create a set of "name_size" strings for existing files
//   const existingFilesSet = new Set(
//     currentFiles.map((uploaded) => `${uploaded.filedata.name}_${uploaded.filedata.size}`)
//   );

//   // Only keep files that are not in the existingFilesSet
//   return newFiles.filter(
//     (file) => !existingFilesSet.has(`${file.name}_${file.size}`)
//   );
// }

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

    // Convert FileList to UploadedFile objects and set state
    const newFiles = fileListToUploadedFiles(droppedFiles);
    setUploadedFiles(() => newFiles);

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

    // Convert FileList to UploadedFile objects and set state
    const newFiles = fileListToUploadedFiles(droppedfiles);
    setUploadedFiles(() => newFiles);

    removeDraggingFileClass();
  }
}
