import FileInputContainer from "components/ui/FileInput";
import ImageUploadComponent from "components/ui/ImageUploadComponent";
const Upload = () => {
  return (
    <>
      <FileInputContainer feature={"Uploading"} />

      <ImageUploadComponent />
    </>
  );
};

export default Upload;
