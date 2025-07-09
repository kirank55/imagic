"use client";
import { useEffect, useState, CSSProperties, useCallback } from "react";
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
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [optimizedSize, setOptimizedSize] = useState<number | null>(null);
  const [optimizedLoading, setOptimizedLoading] = useState(false);

  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [isMediumScreen, setIsMediumScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
      setIsMediumScreen(window.innerWidth >= 768);
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
    autoResize: true,
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

  // Auto-adjust options based on device
  useEffect(() => {
    if (options.autoOptimize && deviceInfo) {
      setOptions((prevOptions) => {
        const newOptions = { ...prevOptions };

        if (deviceInfo.isMobile) {
          newOptions.quality = 70;
          newOptions.format = "webp";
          if (prevOptions.autoResize) {
            newOptions.width = Math.min(800, deviceInfo.screenWidth);
          }
        } else if (deviceInfo.isTablet) {
          newOptions.quality = 75;
          newOptions.format = "webp";
          if (prevOptions.autoResize) {
            newOptions.width = Math.min(1200, deviceInfo.screenWidth);
          }
        } else {
          newOptions.quality = 85;
          newOptions.format = "webp";
        }

        // Adjust for slow connections
        if (
          deviceInfo.connection === "slow-2g" ||
          deviceInfo.connection === "2g"
        ) {
          newOptions.quality = Math.min(60, newOptions.quality);
          newOptions.format = "jpeg";
        }

        // Only update state if options have actually changed
        if (JSON.stringify(prevOptions) !== JSON.stringify(newOptions)) {
          return newOptions;
        }
        return prevOptions;
      });
    }
  }, [deviceInfo, options.autoOptimize, options.autoResize]);

  // Generate optimized image URL
  const getOptimizedImageUrl = useCallback(() => {
    if (!image) return "";

    // Parse username and imageid from image.url (format: username/imageid)
    const urlParts = image.url.split("/");
    const username = urlParts[0];
    const imageid = urlParts[1];

    const baseUrl = `http://localhost:3001/optimize/${username}/${imageid}`;
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

    return params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;
  }, [image, options]);

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
      a.download = `optimized_${image.name}`;
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

  if (loading) return <div className="loading">Loading image...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!image) return <div className="error">Image not found.</div>;

  const isImageAbsolute = image.url.startsWith("http");
  const imageUrl = isImageAbsolute
    ? image.url
    : `${PUBLIC_DEVELOPMENT_URL}/${image.url}`;

  const gridStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: isLargeScreen
      ? "repeat(3, minmax(0, 1fr))"
      : "repeat(1, minmax(0, 1fr))",
    gap: "24px",
  };

  const previewsColumnStyle: CSSProperties = {
    gridColumn: isLargeScreen ? "span 2 / span 2" : "span 1 / span 1",
  };

  const previewsContainerStyle: CSSProperties = {
    display: "flex",
    gap: "24px",
    flexDirection: isMediumScreen ? "row" : "column",
  };

  console.log(image);

  return (
    <div
      className="image-preview-page"
      style={{
        padding: "24px",
        backgroundColor: "#f9fafb",
        minHeight: "100vh",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <button
        onClick={() => router.back()}
        className="back-btn"
        style={{
          background: "white",
          color: "#4b5563",
          border: "1px solid #e5e7eb",
          padding: "10px 16px",
          borderRadius: "8px",
          cursor: "pointer",
          marginBottom: "24px",
          fontSize: "14px",
          fontWeight: "500",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        }}
      >
        ← Back to Gallery
      </button>

      <div style={gridStyle}>
        {/* Sidebar with Image Info and Optimization Controls */}
        <div
          className="sidebar-column"
          style={{
            gridColumn: "span 1 / span 1",
          }}
        >
          <div
            style={{ display: "flex", flexDirection: "column", gap: "24px" }}
          >
            {/* Image Information */}
            <div
              style={{
                background: "white",
                padding: "20px",
                borderRadius: "12px",
                border: "1px solid #e5e7eb",
                boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.05)",
              }}
            >
              <h2
                id="image-name"
                style={{
                  margin: "0 0 16px 0",
                  fontSize: "20px",
                  fontWeight: "600",
                  color: "#111827",
                  wordBreak: "break-all",
                }}
              >
                {image.name}
              </h2>
              <div
                style={{
                  fontSize: "14px",
                  color: "#6b7280",
                  lineHeight: "1.6",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                <p style={{ margin: 0 }}>
                  <strong>Size:</strong> {Math.round(image.size / 1024)} KB
                </p>
                <p style={{ margin: 0 }}>
                  <strong>Type:</strong> {image.detectedType}
                </p>
                <p style={{ margin: 0 }}>
                  <strong>Uploaded:</strong>{" "}
                  {new Date(image.uploadedAt).toLocaleDateString()}
                </p>
                {image.tags && image.tags.length > 0 && (
                  <p style={{ margin: 0 }}>
                    <strong>Tags:</strong> {image.tags.join(", ")}
                  </p>
                )}
                <p
                  style={{
                    margin: "8px 0 0 0",
                    fontSize: "12px",
                    borderTop: "1px solid #f3f4f6",
                    paddingTop: "8px",
                  }}
                >
                  <strong>Device:</strong>{" "}
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
            <div
              style={{
                background: "white",
                padding: "20px",
                borderRadius: "12px",
                border: "1px solid #e5e7eb",
                boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.05)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "16px",
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#111827",
                  }}
                >
                  Optimization
                </h3>
                <button
                  onClick={() => setShowOptions(!showOptions)}
                  style={{
                    background: "transparent",
                    color: "#4f46e5",
                    border: "none",
                    padding: "6px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "12px",
                    fontWeight: "500",
                  }}
                >
                  {showOptions ? "Hide" : "Show"} Preview
                </button>
              </div>

              {/* Auto Optimization Toggles */}
              <div
                style={{
                  padding: "12px",
                  background: "#f9fafb",
                  borderRadius: "8px",
                  marginBottom: "16px",
                }}
              >
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "8px",
                    fontSize: "14px",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={options.autoOptimize}
                    onChange={(e) =>
                      setOptions({ ...options, autoOptimize: e.target.checked })
                    }
                    style={{ marginRight: "8px", accentColor: "#4f46e5" }}
                  />
                  Auto-optimize for device
                </label>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "14px",
                    cursor: "pointer",
                    color: options.autoOptimize ? "#6b7280" : "#111827",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={options.autoResize}
                    onChange={(e) =>
                      setOptions({ ...options, autoResize: e.target.checked })
                    }
                    style={{ marginRight: "8px", accentColor: "#4f46e5" }}
                    disabled={!options.autoOptimize}
                  />
                  Auto-resize for screen
                </label>
              </div>

              {/* Manual Controls */}
              <div style={{ opacity: options.autoOptimize ? 0.5 : 1 }}>
                {/* Format Selection */}
                <div style={{ marginBottom: "16px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "6px",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#374151",
                    }}
                  >
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
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "6px",
                      fontSize: "14px",
                      background: "white",
                    }}
                    disabled={options.autoOptimize}
                  >
                    <option value="original">Original</option>
                    <option value="webp">WebP</option>
                    <option value="jpeg">JPEG</option>
                    <option value="png">PNG</option>
                  </select>
                </div>

                {/* Quality Slider */}
                <div style={{ marginBottom: "16px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "6px",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#374151",
                    }}
                  >
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
                    style={{ width: "100%", accentColor: "#4f46e5" }}
                    disabled={options.autoOptimize}
                  />
                </div>

                {/* Resize Options */}
                <div style={{ marginBottom: "16px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "6px",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#374151",
                    }}
                  >
                    Resize (optional)
                  </label>
                  <div style={{ display: "flex", gap: "8px" }}>
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
                      style={{
                        flex: 1,
                        padding: "8px 12px",
                        border: "1px solid #d1d5db",
                        borderRadius: "6px",
                        fontSize: "14px",
                      }}
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
                      style={{
                        flex: 1,
                        padding: "8px 12px",
                        border: "1px solid #d1d5db",
                        borderRadius: "6px",
                        fontSize: "14px",
                      }}
                      disabled={options.autoOptimize}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  marginTop: "24px",
                  borderTop: "1px solid #f3f4f6",
                  paddingTop: "16px",
                }}
              >
                {/* Optimized URL Display */}
                <div
                  style={{
                    padding: "12px",
                    background: "#f8fafc",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    marginBottom: "8px",
                  }}
                >
                  <label
                    style={{
                      display: "block",
                      marginBottom: "6px",
                      fontSize: "12px",
                      fontWeight: "500",
                      color: "#64748b",
                    }}
                  >
                    Optimized Image URL:
                  </label>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#475569",
                      wordBreak: "break-all",
                      lineHeight: "1.4",
                      fontFamily: "monospace",
                      background: "white",
                      padding: "8px",
                      borderRadius: "4px",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    {getOptimizedImageUrl()}
                  </div>
                </div>

                <button
                  onClick={downloadOptimizedImage}
                  disabled={downloading}
                  style={{
                    background: "#4f46e5",
                    color: "white",
                    border: "none",
                    padding: "12px",
                    borderRadius: "8px",
                    cursor: downloading ? "not-allowed" : "pointer",
                    fontSize: "14px",
                    fontWeight: "500",
                    opacity: downloading ? 0.7 : 1,
                    textAlign: "center",
                  }}
                >
                  {downloading ? "Downloading..." : "Download Optimized Image"}
                </button>

                <button
                  onClick={handleCopyUrl}
                  style={{
                    background: copied ? "#10b981" : "#f3f4f6",
                    color: copied ? "white" : "#374151",
                    border: "none",
                    padding: "10px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "500",
                    textAlign: "center",
                    transition: "background-color 0.2s",
                  }}
                >
                  {copied ? "Copied!" : "Copy Optimized URL"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Image Previews Column */}
        <div className="previews-column" style={previewsColumnStyle}>
          <div style={previewsContainerStyle}>
            {/* Original Image Preview */}
            <div
              className="original-image-card"
              style={{
                flex: 1,
                background: "white",
                padding: "16px",
                borderRadius: "12px",
                border: "1px solid #e5e7eb",
                boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.05)",
              }}
            >
              <h3
                style={{
                  margin: "0 0 12px 0",
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "#111827",
                }}
              >
                Original
              </h3>
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  paddingBottom: "75%", // 4:3 aspect ratio
                }}
              >
                <Image
                  src={imageUrl}
                  alt={`Original ${image.name || "image"}`}
                  fill
                  style={{ objectFit: "contain" }}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <p
                style={{
                  margin: "8px 0 0 0",
                  fontSize: "12px",
                  color: "#6b7280",
                }}
              >
                {Math.round(image.size / 1024)} KB
              </p>
            </div>

            {/* Optimized Image Preview */}
            {showOptions && (
              <div
                className="optimized-image-card"
                style={{
                  flex: 1,
                  background: "white",
                  padding: "16px",
                  borderRadius: "12px",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.05)",
                }}
              >
                <h3
                  style={{
                    margin: "0 0 12px 0",
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#111827",
                  }}
                >
                  Optimized
                </h3>
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    paddingBottom: "75%",
                    background: "#f3f4f6",
                    borderRadius: "8px",
                    overflow: "hidden",
                  }}
                >
                  <Image
                    src={getOptimizedImageUrl()}
                    alt={`Optimized ${image.name || "image"}`}
                    fill
                    style={{ objectFit: "contain" }}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    key={getOptimizedImageUrl()} // Re-render image on change
                  />
                </div>
                <p
                  style={{
                    margin: "8px 0 0 0",
                    fontSize: "12px",
                    color: "#6b7280",
                  }}
                >
                  {optimizedLoading ? "Calculating..." : getEstimatedSize()}
                  {optimizedSize !== null && optimizedSize !== image.size && (
                    <span style={{ color: "#10b981", marginLeft: "8px" }}>
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
