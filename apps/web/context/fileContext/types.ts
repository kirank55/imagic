import { FileData } from "components/ui/List/ListofUploadedimages";

export type FileContextType = {
  UploadedFiles: Array<{ uuid: string; filedata: File }>;

  setUploadedFiles: React.Dispatch<
    React.SetStateAction<Array<{ uuid: string; filedata: File }>>
  >;
  CompressionLevel: string;
  setCompressionLevel: React.Dispatch<React.SetStateAction<string>>;
  Compressedimages: Array<any>;
  setCompressedimages: React.Dispatch<React.SetStateAction<Array<any>>>;
  zipStatus: boolean;
  setZipStatus: React.Dispatch<React.SetStateAction<boolean>>;

  ImagesUploadedtoBucket: FileData[];
  setImagesUploadedtoBucket: React.Dispatch<React.SetStateAction<FileData[]>>;
};
