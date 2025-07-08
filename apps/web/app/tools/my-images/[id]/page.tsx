"use client";
import { useEffect, useState } from "react";
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
  const [showOptions, setShowOptions] = useState(false);
  const [downloading, setDownloading] = useState(false);

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
  const getOptimizedImageUrl = () => {
    if (!image) return "";

    const baseUrl = `${PUBLIC_DEVELOPMENT_URL}/${image.url}`;
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

  if (loading) return <div className="loading">Loading image...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!image) return <div className="error">Image not found.</div>;

  const isImageAbsolute = image.url.startsWith("http");
  const imageUrl = isImageAbsolute
    ? image.url
    : `${PUBLIC_DEVELOPMENT_URL}/${image.url}`;

  return (
    <div
      className="image-preview-page"
      style={{
        padding: "20px",
        maxWidth: "1200px",
        margin: "0 auto",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <button
        onClick={() => router.back()}
        className="back-btn"
        style={{
          background: "#6366f1",
          color: "white",
          border: "none",
          padding: "10px 16px",
          borderRadius: "6px",
          cursor: "pointer",
          marginBottom: "20px",
          fontSize: "14px",
          fontWeight: "500",
        }}
      >
        ← Back to Gallery
      </button>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 300px",
          gap: "20px",
        }}
      >
        {/* Image Preview */}
        <div
          className="image-preview-container"
          style={{ position: "relative" }}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "70vh",
              background: "#f8f9fa",
              borderRadius: "8px",
              overflow: "hidden",
              border: "1px solid #e9ecef",
            }}
          >
            <Image
              src={imageUrl}
              alt={image.name}
              fill
              style={{ objectFit: "contain" }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 60vw"
            />
          </div>

          {/* Optimized Preview */}
          {showOptions && (
            <div
              style={{
                marginTop: "20px",
                padding: "16px",
                background: "#f8f9fa",
                borderRadius: "8px",
                border: "1px solid #e9ecef",
              }}
            >
              <h3
                style={{
                  margin: "0 0 12px 0",
                  fontSize: "16px",
                  fontWeight: "600",
                }}
              >
                Optimized Preview
              </h3>
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "200px",
                  background: "white",
                  borderRadius: "6px",
                  overflow: "hidden",
                  border: "1px solid #dee2e6",
                }}
              >
                <Image
                  src={getOptimizedImageUrl()}
                  alt={`Optimized ${image.name}`}
                  fill
                  style={{ objectFit: "contain" }}
                />
              </div>
              <p
                style={{
                  margin: "8px 0 0 0",
                  fontSize: "12px",
                  color: "#6c757d",
                }}
              >
                Estimated size: {getEstimatedSize()}
              </p>
            </div>
          )}
        </div>

        {/* Sidebar with Image Info and Optimization Controls */}
        <div className="sidebar">
          {/* Image Information */}
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "8px",
              border: "1px solid #e9ecef",
              marginBottom: "20px",
            }}
          >
            <h2
              style={{
                margin: "0 0 16px 0",
                fontSize: "18px",
                fontWeight: "600",
              }}
            >
              {image.name}
            </h2>
            <div
              style={{ fontSize: "14px", color: "#6c757d", lineHeight: "1.5" }}
            >
              <p style={{ margin: "4px 0" }}>
                <strong>Size:</strong> {Math.round(image.size / 1024)} KB
              </p>
              <p style={{ margin: "4px 0" }}>
                <strong>Type:</strong> {image.contentType}
              </p>
              <p style={{ margin: "4px 0" }}>
                <strong>Uploaded:</strong>{" "}
                {new Date(image.uploadedAt).toLocaleString()}
              </p>
              {image.tags && image.tags.length > 0 && (
                <p style={{ margin: "4px 0" }}>
                  <strong>Tags:</strong> {image.tags.join(", ")}
                </p>
              )}
              <p style={{ margin: "12px 0 4px 0", fontSize: "12px" }}>
                <strong>Device:</strong>{" "}
                {deviceInfo.isMobile
                  ? "Mobile"
                  : deviceInfo.isTablet
                    ? "Tablet"
                    : "Desktop"}
                ({deviceInfo.screenWidth}px, {deviceInfo.connection})
              </p>
            </div>
          </div>

          {/* Optimization Controls */}
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "8px",
              border: "1px solid #e9ecef",
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
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "600" }}>
                Optimization Options
              </h3>
              <button
                onClick={() => setShowOptions(!showOptions)}
                style={{
                  background: showOptions ? "#dc2626" : "#059669",
                  color: "white",
                  border: "none",
                  padding: "6px 12px",
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
            <div style={{ marginBottom: "16px" }}>
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
                  style={{ marginRight: "8px" }}
                />
                Auto-optimize for device
              </label>
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
                  checked={options.autoResize}
                  onChange={(e) =>
                    setOptions({ ...options, autoResize: e.target.checked })
                  }
                  style={{ marginRight: "8px" }}
                />
                Auto-resize for screen
              </label>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "16px",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={options.autoCompress}
                  onChange={(e) =>
                    setOptions({ ...options, autoCompress: e.target.checked })
                  }
                  style={{ marginRight: "8px" }}
                />
                Auto-compress for connection
              </label>
            </div>

            {/* Format Selection */}
            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                Output Format:
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
                  padding: "8px",
                  border: "1px solid #d1d5db",
                  borderRadius: "4px",
                  fontSize: "14px",
                }}
                disabled={options.autoOptimize}
              >
                <option value="original">Original</option>
                <option value="webp">WebP (Best compression)</option>
                <option value="jpeg">JPEG (Good compression)</option>
                <option value="png">PNG (Lossless)</option>
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
                  setOptions({ ...options, quality: parseInt(e.target.value) })
                }
                style={{ width: "100%" }}
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
                }}
              >
                Resize (optional):
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
                    padding: "8px",
                    border: "1px solid #d1d5db",
                    borderRadius: "4px",
                    fontSize: "14px",
                  }}
                  disabled={options.autoResize}
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
                    padding: "8px",
                    border: "1px solid #d1d5db",
                    borderRadius: "4px",
                    fontSize: "14px",
                  }}
                  disabled={options.autoResize}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              <button
                onClick={downloadOptimizedImage}
                disabled={downloading}
                style={{
                  background: "#059669",
                  color: "white",
                  border: "none",
                  padding: "12px",
                  borderRadius: "6px",
                  cursor: downloading ? "not-allowed" : "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                  opacity: downloading ? 0.7 : 1,
                }}
              >
                {downloading ? "Downloading..." : "Download Optimized Image"}
              </button>

              <button
                onClick={() =>
                  navigator.clipboard.writeText(getOptimizedImageUrl())
                }
                style={{
                  background: "#6366f1",
                  color: "white",
                  border: "none",
                  padding: "10px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                Copy Optimized URL
              </button>
            </div>

            {/* Size Estimation */}
            <div
              style={{
                marginTop: "16px",
                padding: "12px",
                background: "#f8f9fa",
                borderRadius: "6px",
                border: "1px solid #e9ecef",
              }}
            >
              <div style={{ fontSize: "12px", color: "#6c757d" }}>
                <p style={{ margin: "2px 0" }}>
                  <strong>Original:</strong> {Math.round(image.size / 1024)} KB
                </p>
                <p style={{ margin: "2px 0" }}>
                  <strong>Estimated:</strong> {getEstimatedSize()}
                </p>
                <p style={{ margin: "2px 0" }}>
                  <strong>Savings:</strong> ~
                  {Math.round(
                    (1 -
                      parseInt(getEstimatedSize().replace(/[^0-9]/g, "")) /
                        Math.round(image.size / 1024)) *
                      100
                  )}
                  %
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
