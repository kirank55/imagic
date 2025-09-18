"use client";
import GlobalFileInput from "components/ui/GlobalFileInput";
import { useUploadPageFileContext } from "context/uploadPagefileContext/useUploadPageFileContext";
// import dynamic from "next/dynamic";
import ImageHandlerComponent from "./ImageHandlerComponent";

// const NewImageHandlerComponent = dynamic(
//   () => import("./NewImageHandlerComponent"),
//   {
//     ssr: false,
//   }
// );

const NewPage = () => {
  const { setUploadedFiles, UploadedFiles } = useUploadPageFileContext();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header Section */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              Upload & Optimize Images
            </h1>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Upload your images to automatically optimize them for web use. We
              support JPEG, PNG, and WebP formats with intelligent compression.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Upload Section */}
        <div className="mb-8">
          <GlobalFileInput
            feature={"Uploading"}
            setUploadedFiles={setUploadedFiles}
          />
        </div>

        {/* Upload Statistics */}
        {UploadedFiles.length > 0 && (
          <div className="mb-6">
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {UploadedFiles.length} file
                      {UploadedFiles.length !== 1 ? "s" : ""} selected
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Ready to process
                    </span>
                  </div>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Minimum 10KB image size required
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Image Handler Component */}
        {/* <NewImageHandlerComponent /> */}
        <ImageHandlerComponent />
      </div>
    </div>
  );
};

export default NewPage;
