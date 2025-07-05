"use client"
import { handleFilesByDrop, HandleFilesByDropEvent } from "@repo/ui/util/file/handleFilesDrop";
import FileInput from "./FileInput";
import fileContext from "context/fileContext/fileContext";
import { useContext } from "react";
import { FileContextType } from "context/fileContext/types";

type FileInputContainerProps = {
  feature: string;
};

export default function FileInputContainer({ feature }: FileInputContainerProps) {

    const fileCtx = useContext(fileContext);

  if (!fileCtx) {
    throw new Error(
      "fileContext is undefined. Make sure FileInput is wrapped in a FileContextProvider."
    );
  }

  const { setUploadedFiles } = fileCtx as FileContextType;


  return(      <div
        className="file-input-container"
        // style={{ marginTop: "80px" }}
        onDrop={(e) =>
          handleFilesByDrop(
            e as unknown as HandleFilesByDropEvent,
            setUploadedFiles
          )
        }
      >
        <div className="container">
          <h1 style={{ padding: "1em", textAlign: "center" }}>
            Drag and Drop the image to start {feature}.
            {/* Drag and Drop the image to start Compressing. */}
          </h1>
        </div>

        <FileInput />
      </div>
)
}