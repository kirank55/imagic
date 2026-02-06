"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface ImageData {
    id: string;
    name: string;
    url: string;
    size: number;
    detectedType: string;
    createdAt: string;
}

type SortOption = "newest" | "oldest" | "name" | "size";
type FormatFilter = "all" | "jpeg" | "png" | "webp" | "gif";

export default function ImagesPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [images, setImages] = useState<ImageData[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [format, setFormat] = useState<FormatFilter>("all");
    const [sort, setSort] = useState<SortOption>("newest");

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    useEffect(() => {
        if (status === "authenticated") {
            fetchImages();
        }
    }, [status]);

    const fetchImages = async () => {
        try {
            const response = await fetch("/api/images");
            if (response.ok) {
                const data = await response.json();
                setImages(data);
            }
        } catch (error) {
            console.error("Failed to fetch images:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const getFormatBadge = (type: string) => {
        const format = type.split("/")[1]?.toUpperCase() || "UNKNOWN";
        return format;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    // Helper: Check if image matches search query
    const matchesSearch = (img: ImageData) => {
        if (!search) return true;
        return img.name.toLowerCase().includes(search.toLowerCase());
    };

    // Helper: Check if image matches format filter
    const matchesFormat = (img: ImageData) => {
        if (format === "all") return true;
        const imgFormat = img.detectedType.split("/")[1]?.toLowerCase();
        return imgFormat === format;
    };

    // Helper: Sort comparator based on selected option
    const sortImages = (a: ImageData, b: ImageData) => {
        switch (sort) {
            case "newest":
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            case "oldest":
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            case "name":
                return a.name.localeCompare(b.name);
            case "size":
                return b.size - a.size;
            default:
                return 0;
        }
    };

    // Filter and sort images
    const filteredImages = images
        .filter((img) => matchesSearch(img) && matchesFormat(img))
        .sort(sortImages);

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
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
                        <span className="text-black">My Images</span>
                    </nav>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Page Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-black">My Images</h1>
                        <p className="text-gray-500 mt-1">
                            {images.length} image{images.length !== 1 ? "s" : ""} uploaded
                        </p>
                    </div>
                    <Link
                        href="/tools/upload"
                        className="inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                    >
                        <svg
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
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

                {/* Filters Bar */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    {/* Search */}
                    <div className="grow relative">
                        <svg
                            className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search by filename..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                        />
                    </div>

                    {/* Format Filter */}
                    <select
                        value={format}
                        onChange={(e) => setFormat(e.target.value as FormatFilter)}
                        className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white min-w-[140px]"
                    >
                        <option value="all">All Formats</option>
                        <option value="jpeg">JPEG</option>
                        <option value="png">PNG</option>
                        <option value="webp">WebP</option>
                        <option value="gif">GIF</option>
                    </select>

                    {/* Sort */}
                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value as SortOption)}
                        className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white min-w-[140px]"
                    >
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest</option>
                        <option value="name">Name</option>
                        <option value="size">Size</option>
                    </select>
                </div>

                {/* Image Grid */}
                {filteredImages.length === 0 ? (
                    <div className="text-center py-16">
                        <svg
                            className="mx-auto h-16 w-16 text-gray-300 mb-4"
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
                        {images.length === 0 ? (
                            <>
                                <h3 className="text-xl font-semibold text-black mb-2">
                                    No images yet
                                </h3>
                                <p className="text-gray-500 mb-6">
                                    Upload your first image to get started
                                </p>
                                <Link
                                    href="/tools/upload"
                                    className="inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                                >
                                    Upload Images
                                </Link>
                            </>
                        ) : (
                            <>
                                <h3 className="text-xl font-semibold text-black mb-2">
                                    No matches found
                                </h3>
                                <p className="text-gray-500">
                                    Try adjusting your search or filters
                                </p>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredImages.map((image) => (
                            <Link
                                key={image.id}
                                href={`/tools/images/${image.id}`}
                                className="group block bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all hover:border-gray-300"
                            >
                                {/* Image Thumbnail */}
                                <div className="relative aspect-square bg-gray-100">
                                    <Image
                                        src={image.url}
                                        alt={image.name}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                    />
                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <div className="flex gap-2">
                                            <span className="bg-white text-black px-4 py-2 rounded-lg font-medium text-sm">
                                                View
                                            </span>
                                            <a
                                                href={image.url}
                                                download={image.name}
                                                onClick={(e) => e.stopPropagation()}
                                                className="bg-white text-black px-4 py-2 rounded-lg font-medium text-sm hover:bg-gray-100"
                                            >
                                                Download
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                {/* Image Info */}
                                <div className="p-4">
                                    <p className="font-medium text-black truncate mb-1">
                                        {image.name}
                                    </p>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-xs font-medium">
                                            {getFormatBadge(image.detectedType)}
                                        </span>
                                        <span>{formatFileSize(image.size)}</span>
                                    </div>
                                    <p className="text-sm text-gray-400 mt-2">
                                        {formatDate(image.createdAt)}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
