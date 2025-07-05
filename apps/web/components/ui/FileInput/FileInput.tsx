"use client"
import React, { useContext, useRef } from "react";

import { FileContextType } from "context/fileContext/types";
import fileContext from "context/fileContext/fileContext";

import { preventDefaultAndPropagation, removeDraggingFileClass } from "@repo/ui/util/helpers";
import { handleFilesByDrop, HandleFilesByDropEvent, handleFilesByInput, HandleFilesByInputEvent } from "@repo/ui/util/file/handleFilesDrop";

import "./fileinput.css";
import "./ui.css";

const FileInput: React.FC = () => {
  const fileInput = useRef<HTMLInputElement>(null);

  const fileCtx = useContext(fileContext);

  if (!fileCtx) {
    throw new Error("fileContext is undefined. Make sure FileInput is wrapped in a FileContextProvider.");
  }

  const { setUploadedFiles } = fileCtx as FileContextType;

  function addDraggingFileClass(event: React.DragEvent<HTMLElement>): void {
    preventDefaultAndPropagation(event);
    document.body.classList.add("dragging-file");
    document.querySelector(".file-drag-overlay")?.classList.add("dragging-file");
  }

  return (
    <>
      <div
        className="file-drag-overlay"
        onDragLeave={removeDraggingFileClass}
        onDrop={e => handleFilesByDrop(e as unknown as HandleFilesByDropEvent, setUploadedFiles)}
        onDragEnter={preventDefaultAndPropagation}
        onDragOver={preventDefaultAndPropagation}
      >


        <div className="drop-files">
          <i className="fa-solid fa-plus add-file-icon" />
          <p>Drop your files </p>
        </div>
      </div>

      <main>
        <div className="container">
          <div className="file-upload styled-corner">
            <div
              className="file-upload-area noselect"
              // onDrop={e => handleFilesByDrop(e as unknown as HandleFilesByDropEvent, setUploadedFiles)}
              onClick={() => fileInput.current && fileInput.current.click()}
              onDragEnter={addDraggingFileClass}
              onDragOver={addDraggingFileClass}
            >
              <i className="file-upload-icon fa-solid fa-cloud-arrow-up" />
              <p>Drag &amp; drop your files here</p>
              <button className="file-button">
                <i className="fa-solid fa-upload" />
                Select files
              </button>
            </div>
          </div>

          <form
            className="visually-hidden"
            method="get"
            encType="multipart/form-data"
          >
            <input
              type="file"
              id="file_uploads"
              name="file_uploads"
              multiple
              ref={fileInput}
              onChange={e => handleFilesByInput(e as unknown as HandleFilesByInputEvent, setUploadedFiles)}
            />
            <button>Upload files</button>
          </form>
        </div>
      </main>
    </>
  );
};

export default FileInput;