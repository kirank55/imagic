"use client";
import GlobalFileInput from "components/ui/GlobalFileInput";

import NewImageHandlerComponent from "./NewImageHandlerComponent";
import { useUploadPageFileContext } from "context/uploadPagefileContext/useUploadPageFileContext";

const New = () => {
  const { setUploadedFiles } = useUploadPageFileContext();

  return (
    <>
      <GlobalFileInput
        feature={"Uploading"}
        setUploadedFiles={setUploadedFiles}
      />

      <NewImageHandlerComponent />
    </>
  );
};

export default New;
