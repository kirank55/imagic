export type UploadedFileItem = {
  uuid: string;
  filedata: File;
  name: string;
  uploadStatus?: boolean;
  error?: boolean;
  url?: string;
  loading?: boolean;
};

export type UploadedFile = Array<UploadedFileItem>;

export type SetUploadedFiles = React.Dispatch<
  React.SetStateAction<UploadedFile>
>;

export type FileContextType = {
  UploadedFiles: UploadedFile;
  setUploadedFiles: SetUploadedFiles;
};

export interface HandleFilesByDropEvent extends DragEvent {
  dataTransfer: DataTransfer;
}

export interface HandleFilesByInputEvent extends Event {
  target: EventTarget & { files: FileList };
}

export type FileInputContainerProps = {
  feature: string;
  setUploadedFiles: React.Dispatch<React.SetStateAction<UploadedFile>>;
};
