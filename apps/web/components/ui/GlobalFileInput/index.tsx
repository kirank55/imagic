"use client";
import {
  handleFilesByDrop,
  HandleFilesByDropEvent,
} from "@repo/ui/util/file/handleFilesDrop";
import FileInput from "./FileInput";

import { useUploadPageFileContext } from "context/uploadPagefileContext/useUploadPageFileContext";

type FileInputContainerProps = {
  feature: string;
};

export default function FileInputContainer({
  feature,
}: FileInputContainerProps) {
  // const fileCtx = useContext(fileContext);

  // if (!fileCtx) {
  //   throw new Error(
  //     "fileContext is undefined. Make sure FileInput is wrapped in a FileContextProvider."
  //   );
  // }

  const { setUploadedFiles } = useUploadPageFileContext();

  return (
    <div
      className="file-input-container"
      onDrop={(e) =>
        handleFilesByDrop(
          e as unknown as HandleFilesByDropEvent,
          setUploadedFiles
        )
      }
    >
      <div className="container">
        <h1 style={{ padding: "1em", textAlign: "center" }}>
          Drag and Drop the images to start {feature}.
        </h1>
      </div>

      <FileInput />
    </div>
  );
}
