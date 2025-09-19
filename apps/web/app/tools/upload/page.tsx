"use client";
import { useEffect } from "react";
import GlobalFileInput from "components/ui/GlobalFileInput";
import { useUploadPageFileContext } from "context/uploadPagefileContext/useUploadPageFileContext";
import { useUserContext } from "context/UserContext/useUploadPageFileContext";
import ImageHandlerComponent from "./ImageHandlerComponent";
import { uploadAll } from "./uploadImage";

const NewPage = () => {
  const { setUploadedFiles, UploadedFiles } = useUploadPageFileContext();
  const { userId } = useUserContext();

  // Trigger uploads when files are added
  useEffect(() => {
    if (UploadedFiles.length > 0) {
      uploadAll(UploadedFiles, setUploadedFiles, userId);
    }
  }, [UploadedFiles, setUploadedFiles, userId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50">
      {/* Hero Section */}
      <section className="py-2 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-black mb-6">
              Upload & Optimize
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Transform your images instantly with our intelligent optimization.
              Support for JPEG, PNG, and WebP with automatic format conversion.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        {/* Upload Section */}
        <div className="mb-12">
          <div className="bg-white rounded-2xl border border-gray-200 hover:border-black transition-all duration-300 shadow-sm p-8">
            <GlobalFileInput
              feature={"optimizing"}
              setUploadedFiles={setUploadedFiles}
            />

            <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-6">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5 text-black"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-sm text-gray-600">
                    Automatic format detection
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5 text-black"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-sm text-gray-600">
                    Intelligent compression
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5 text-black"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-sm text-gray-600">WebP conversion</span>
                </div>
              </div>
              <div className="text-sm text-gray-500">Max file size: 10MB</div>
            </div>
          </div>
        </div>

        {/* Upload Statistics */}
        {/* {UploadedFiles.length > 0 && (
          <div className="mb-8">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-8">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-black rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {UploadedFiles.length} file
                      {UploadedFiles.length !== 1 ? "s" : ""} selected
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-900">
                      Ready for optimization
                    </span>
                  </div>
                </div>
                <div className="text-sm text-gray-600 flex items-center space-x-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Minimum size: 10KB</span>
                </div>
              </div>
            </div>
          </div>
        )} */}

        {/* Image Handler Component */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
          <ImageHandlerComponent UploadedFiles={UploadedFiles} />
        </div>
      </div>
    </div>
  );
};

export default NewPage;
