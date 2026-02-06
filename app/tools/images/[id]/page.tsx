"use client";

import { useState, useEffect, use } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ImageComparisonSlider from "@/components/ImageComparisonSlider";

interface ImageData {
    id: string;
    userId: string;
    name: string;
    url: string;
    size: number;
    detectedType: string;
    createdAt: string;
}

type OutputFormat = "original" | "webp" | "jpeg" | "png";

export default function ImageDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const { data: session, status } = useSession();
    const router = useRouter();

    const [image, setImage] = useState<ImageData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Optimization settings
    const [outputFormat, setOutputFormat] = useState<OutputFormat>("webp");
    const [quality, setQuality] = useState(80);
    const [width, setWidth] = useState<string>("");
    const [height, setHeight] = useState<string>("");
    const [keepOriginal, setKeepOriginal] = useState(false);

    // Optimized image state
    const [optimizedSize, setOptimizedSize] = useState<number>(0);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    useEffect(() => {
        if (status === "authenticated") {
            fetchImage();
        }
    }, [status, id]);

    const fetchImage = async () => {
        try {
            const response = await fetch(`/api/images/${id}`);
            if (!response.ok) {
                throw new Error("Image not found");
            }
            const data = await response.json();
            setImage(data);
            setOptimizedSize(data.size);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load image");
        } finally {
            setLoading(false);
        }
    };

    // Build optimized URL
    const getOptimizedUrl = () => {
        if (!image || keepOriginal) return image?.url || "";

        const params = new URLSearchParams();
        params.set("format", outputFormat);
        params.set("quality", quality.toString());
        if (width) params.set("width", width);
        if (height) params.set("height", height);

        return `/api/assets/${image.userId}/${image.id}?${params.toString()}`;
    };

    // Fetch optimized size when settings change
    useEffect(() => {
        if (!image || keepOriginal) {
            setOptimizedSize(image?.size || 0);
            return;
        }

        const fetchOptimizedSize = async () => {
            try {
                const response = await fetch(getOptimizedUrl(), { method: "HEAD" });
                const size = response.headers.get("X-Optimized-Size");
                if (size) {
                    setOptimizedSize(parseInt(size, 10));
                }
            } catch {
                // Fallback: fetch full image to get size
                try {
                    const response = await fetch(getOptimizedUrl());
                    const blob = await response.blob();
                    setOptimizedSize(blob.size);
                } catch {
                    setOptimizedSize(image.size);
                }
            }
        };

        const debounce = setTimeout(fetchOptimizedSize, 500);
        return () => clearTimeout(debounce);
    }, [image, outputFormat, quality, width, height, keepOriginal]);

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const copyUrl = async () => {
        const url = window.location.origin + getOptimizedUrl();
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const downloadOptimized = () => {
        const link = document.createElement("a");
        link.href = getOptimizedUrl();
        const extension = keepOriginal ? image?.detectedType.split("/")[1] : outputFormat;
        link.download = `${image?.name.split(".")[0]}_optimized.${extension}`;
        link.click();
    };

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            </div>
        );
    }

    if (error || !image) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold text-black mb-2">Image Not Found</h1>
                <p className="text-gray-500 mb-6">{error || "The image could not be loaded."}</p>
                <Link
                    href="/tools/images"
                    className="bg-black text-white px-5 py-2.5 rounded-lg hover:bg-gray-800"
                >
                    Back to Gallery
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <nav className="flex items-center gap-2 text-sm text-gray-500">
                        <Link href="/dashboard" className="hover:text-black">
                            Dashboard
                        </Link>
                        <span>/</span>
                        <Link href="/tools/images" className="hover:text-black">
                            My Images
                        </Link>
                        <span>/</span>
                        <span className="text-black truncate max-w-[200px]">{image.name}</span>
                    </nav>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Sidebar - Column 1 */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Image Info */}
                        <div className="bg-gray-50 rounded-2xl p-6">
                            <h2 className="text-lg font-semibold text-black mb-4">Image Info</h2>
                            <dl className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <dt className="text-gray-500">Name</dt>
                                    <dd className="text-black font-medium truncate max-w-[180px]">{image.name}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-gray-500">Size</dt>
                                    <dd className="text-black font-medium">{formatFileSize(image.size)}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-gray-500">Type</dt>
                                    <dd className="text-black font-medium">{image.detectedType.split("/")[1]?.toUpperCase()}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-gray-500">Uploaded</dt>
                                    <dd className="text-black font-medium">{formatDate(image.createdAt)}</dd>
                                </div>
                            </dl>
                        </div>

                        {/* Optimization Controls */}
                        <div className="bg-gray-50 rounded-2xl p-6">
                            <h2 className="text-lg font-semibold text-black mb-4">Optimization</h2>

                            {/* Keep Original Toggle */}
                            <label className="flex items-center justify-between mb-4 cursor-pointer">
                                <span className="text-sm text-gray-700">Keep original (no optimization)</span>
                                <div
                                    className={`w-11 h-6 rounded-full transition-colors ${keepOriginal ? "bg-black" : "bg-gray-300"}`}
                                    onClick={() => setKeepOriginal(!keepOriginal)}
                                >
                                    <div
                                        className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform mt-0.5 ${keepOriginal ? "translate-x-5 ml-0.5" : "translate-x-0.5"}`}
                                    />
                                </div>
                            </label>

                            {!keepOriginal && (
                                <>
                                    {/* Format */}
                                    <div className="mb-4">
                                        <label className="block text-sm text-gray-700 mb-2">Format</label>
                                        <select
                                            value={outputFormat}
                                            onChange={(e) => setOutputFormat(e.target.value as OutputFormat)}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                        >
                                            <option value="original">Original</option>
                                            <option value="webp">WebP</option>
                                            <option value="jpeg">JPEG</option>
                                            <option value="png">PNG</option>
                                        </select>
                                    </div>

                                    {/* Quality Slider */}
                                    <div className="mb-4">
                                        <label className="block text-sm text-gray-700 mb-2">
                                            Quality: {quality}%
                                        </label>
                                        <input
                                            type="range"
                                            min="10"
                                            max="100"
                                            value={quality}
                                            onChange={(e) => setQuality(parseInt(e.target.value, 10))}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                                        />
                                    </div>

                                    {/* Resize */}
                                    <div className="mb-4">
                                        <label className="block text-sm text-gray-700 mb-2">Resize (optional)</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="number"
                                                placeholder="Width"
                                                value={width}
                                                onChange={(e) => setWidth(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                            />
                                            <span className="flex items-center text-gray-400">×</span>
                                            <input
                                                type="number"
                                                placeholder="Height"
                                                value={height}
                                                onChange={(e) => setHeight(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                            />
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="bg-gray-50 rounded-2xl p-6">
                            <h2 className="text-lg font-semibold text-black mb-4">Actions</h2>

                            {/* Optimized URL */}
                            <div className="mb-4">
                                <label className="block text-sm text-gray-700 mb-2">Optimized URL</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        readOnly
                                        value={getOptimizedUrl()}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm text-gray-600 truncate"
                                    />
                                    <button
                                        onClick={copyUrl}
                                        className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium shrink-0"
                                    >
                                        {copied ? "Copied!" : "Copy"}
                                    </button>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="space-y-2">
                                <button
                                    onClick={downloadOptimized}
                                    className="w-full bg-black text-white py-2.5 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                                >
                                    Download Optimized
                                </button>
                                <a
                                    href={image.url}
                                    download={image.name}
                                    className="block w-full text-center bg-white border border-gray-200 text-black py-2.5 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                >
                                    Download Original
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Image Comparison - Columns 2-3 */}
                    <div className="lg:col-span-2">
                        <div className="bg-gray-100 rounded-2xl overflow-hidden aspect-4/3">
                            <ImageComparisonSlider
                                originalSrc={image.url}
                                optimizedSrc={keepOriginal ? image.url : getOptimizedUrl()}
                                originalSize={image.size}
                                optimizedSize={optimizedSize}
                            />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
