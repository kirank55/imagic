"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useMyImageContext } from "context/myImagePageContext/useUploadPageFileContext";
import { myImageType } from "@repo/ui/types/myImage";

const MyImagesPage: React.FC = () => {
  const { myImageFiles } = useMyImageContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  // const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  // Filter and sort images
  const filteredImages = myImageFiles
    .filter((img) => {
      const matchesSearch = img.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesFormat =
        selectedFormat === "all" ||
        img.detectedType.toLowerCase().includes(selectedFormat);
      return matchesSearch && matchesFormat;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime()
          );
        case "name":
          return a.name.localeCompare(b.name);
        case "size":
          return b.size - a.size;
        default:
          return 0;
      }
    });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getImageId = (img: myImageType) => `${img.url}-${img.name}`;

  const getImageSrcWithId = (img: myImageType) => {
    // Add /image-r2bucket/ to the URL path
    const parts = img.url.split("/");
    const baseUrl = parts[0] + "//" + parts[2];
    const remainingPath = parts.slice(3).join("/");
    const imageURL = `${baseUrl}/image-r2bucket/${remainingPath}`;
    console.log({ imageURL });
    return imageURL;
  };

  const toggleImageSelection = (imageId: string) => {
    setSelectedImages((prev) =>
      prev.includes(imageId)
        ? prev.filter((id) => id !== imageId)
        : [...prev, imageId]
    );
  };

  // const selectAllImages = () => {
  //   if (selectedImages.length === filteredImages.length) {
  //     setSelectedImages([]);
  //   } else {
  //     setSelectedImages(filteredImages.map((img) => getImageId(img)));
  //   }
  // };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Images</h1>
              <p className="mt-1 text-sm text-gray-500">
                {filteredImages.length} of {myImageFiles.length} images
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {/* View Mode Toggle */}
              {/* <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "grid"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "list"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 10h16M4 14h16M4 18h16"
                    />
                  </svg>
                </button>
              </div> */}

              {/* Upload Button */}
              <Link
                href="/tools/upload"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <svg
                  className="h-4 w-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Upload Images
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Images
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by filename..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-black"
                />
                <svg
                  className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Format Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Format
              </label>
              <select
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="all">All Formats</option>
                <option value="jpeg">JPEG</option>
                <option value="png">PNG</option>
                <option value="webp">WebP</option>
                <option value="gif">GIF</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">Name A-Z</option>
                <option value="size">Size (Largest)</option>
              </select>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedImages.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">
                  {selectedImages.length} image
                  {selectedImages.length !== 1 ? "s" : ""} selected
                </span>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setSelectedImages([])}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Clear Selection
                  </button>
                  <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Download Selected
                  </button>
                  <button className="inline-flex items-center px-3 py-1.5 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                    Delete Selected
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredImages.map((img) => (
            <div
              key={getImageId(img)}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 group"
            >
              {/* Selection Checkbox */}
              <div className="absolute top-3 left-3 z-10">
                <input
                  type="checkbox"
                  checked={selectedImages.includes(getImageId(img))}
                  onChange={() => toggleImageSelection(getImageId(img))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>

              {/* Image */}
              <div className="relative aspect-square overflow-hidden bg-gray-100">
                <Image
                  src={getImageSrcWithId(img)}
                  alt={img.name || "gallery-img"}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                  unoptimized
                />

                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                    <Link
                      href={`/tools/my-images/${img._id}`}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <svg
                        className="h-4 w-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      View
                    </Link>
                    <button
                      onClick={async () => {
                        try {
                          // Extract userid and imageid from the URL
                          const urlParts = img.url.split("/");
                          const userid = urlParts[urlParts.length - 2];
                          const imageid = urlParts[urlParts.length - 1];

                          // Use the same endpoint as [id] page with original format
                          const optimizedUrl = `http://localhost:3001/assets/${userid}/${imageid}?format=original`;
                          const response = await fetch(optimizedUrl);

                          if (!response.ok) throw new Error("Download failed");

                          const blob = await response.blob();
                          const url = window.URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = img.name;
                          document.body.appendChild(a);
                          a.click();
                          window.URL.revokeObjectURL(url);
                          document.body.removeChild(a);
                        } catch (error) {
                          console.error("Download failed:", error);
                        }
                      }}
                      className="inline-flex items-center px-3 py-2 border border-white text-sm font-medium rounded-md text-white hover:bg-white hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-colors"
                    >
                      <svg
                        className="h-4 w-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                      Download
                    </button>
                  </div>
                </div>
              </div>

              {/* Image Info */}
              <div className="p-4">
                <h3
                  className="text-sm font-medium text-gray-900 truncate"
                  title={img.name}
                >
                  {img.name}
                </h3>
                <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                  <span className="bg-gray-100 px-2 py-1 rounded-full">
                    {img.detectedType.toUpperCase()}
                  </span>
                  <span>{formatFileSize(img.size)}</span>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  {formatDate(img.uploadedAt)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Images Grid/List */}
      </div>
    </div>
  );
};

export default MyImagesPage;

// {filteredImages.length === 0 ? (
//   <div className="text-center py-12">
//     <svg
//       className="mx-auto h-12 w-12 text-gray-400"
//       fill="none"
//       stroke="currentColor"
//       viewBox="0 0 24 24"
//     >
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         strokeWidth={2}
//         d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
//       />
//     </svg>
//     <h3 className="mt-2 text-sm font-medium text-gray-900">
//       No images found
//     </h3>
//     <p className="mt-1 text-sm text-gray-500">
//       {searchTerm || selectedFormat !== "all"
//         ? "Try adjusting your search or filters."
//         : "Get started by uploading your first image."}
//     </p>
//     {!searchTerm && selectedFormat === "all" && (
//       <div className="mt-6">
//         <Link
//           href="/tools"
//           className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//         >
//           <svg
//             className="h-4 w-4 mr-2"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M12 4v16m8-8H4"
//             />
//           </svg>
//           Upload Your First Image
//         </Link>
//       </div>
//     )}
//   </div>
// ) : viewMode === "grid" ? (
//   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//     {filteredImages.map((img) => (
//       <div
//         key={getImageId(img)}
//         className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 group"
//       >
//         {/* Selection Checkbox */}
//         <div className="absolute top-3 left-3 z-10">
//           <input
//             type="checkbox"
//             checked={selectedImages.includes(getImageId(img))}
//             onChange={() => toggleImageSelection(getImageId(img))}
//             className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//           />
//         </div>

//         {/* Image */}
//         <div className="relative aspect-square overflow-hidden bg-gray-100">
//           <Image
//             src={getImageSrcWithId(img)}
//             alt={img.name || "gallery-img"}
//             fill
//             className="object-cover group-hover:scale-105 transition-transform duration-200"
//             unoptimized
//           />

//           {/* Overlay on Hover */}
//           <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
//             <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
//               <Link
//                 href={`/tools/my-images/${img._id}`}
//                 className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//               >
//                 <svg
//                   className="h-4 w-4 mr-1"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
//                   />
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
//                   />
//                 </svg>
//                 View
//               </Link>
//               <button
//                 onClick={async () => {
//                   try {
//                     // Extract userid and imageid from the URL
//                     const urlParts = img.url.split("/");
//                     const userid = urlParts[urlParts.length - 2];
//                     const imageid = urlParts[urlParts.length - 1];

//                     // Use the same endpoint as [id] page with original format
//                     const optimizedUrl = `http://localhost:3001/assets/${userid}/${imageid}?format=original`;
//                     const response = await fetch(optimizedUrl);

//                     if (!response.ok)
//                       throw new Error("Download failed");

//                     const blob = await response.blob();
//                     const url = window.URL.createObjectURL(blob);
//                     const a = document.createElement("a");
//                     a.href = url;
//                     a.download = img.name;
//                     document.body.appendChild(a);
//                     a.click();
//                     window.URL.revokeObjectURL(url);
//                     document.body.removeChild(a);
//                   } catch (error) {
//                     console.error("Download failed:", error);
//                   }
//                 }}
//                 className="inline-flex items-center px-3 py-2 border border-white text-sm font-medium rounded-md text-white hover:bg-white hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-colors"
//               >
//                 <svg
//                   className="h-4 w-4 mr-1"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
//                   />
//                 </svg>
//                 Download
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Image Info */}
//         <div className="p-4">
//           <h3
//             className="text-sm font-medium text-gray-900 truncate"
//             title={img.name}
//           >
//             {img.name}
//           </h3>
//           <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
//             <span className="bg-gray-100 px-2 py-1 rounded-full">
//               {img.detectedType.toUpperCase()}
//             </span>
//             <span>{formatFileSize(img.size)}</span>
//           </div>
//           <p className="mt-1 text-xs text-gray-500">
//             {formatDate(img.uploadedAt)}
//           </p>
//         </div>
//       </div>
//     ))}
//   </div>
// ) : (
//   /* List View */
//   <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
//     <div className="px-6 py-3 border-b border-gray-200 bg-gray-50">
//       <div className="flex items-center">
//         <input
//           type="checkbox"
//           checked={
//             selectedImages.length === filteredImages.length &&
//             filteredImages.length > 0
//           }
//           onChange={selectAllImages}
//           className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-4"
//         />
//         <div className="grid grid-cols-12 gap-4 w-full text-xs font-medium text-gray-500 uppercase tracking-wider">
//           <div className="col-span-1">Preview</div>
//           <div className="col-span-4">Name</div>
//           <div className="col-span-2">Type</div>
//           <div className="col-span-2">Size</div>
//           <div className="col-span-2">Date</div>
//           <div className="col-span-1">Actions</div>
//         </div>
//       </div>
//     </div>
//     <div className="divide-y divide-gray-200">
//       {filteredImages.map((img) => (
//         <div
//           key={getImageId(img)}
//           className="px-6 py-4 hover:bg-gray-50"
//         >
//           <div className="flex items-center">
//             <input
//               type="checkbox"
//               checked={selectedImages.includes(getImageId(img))}
//               onChange={() => toggleImageSelection(getImageId(img))}
//               className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-4"
//             />
//             <div className="grid grid-cols-12 gap-4 w-full items-center">
//               <div className="col-span-1">
//                 <div className="h-10 w-10 relative rounded overflow-hidden bg-gray-100">
//                   <Image
//                     src={getImageSrcWithId(img)}
//                     alt={img.name}
//                     fill
//                     className="object-cover"
//                     unoptimized
//                   />
//                 </div>
//               </div>
//               <div className="col-span-4">
//                 <p
//                   className="text-sm font-medium text-gray-900 truncate"
//                   title={img.name}
//                 >
//                   {img.name}
//                 </p>
//               </div>
//               <div className="col-span-2">
//                 <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
//                   {img.detectedType.toUpperCase()}
//                 </span>
//               </div>
//               <div className="col-span-2">
//                 <p className="text-sm text-gray-500">
//                   {formatFileSize(img.size)}
//                 </p>
//               </div>
//               <div className="col-span-2">
//                 <p className="text-sm text-gray-500">
//                   {formatDate(img.uploadedAt)}
//                 </p>
//               </div>
//               <div className="col-span-1">
//                 <div className="flex items-center space-x-2">
//                   <Link
//                     href={`/tools/my-images/${img._id}`}
//                     className="text-blue-600 hover:text-blue-900 text-sm font-medium"
//                   >
//                     View
//                   </Link>
//                   <button
//                     onClick={async () => {
//                       try {
//                         // Extract userid and imageid from the URL
//                         const urlParts = img.url.split("/");
//                         const userid = urlParts[urlParts.length - 2];
//                         const imageid = urlParts[urlParts.length - 1];

//                         // Use the same endpoint as [id] page with original format
//                         const optimizedUrl = `http://localhost:3001/assets/${userid}/${imageid}?format=original`;
//                         const response = await fetch(optimizedUrl);

//                         if (!response.ok)
//                           throw new Error("Download failed");

//                         const blob = await response.blob();
//                         const url = window.URL.createObjectURL(blob);
//                         const a = document.createElement("a");
//                         a.href = url;
//                         a.download = img.name;
//                         document.body.appendChild(a);
//                         a.click();
//                         window.URL.revokeObjectURL(url);
//                         document.body.removeChild(a);
//                       } catch (error) {
//                         console.error("Download failed:", error);
//                       }
//                     }}
//                     className="text-gray-400 hover:text-gray-600"
//                   >
//                     <svg
//                       className="h-4 w-4"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
//                       />
//                     </svg>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   </div>
// )}
