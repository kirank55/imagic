"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { PUBLIC_DEVELOPMENT_URL } from "lib/constants";
import {
  DeviceInfo,
  myImageType,
  OptimizationOptions,
} from "@repo/ui/types/myImage";

export default function ImagePreviewPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params as { id: string };
  const [image, setImage] = useState<myImageType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showOptions, setShowOptions] = useState(true); // Show by default

  const [originalImageOption, setOriginalImageOption] = useState(false);

  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [optimizedSize, setOptimizedSize] = useState<number | null>(null);
  const [optimizedLoading, setOptimizedLoading] = useState(false);

  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };
    window.addEventListener("resize", checkScreenSize);
    checkScreenSize(); // Initial check
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Optimization state
  const [options, setOptions] = useState<OptimizationOptions>({
    quality: 80,
    format: "webp",
    width: undefined,
    height: undefined,
    autoOptimize: true,
    autoCompress: true,
  });

  // Device detection
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    screenWidth: 1920,
    connection: "4g",
  });

  // Detect device and connection on mount
  useEffect(() => {
    const userAgent =
      typeof navigator !== "undefined" ? navigator.userAgent : "";
    const screenWidth =
      typeof window !== "undefined" ? window.innerWidth : 1920;

    // Safely access connection info
    let connectionType = "4g";
    if (typeof navigator !== "undefined") {
      const nav = navigator as Navigator & {
        connection?: { effectiveType?: string };
        mozConnection?: { effectiveType?: string };
        webkitConnection?: { effectiveType?: string };
      };

      const connection =
        nav.connection || nav.mozConnection || nav.webkitConnection;
      connectionType = connection?.effectiveType || "4g";
    }

    setDeviceInfo({
      isMobile:
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          userAgent
        ) && screenWidth < 768,
      isTablet:
        /iPad|Android/i.test(userAgent) &&
        screenWidth >= 768 &&
        screenWidth < 1024,
      isDesktop: screenWidth >= 1024,
      screenWidth,
      connection: connectionType,
    });
  }, []);

  // Generate optimized image URL
  const getOptimizedImageUrl = useCallback(() => {
    if (!image) return "";

    // Parse userid and imageid from image.url (format: userid/imageid)
    const urlParts = image.url.split("/");
    const userid = urlParts[0];
    const imageid = urlParts[1];
    if (!userid || !imageid) {
      console.error("Invalid image URL format:", image.url);
      return "";
    }
    const baseUrl = `http://localhost:3001/assets/${userid}/${imageid}`;

    // If original image option is true, return URL with original=true parameter
    if (originalImageOption) {
      return `${baseUrl}?original=true`;
    }

    const params = new URLSearchParams();

    if (options.format !== "original") {
      params.append("format", options.format);
    }
    if (options.quality < 100) {
      params.append("quality", options.quality.toString());
    }
    if (options.width) {
      params.append("width", options.width.toString());
    }
    if (options.height) {
      params.append("height", options.height.toString());
    }
    if (options.autoOptimize) {
      params.append("autoOptimize", "true");
    }

    return params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;
  }, [image, options, originalImageOption]);

  // Fetch optimized size when options change
  useEffect(() => {
    if (image && showOptions) {
      const fetchOptimizedSize = async () => {
        setOptimizedLoading(true);
        try {
          const optimizedUrl = getOptimizedImageUrl();
          const response = await fetch(optimizedUrl, { method: "HEAD" });

          if (response.ok) {
            const contentLength = response.headers.get("content-length");
            if (contentLength) {
              setOptimizedSize(parseInt(contentLength));
            }
          }
        } catch (error) {
          console.error("Failed to fetch optimized image size:", error);
        } finally {
          setOptimizedLoading(false);
        }
      };

      const timeoutId = setTimeout(() => {
        fetchOptimizedSize();
      }, 500); // Debounce API calls

      return () => clearTimeout(timeoutId);
    }
  }, [image, showOptions, getOptimizedImageUrl]);

  // Copy optimized image URL
  const handleCopyUrl = () => {
    if (copied) return;
    navigator.clipboard.writeText(getOptimizedImageUrl());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download optimized image
  const downloadOptimizedImage = async () => {
    if (!image) return;

    setDownloading(true);
    try {
      const optimizedUrl = getOptimizedImageUrl();
      const response = await fetch(optimizedUrl);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;

      if (options.format === "original") {
        a.download = `optimized_${image.name}`;
      } else {
        const originalName = image.name.split(".").slice(0, -1).join(".");
        a.download = `optimized_${originalName}.${options.format}`;
      }

      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setDownloading(false);
    }
  };

  // Calculate estimated size reduction
  const getEstimatedSize = () => {
    if (!image) return "0 KB";

    // If we have the actual optimized size, use it
    if (optimizedSize !== null) {
      return `${Math.round(optimizedSize / 1024)} KB`;
    }

    // Otherwise use estimation
    let reduction = 1;

    // Format reduction
    if (options.format === "webp") reduction *= 0.7;
    else if (options.format === "jpeg") reduction *= 0.8;

    // Quality reduction
    reduction *= options.quality / 100;

    // Size reduction
    if (options.width && image.size) {
      const aspectRatio = options.width / 1920; // Assuming original is ~1920px
      reduction *= aspectRatio;
    }

    const estimatedSize = Math.round((image.size * reduction) / 1024);
    return `~${estimatedSize} KB`;
  };

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/images/${id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Image not found");
        const data = await res.json();
        setImage(data.image);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    console.log({ options });
    // return () => {
    //   second
    // }
  }, [options]);

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow p-8">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-lg font-medium text-gray-700">
              Loading image...
            </span>
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow p-8 max-w-md text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );

  if (!image)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow p-8 max-w-md text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Image Not Found
          </h2>
          <p className="text-gray-600">
            The requested image could not be found.
          </p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );

  const isImageAbsolute = image.url.startsWith("http");
  const imageUrl = isImageAbsolute
    ? image.url
    : `${PUBLIC_DEVELOPMENT_URL}/${image.url}`;

  console.log(image);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <button
        onClick={() => router.back()}
        className="mb-6 bg-white text-gray-600 border border-gray-300 px-4 py-2 rounded-lg cursor-pointer text-sm font-medium flex items-center gap-2 hover:bg-gray-50 transition-colors shadow-sm"
      >
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
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back to Gallery
      </button>

      <div
        className={`grid gap-6 ${isLargeScreen ? "grid-cols-3" : "grid-cols-1"}`}
      >
        {/* Sidebar with Image Info and Optimization Controls */}
        <div className="col-span-1">
          <div className="flex flex-col gap-6">
            {/* Image Information */}
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <h2
                id="image-name"
                className="mb-4 text-xl font-semibold text-gray-900 break-all"
              >
                {image.name}
              </h2>
              <div className="text-sm text-gray-600 leading-relaxed flex flex-col gap-2">
                <p className="mb-0">
                  <span className="font-medium">Size:</span>{" "}
                  {Math.round(image.size / 1024)} KB
                </p>
                <p className="mb-0">
                  <span className="font-medium">Type:</span>{" "}
                  {image.detectedType}
                </p>
                <p className="mb-0">
                  <span className="font-medium">Uploaded:</span>{" "}
                  {new Date(image.uploadedAt).toLocaleDateString()}
                </p>
                {image.tags && image.tags.length > 0 && (
                  <p className="mb-0">
                    <span className="font-medium">Tags:</span>{" "}
                    {image.tags.join(", ")}
                  </p>
                )}
                <p className="mt-2 text-xs border-t border-gray-100 pt-2">
                  <span className="font-medium">Device:</span>{" "}
                  {deviceInfo.isMobile
                    ? "Mobile"
                    : deviceInfo.isTablet
                      ? "Tablet"
                      : "Desktop"}{" "}
                  ({deviceInfo.screenWidth}px, {deviceInfo.connection})
                </p>
              </div>
            </div>

            {/* Optimization Controls */}
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Optimization
                </h3>
                <button
                  onClick={() => setShowOptions(!showOptions)}
                  className="bg-transparent text-blue-600 border-0 px-2 py-1 rounded cursor-pointer text-xs font-medium hover:bg-blue-50 transition-colors"
                >
                  {showOptions ? "Hide" : "Show"} Preview
                </button>
              </div>

              {/* Auto Optimization Toggles */}
              <div className="p-3 bg-gray-50 rounded-lg mb-4">
                <div className="flex items-center justify-between mb-2 relative">
                  <label
                    className="text-sm font-medium text-gray-700 cursor-pointer"
                    htmlFor="original-image-toggle"
                  >
                    Keep original image
                  </label>
                  <div
                    className="relative"
                    onMouseEnter={(e) => {
                      const tooltip = e.currentTarget.querySelector(
                        ".tooltip"
                      ) as HTMLElement;
                      if (tooltip) {
                        tooltip.style.opacity = "1";
                        tooltip.style.visibility = "visible";
                      }
                    }}
                    onMouseLeave={(e) => {
                      const tooltip = e.currentTarget.querySelector(
                        ".tooltip"
                      ) as HTMLElement;
                      if (tooltip) {
                        tooltip.style.opacity = "0";
                        tooltip.style.visibility = "hidden";
                      }
                    }}
                  >
                    <input
                      id="original-image-toggle"
                      type="checkbox"
                      checked={originalImageOption}
                      onChange={(e) => setOriginalImageOption(e.target.checked)}
                      className={`relative w-11 h-6 appearance-none ${
                        originalImageOption ? "bg-blue-600" : "bg-gray-300"
                      } rounded-full cursor-pointer transition-colors outline-none`}
                    />
                    <div
                      className={`absolute top-0.5 ${
                        originalImageOption ? "left-5" : "left-0.5"
                      } w-5 h-5 bg-white rounded-full transition-all pointer-events-none shadow-sm`}
                    />
                    {/* Tooltip */}
                    <div
                      className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-md opacity-0 invisible transition-all z-10 max-w-48 whitespace-normal leading-snug tooltip"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = "1";
                        e.currentTarget.style.visibility = "visible";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = "0";
                        e.currentTarget.style.visibility = "hidden";
                      }}
                    >
                      If enabled, all other optimization options will be ignored
                      by the API
                      <div className="absolute top-full right-3 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-800" />
                    </div>
                  </div>
                </div>
                <label className="flex items-center mb-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={options.autoOptimize}
                    onChange={(e) =>
                      setOptions({ ...options, autoOptimize: e.target.checked })
                    }
                    className="mr-2 accent-blue-600"
                  />
                  Auto-optimize for device
                </label>
              </div>

              {/* Manual Controls */}
              <div
                className={`${options.autoOptimize ? "opacity-50" : "opacity-100"}`}
              >
                {/* Format Selection */}
                <div className="mb-4">
                  <label className="block mb-1.5 text-sm font-medium text-gray-700">
                    Format
                  </label>
                  <select
                    value={options.format}
                    onChange={(e) =>
                      setOptions({
                        ...options,
                        format: e.target.value as OptimizationOptions["format"],
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={options.autoOptimize}
                  >
                    <option value="original">Original</option>
                    <option value="webp">WebP</option>
                    <option value="jpeg">JPEG</option>
                    <option value="png">PNG</option>
                  </select>
                </div>

                {/* Quality Slider */}
                <div className="mb-4">
                  <label className="block mb-1.5 text-sm font-medium text-gray-700">
                    Quality: {options.quality}%
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={options.quality}
                    onChange={(e) =>
                      setOptions({
                        ...options,
                        quality: parseInt(e.target.value),
                      })
                    }
                    className="w-full accent-blue-600"
                    disabled={options.autoOptimize}
                  />
                </div>

                {/* Resize Options */}
                <div className="mb-4">
                  <label className="block mb-1.5 text-sm font-medium text-gray-700">
                    Resize (optional)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Width"
                      value={options.width || ""}
                      onChange={(e) =>
                        setOptions({
                          ...options,
                          width: e.target.value
                            ? parseInt(e.target.value)
                            : undefined,
                        })
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      disabled={options.autoOptimize}
                    />
                    <input
                      type="number"
                      placeholder="Height"
                      value={options.height || ""}
                      onChange={(e) =>
                        setOptions({
                          ...options,
                          height: e.target.value
                            ? parseInt(e.target.value)
                            : undefined,
                        })
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      disabled={options.autoOptimize}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 mt-6 border-t border-gray-100 pt-4">
                {/* Optimized URL Display */}
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 mb-2">
                  <label className="block mb-1.5 text-xs font-medium text-slate-600">
                    Optimized Image URL:
                  </label>
                  <div className="text-xs text-slate-600 break-all leading-snug font-mono bg-white p-2 rounded border border-slate-200">
                    {getOptimizedImageUrl()}
                  </div>
                </div>

                <button
                  onClick={downloadOptimizedImage}
                  disabled={downloading}
                  className={`px-3 py-3 rounded-lg text-sm font-medium text-center transition-all ${
                    downloading
                      ? "bg-blue-400 text-white cursor-not-allowed opacity-70"
                      : "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                  }`}
                >
                  {downloading ? "Downloading..." : "Download Optimized Image"}
                </button>

                <button
                  onClick={handleCopyUrl}
                  className={`px-3 py-2.5 rounded-lg text-sm font-medium text-center transition-all ${
                    copied
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {copied ? "Copied!" : "Copy Optimized URL"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Image Previews Column */}
        <div className={`${isLargeScreen ? "col-span-2" : "col-span-1"}`}>
          <div
            className={`flex gap-6 ${isLargeScreen ? "flex-row" : "flex-col"}`}
          >
            {/* Original Image Preview */}
            <div className="flex-1 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="mb-3 text-lg font-semibold text-gray-900">
                Original
              </h3>
              <div className="relative w-full pb-[75%]">
                <Image
                  src={imageUrl}
                  alt={`Original ${image.name || "image"}`}
                  fill
                  style={{ objectFit: "contain" }}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <p className="mt-2 text-xs text-gray-500">
                {Math.round(image.size / 1024)} KB
              </p>
            </div>

            {/* Optimized Image Preview */}
            {showOptions && (
              <div className="flex-1 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="mb-3 text-lg font-semibold text-gray-900">
                  Optimized
                </h3>
                <div className="relative w-full pb-[75%] bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={getOptimizedImageUrl()}
                    alt={`Optimized ${image.name || "image"}`}
                    fill
                    style={{ objectFit: "contain" }}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    key={getOptimizedImageUrl()} // Re-render image on change
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  {optimizedLoading ? "Calculating..." : getEstimatedSize()}
                  {optimizedSize !== null && optimizedSize !== image.size && (
                    <span className="text-green-600 ml-2">
                      (
                      {Math.round(
                        ((image.size - optimizedSize) / image.size) * 100
                      )}
                      % smaller)
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
