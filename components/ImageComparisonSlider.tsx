"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface ImageComparisonSliderProps {
    originalSrc: string;
    optimizedSrc: string;
    originalSize: number;
    optimizedSize: number;
}

export default function ImageComparisonSlider({
    originalSrc,
    optimizedSrc,
    originalSize,
    optimizedSize,
}: ImageComparisonSliderProps) {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const formatSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const savingsPercent = originalSize > 0
        ? Math.round(((originalSize - optimizedSize) / originalSize) * 100)
        : 0;

    const handleMove = useCallback(
        (clientX: number) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const x = clientX - rect.left;
            const percentage = Math.min(Math.max((x / rect.width) * 100, 0), 100);
            setSliderPosition(percentage);
        },
        []
    );

    const handleMouseDown = () => setIsDragging(true);
    const handleMouseUp = () => setIsDragging(false);

    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            if (isDragging) handleMove(e.clientX);
        },
        [isDragging, handleMove]
    );

    const handleTouchMove = useCallback(
        (e: TouchEvent) => {
            if (isDragging && e.touches[0]) {
                handleMove(e.touches[0].clientX);
            }
        },
        [isDragging, handleMove]
    );

    useEffect(() => {
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
        document.addEventListener("touchmove", handleTouchMove);
        document.addEventListener("touchend", handleMouseUp);

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
            document.removeEventListener("touchmove", handleTouchMove);
            document.removeEventListener("touchend", handleMouseUp);
        };
    }, [handleMouseMove, handleTouchMove]);

    return (
        <div className="relative w-full h-full select-none" ref={containerRef}>
            {/* Original Image (Background) */}
            <div className="absolute inset-0">
                <img
                    src={originalSrc}
                    alt="Original"
                    className="w-full h-full object-contain"
                    draggable={false}
                />
            </div>

            {/* Optimized Image (Foreground, clipped) */}
            <div
                className="absolute inset-0 overflow-hidden"
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
                <img
                    src={optimizedSrc}
                    alt="Optimized"
                    className="w-full h-full object-contain"
                    draggable={false}
                />
            </div>

            {/* Slider Handle */}
            <div
                className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-lg"
                style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
                onMouseDown={handleMouseDown}
                onTouchStart={handleMouseDown}
            >
                {/* Handle Circle */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center border border-gray-200">
                    <svg
                        className="w-5 h-5 text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                        />
                    </svg>
                </div>
            </div>

            {/* Labels */}
            <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1.5 rounded-lg text-sm font-medium">
                Optimized • {formatSize(optimizedSize)}
                {savingsPercent > 0 && (
                    <span className="text-green-400 ml-2">-{savingsPercent}%</span>
                )}
            </div>
            <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1.5 rounded-lg text-sm font-medium">
                Original • {formatSize(originalSize)}
            </div>
        </div>
    );
}
