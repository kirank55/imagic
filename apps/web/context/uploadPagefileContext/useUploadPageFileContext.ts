import { useContext } from "react";
import fileContext from "./fileContext";

export function useUploadPageFileContext() {
  const fileCtx = useContext(fileContext);

  if (!fileCtx) {
    throw new Error(
      "fileContext is undefined. Make sure FileInput is wrapped in a FileContextProvider."
    );
  }

  return fileCtx;
}
