import { FileData } from "./List";

const CompressedImageListitem = ({
  file,
  setUploadedFiles,
  setCompressedimages,
}: {
  file: FileData;
  setUploadedFiles: React.Dispatch<React.SetStateAction<FileData[]>>;
  setCompressedimages: React.Dispatch<React.SetStateAction<FileData[]>>;
}) => {
  const { error } = file;
  const DeleteFile = (uuid: string) => {
    setUploadedFiles((currFiles: FileData[]) => currFiles.filter((file) => file.uuid !== uuid));
    setCompressedimages((currFiles: FileData[]) => currFiles.filter((file) => file.uuid !== uuid));
  };
  return (
    <>
      {error ? (
        <li className="converted-file error" id={file.uuid} key={file.uuid}>
          <div className="converted-file-content">
            <span className="filename" style={{ width: "100%" }}>
              Error: ({file.name}) Unsupported format type
            </span>
            <div className="downloadimg">
              <button className="delete" style={{ margin: "0 5vw", border: "none" }} onClick={() => DeleteFile(file.uuid)}>
                <i className="fa-solid fa-trash" style={{ fontSize: "20px" }} />
              </button>
            </div>
          </div>
        </li>
      ) : (
        <li className="converted-file" id={file.uuid} key={file.uuid}>
          <div className="converted-file-content">
            <span className="fileimg">
              <i className="fa-solid fa-file" />
            </span>
            <span className="filename">
              {file.name} from <blockquote>{file.originalSize}</blockquote> to <blockquote>{file.compressedSize}</blockquote>
            </span>
            <div className="downloadimg">
              <a href={file.src} download={file.name} className="med-link">
                <span>Download</span>
              </a>
              <button className="delete" style={{ margin: "0 5vw", border: "none" }} onClick={() => DeleteFile(file.uuid)} aria-label="delete">
                <i className="fa-solid fa-trash" style={{ fontSize: "20px" }} title="Delete" />
              </button>
            </div>
          </div>
        </li>
      )}
    </>
  );
};

export default CompressedImageListitem;