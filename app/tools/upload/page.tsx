"use client";

import { useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface UploadedFile {
    id: string;
    name: string;
    size: number;
    status: "pending" | "uploading" | "success" | "error";
    progress: number;
    error?: string;
}

export default function UploadPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [files, setFiles] = useState<UploadedFile[]>([]);
    const [isDragging, setIsDragging] = useState(false);

    // Redirect if not authenticated
    if (status === "unauthenticated") {
        router.push("/login");
        return null;
    }

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            </div>
        );
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFiles = Array.from(e.dataTransfer.files).filter((file) =>
            file.type.startsWith("image/")
        );
        handleFiles(droppedFiles);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            handleFiles(selectedFiles);
        }
    };

    const handleFiles = (newFiles: File[]) => {
        const uploadFiles: UploadedFile[] = newFiles.map((file) => ({
            id: `${file.name}-${Date.now()}-${Math.random()}`,
            name: file.name,
            size: file.size,
            status: "pending" as const,
            progress: 0,
        }));

        setFiles((prev) => [...prev, ...uploadFiles]);

        // Upload each file
        newFiles.forEach((file, index) => {
            uploadFile(file, uploadFiles[index].id);
        });
    };

    const uploadFile = async (file: File, fileId: string) => {
        setFiles((prev) =>
            prev.map((f) => (f.id === fileId ? { ...f, status: "uploading" } : f))
        );

        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch("/api/images", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Upload failed");
            }

            setFiles((prev) =>
                prev.map((f) =>
                    f.id === fileId ? { ...f, status: "success", progress: 100 } : f
                )
            );
        } catch (error) {
            setFiles((prev) =>
                prev.map((f) =>
                    f.id === fileId
                        ? {
                            ...f,
                            status: "error",
                            error: error instanceof Error ? error.message : "Upload failed",
                        }
                        : f
                )
            );
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const successCount = files.filter((f) => f.status === "success").length;

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-6 py-4">
                    <nav className="flex items-center gap-2 text-sm text-gray-500">
                        <Link href="/dashboard" className="hover:text-black">
                            Dashboard
                        </Link>
                        <span>/</span>
                        <span className="text-black">Upload</span>
                    </nav>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-12">
                {/* Hero */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-black mb-4">
                        Upload & Optimize
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Drag and drop your images or click to browse. Supports JPEG, PNG,
                        WebP, and GIF.
                    </p>
                </div>

                {/* Drop Zone */}
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`
            border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all
            ${isDragging
                            ? "border-black bg-gray-50 scale-[1.02]"
                            : "border-gray-300 hover:border-gray-400"
                        }
          `}
                    onClick={() => document.getElementById("file-input")?.click()}
                >
                    <input
                        id="file-input"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                    />

                    <div className="mb-4">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                    </div>

                    <p className="text-lg font-medium text-black mb-2">
                        {isDragging ? "Drop your images here" : "Drop images here"}
                    </p>
                    <p className="text-gray-500 mb-4">or click to browse</p>
                    <p className="text-sm text-gray-400">Maximum file size: 10MB</p>
                </div>

                {/* Features */}
                <div className="grid grid-cols-3 gap-6 mt-8">
                    <div className="flex items-center gap-2 text-gray-600">
                        <svg
                            className="h-5 w-5 text-green-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                        <span>Auto format detection</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                        <svg
                            className="h-5 w-5 text-green-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                        <span>Intelligent compression</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                        <svg
                            className="h-5 w-5 text-green-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                        <span>WebP conversion</span>
                    </div>
                </div>

                {/* File List */}
                {files.length > 0 && (
                    <div className="mt-12">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-black">
                                Uploads ({successCount}/{files.length})
                            </h2>
                            {successCount > 0 && (
                                <Link
                                    href="/tools/images"
                                    className="text-black hover:underline text-sm font-medium"
                                >
                                    View in Gallery →
                                </Link>
                            )}
                        </div>

                        <div className="space-y-3">
                            {files.map((file) => (
                                <div
                                    key={file.id}
                                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
                                >
                                    {/* Status Icon */}
                                    <div className="flex-shrink-0">
                                        {file.status === "pending" && (
                                            <div className="h-8 w-8 rounded-full bg-gray-200"></div>
                                        )}
                                        {file.status === "uploading" && (
                                            <div className="h-8 w-8 rounded-full border-2 border-black border-t-transparent animate-spin"></div>
                                        )}
                                        {file.status === "success" && (
                                            <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
                                                <svg
                                                    className="h-5 w-5 text-white"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M5 13l4 4L19 7"
                                                    />
                                                </svg>
                                            </div>
                                        )}
                                        {file.status === "error" && (
                                            <div className="h-8 w-8 rounded-full bg-red-500 flex items-center justify-center">
                                                <svg
                                                    className="h-5 w-5 text-white"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M6 18L18 6M6 6l12 12"
                                                    />
                                                </svg>
                                            </div>
                                        )}
                                    </div>

                                    {/* File Info */}
                                    <div className="flex-grow min-w-0">
                                        <p className="text-black font-medium truncate">
                                            {file.name}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {formatFileSize(file.size)}
                                            {file.error && (
                                                <span className="text-red-500 ml-2">• {file.error}</span>
                                            )}
                                        </p>
                                    </div>

                                    {/* Status Text */}
                                    <div className="flex-shrink-0 text-sm">
                                        {file.status === "pending" && (
                                            <span className="text-gray-400">Waiting...</span>
                                        )}
                                        {file.status === "uploading" && (
                                            <span className="text-black">Uploading...</span>
                                        )}
                                        {file.status === "success" && (
                                            <span className="text-green-600">Complete</span>
                                        )}
                                        {file.status === "error" && (
                                            <span className="text-red-500">Failed</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
