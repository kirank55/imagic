import GlobalFileInput from "components/ui/GlobalFileInput";

import NewImageHandlerComponent from "./NewImageHandlerComponent";

const New = () => {
  return (
    <>
      <GlobalFileInput feature={"Uploading"} />

      <NewImageHandlerComponent />
    </>
  );
};

export default New;
