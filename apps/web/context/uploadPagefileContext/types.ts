type uploadedFile = Array<{ uuid: string; filedata: File }>;

export type FileContextType = {
  UploadedFiles: uploadedFile;
  setUploadedFiles: React.Dispatch<React.SetStateAction<uploadedFile>>;
};
