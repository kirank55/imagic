"use client";
import React from "react";

import {
  FileInputContainerProps,
  HandleFilesByDropEvent,
} from "@repo/ui/types/Filetype";

import { handleFilesByDrop } from "@repo/ui/util/file/handleFilesDrop";

import FileInput from "./FileInput";

export default function FileInputContainer({
  feature,
  setUploadedFiles,
}: FileInputContainerProps) {
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

      <FileInput setUploadedFiles={setUploadedFiles} />
    </div>
  );
}
