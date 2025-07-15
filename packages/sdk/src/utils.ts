/// <reference types="node" />
import {
  SUPPORTED_MIME_TYPES,
  SupportedMimeType,
  ValidationError,
} from "./types";
import * as fs from "fs";
import * as path from "path";
import { URL } from "url";

/**
 * Validates if a file type is supported
 */
export function isValidMimeType(
  mimeType: string
): mimeType is SupportedMimeType {
  return SUPPORTED_MIME_TYPES.includes(mimeType as SupportedMimeType);
}

/**
 * Detects MIME type from file extension
 */
export function detectMimeTypeFromExtension(filename: string): string {
  const ext = path.extname(filename).toLowerCase();

  switch (ext) {
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".gif":
      return "image/gif";
    case ".bmp":
      return "image/bmp";
    case ".webp":
      return "image/webp";
    case ".svg":
      return "image/svg+xml";
    default:
      return "image/jpeg"; // Default fallback
  }
}

/**
 * Validates file size (10MB limit)
 */
export function validateFileSize(size: number): void {
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (size > maxSize) {
    throw new ValidationError(
      `File size (${formatBytes(
        size
      )}) exceeds maximum allowed size of ${formatBytes(maxSize)}`
    );
  }
}

/**
 * Formats bytes to human readable format
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * Validates API key format
 */
export function validateApiKey(apiKey: string): void {
  if (!apiKey || typeof apiKey !== "string") {
    throw new ValidationError("API key is required and must be a string");
  }

  if (apiKey.trim().length === 0) {
    throw new ValidationError("API key cannot be empty");
  }
}

/**
 * Validates and reads file from path
 */
export async function readFileFromPath(filePath: string): Promise<Buffer> {
  try {
    // Check if file exists
    await fs.promises.access(filePath, fs.constants.F_OK);

    // Get file stats
    const stats = await fs.promises.stat(filePath);

    if (!stats.isFile()) {
      throw new ValidationError(`Path is not a file: ${filePath}`);
    }

    // Validate file size
    validateFileSize(stats.size);

    // Read file
    return await fs.promises.readFile(filePath);
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }

    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      throw new ValidationError(`File not found: ${filePath}`);
    }

    if ((error as NodeJS.ErrnoException).code === "EACCES") {
      throw new ValidationError(`Permission denied: ${filePath}`);
    }

    throw new ValidationError(
      `Failed to read file: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Extracts filename from file path
 */
export function extractFilename(filePath: string): string {
  return path.basename(filePath);
}

/**
 * Validates URL format
 */
export function validateUrl(url: string): void {
  try {
    new URL(url);
  } catch {
    throw new ValidationError(`Invalid URL format: ${url}`);
  }
}
