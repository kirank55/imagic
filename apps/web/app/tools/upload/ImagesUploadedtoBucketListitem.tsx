// import fileContext from "context/uploadPagefileContext/fileContext";
// import { useContext } from "react";
// import { FileContextType } from "@repo/ui/types/Filetype";

import { FileData } from "./ListofUploadedimages";
import Link from "next/link";
// import { useUploadPageFileContext } from "context/uploadPagefileContext/useUploadPageFileContext";

const ImagesUploadedtoBucketListitem = ({ file }: { file: FileData }) => {
  // const fileCtx = useContext(fileContext);

  // if (!fileCtx) {
  //   throw new Error(
  //     "fileContext is undefined. Make sure FileInput is wrapped in a FileContextProvider."
  //   );
  // }

  // const { UploadedFiles } = useUploadPageFileContext();
  // setUploadedFiles,
  // ImagesUploadedtoBucket,
  // setImagesUploadedtoBucket,
  // } = fileCtx as FileContextType;

  const { error, loading } = file;

  // console.log(UploadedFiles);

  if (loading) {
    return (
      <li className="converted-file loading" id={file.uuid} key={file.uuid}>
        <div className="converted-file-content">
          <span className="fileimg">
            <i className="fa-solid fa-spinner fa-spin" />
          </span>
          <span className="filename">{file.name} is uploading...</span>
        </div>
      </li>
    );
  }

  return (
    <>
      {error ? (
        <li className="converted-file error" id={file.uuid} key={file.uuid}>
          <div
            className="converted-file-content"
            style={{ justifyContent: "center" }}
          >
            <span className="filename" style={{ width: "100%" }}>
              Error: ({file.name}) Unsupported format type
            </span>
            {/* <div className="downloadimg">
              <button className="delete" style={{ margin: "0 5vw", border: "none" }} onClick={() => DeleteFile(file.uuid)}>
                <i className="fa-solid fa-trash" style={{ fontSize: "20px" }} />
              </button>
            </div> */}
          </div>
        </li>
      ) : (
        <li className="converted-file" id={file.uuid} key={file.uuid}>
          <div className="converted-file-content">
            <span className="fileimg">
              <i className="fa-solid fa-file" />
            </span>
            <span className="filename">
              <blockquote>{file.name} uploaded successfully</blockquote>
              <Link
                href="/tools/my-images"
                className="med-link styled-corner-small"
              >
                Click here to View
              </Link>
            </span>

            {/* <div className="downloadimg">
              <a href={file.src} download={file.name} className="med-link">
                <span>Download</span>
              </a> */}
          </div>
        </li>
      )}
    </>
  );
};

export default ImagesUploadedtoBucketListitem;
