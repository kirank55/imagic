import { useContext } from "react";
import myImageContext from "./myImageContext";

export function useMyImageContext() {
  const fileCtx = useContext(myImageContext);

  if (!fileCtx) {
    throw new Error(
      "myImageContext is undefined. Make sure FileInput is wrapped in a FileContextProvider."
    );
  }

  return fileCtx;
}
