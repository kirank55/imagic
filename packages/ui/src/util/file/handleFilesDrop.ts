import {
  HandleFilesByDropEvent,
  HandleFilesByInputEvent,
  SetUploadedFiles,
  UploadedFile,
} from "../../types/Filetype";
import {
  preventDefaultAndPropagation,
  removeDraggingFileClass,
} from "../helpers";

import { v4 as uuidv4 } from "uuid";

/**
 * Converts a FileList to an array of UploadedFile objects, each with a unique UUID.
 * Skips files that are already in the currentFiles array (by name and size).
 */
function fileListToUploadedFiles(fileList: FileList): UploadedFile {
  const filesArray = Array.from(fileList);

  return filesArray.map((file) => ({
    uuid: uuidv4(),
    filedata: file,
    name: file.name,
  }));
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

    // Convert FileList to UploadedFile objects and set state
    const newFiles = fileListToUploadedFiles(droppedFiles);
    setUploadedFiles(() => newFiles);

    removeDraggingFileClass();
  }
}

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
