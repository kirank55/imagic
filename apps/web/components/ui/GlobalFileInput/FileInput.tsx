"use client";
import React, { useRef } from "react";

import {
  preventDefaultAndPropagation,
  removeDraggingFileClass,
} from "@repo/ui/util/helpers";
import {
  handleFilesByDrop,
  handleFilesByInput,
} from "@repo/ui/util/file/handleFilesDrop";

import {
  HandleFilesByDropEvent,
  HandleFilesByInputEvent,
  SetUploadedFiles,
} from "@repo/ui/types/Filetype";

import styles from "./FileInput.module.css";

const FileInput = ({
  setUploadedFiles,
}: {
  setUploadedFiles: SetUploadedFiles;
}) => {
  const fileInput = useRef<HTMLInputElement>(null);

  function addDraggingFileClass(event: React.DragEvent<HTMLElement>): void {
    preventDefaultAndPropagation(event);
    document.body.classList.add("dragging-file");
    const overlay = document.querySelector(".file-drag-overlay");
    if (overlay) {
      overlay.classList.add("dragging-file");
    }
  }

  return (
    <>
      {/* Drag Overlay */}
      <div
        className={`fixed inset-0 bg-black/70 z-50 backdrop-blur-sm file-drag-overlay ${styles.dragOverlay}`}
        onDragLeave={removeDraggingFileClass}
        onDrop={(e) =>
          handleFilesByDrop(
            e as unknown as HandleFilesByDropEvent,
            setUploadedFiles
          )
        }
        onDragEnter={preventDefaultAndPropagation}
        onDragOver={preventDefaultAndPropagation}
      >
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <p className="text-white text-xl font-semibold">
              Drop your files here
            </p>
          </div>
        </div>
      </div>

      {/* Main Upload Area */}
      <div className="relative">
        <div
          className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-12 text-center bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200 cursor-pointer select-none group"
          onClick={() => fileInput.current && fileInput.current.click()}
          onDragEnter={addDraggingFileClass}
          onDragOver={addDraggingFileClass}
        >
          {/* Upload Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors duration-200">
            <svg
              className="w-8 h-8 text-blue-600 dark:text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>

          {/* Text Content */}
          <div className="space-y-2 mb-6">
            <p className="text-lg font-medium text-slate-700 dark:text-slate-300">
              Drag & drop your files here
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Supports JPEG, PNG, and WebP formats
            </p>
          </div>

          {/* Select Files Button */}
          <button className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 12l2 2 4-4"
              />
            </svg>
            Select files
          </button>

          {/* File Size Info */}
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-4">
            Maximum file size: 50MB per file
          </p>
        </div>

        {/* Hidden File Input */}
        <form className="sr-only" method="get" encType="multipart/form-data">
          <input
            type="file"
            id="file_uploads"
            name="file_uploads"
            multiple
            accept="image/jpeg,image/png,image/webp"
            ref={fileInput}
            onChange={(e) =>
              handleFilesByInput(
                e as unknown as HandleFilesByInputEvent,
                setUploadedFiles
              )
            }
          />
          <button type="submit">Upload files</button>
        </form>
      </div>
    </>
  );
};

export default FileInput;
