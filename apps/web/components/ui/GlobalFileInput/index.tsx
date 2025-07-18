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
      className="relative"
      onDrop={(e) =>
        handleFilesByDrop(
          e as unknown as HandleFilesByDropEvent,
          setUploadedFiles
        )
      }
    >
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
            Drag and Drop Images
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Upload your images to start {feature.toLowerCase()}
          </p>
        </div>

        <FileInput setUploadedFiles={setUploadedFiles} />
      </div>
    </div>
  );
}
