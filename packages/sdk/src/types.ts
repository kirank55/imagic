// Core types for the SDK
export interface ImagicClientConfig {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
}

export interface UploadOptions {
  filename?: string;
  contentType?: string;
}

export interface UploadResponse {
  success: boolean;
  data?: {
    id: string;
    key: string;
    url: string;
    name: string;
    size: number;
    type: string;
    uploadedAt: string;
  };
  message?: string;
  warning?: string;
}

export interface ErrorResponse {
  success: false;
  error: string;
  message: string;
}

export type ApiResponse = UploadResponse | ErrorResponse;

export interface ApiInfo {
  name: string;
  version: string;
  description: string;
  endpoints: {
    upload: {
      path: string;
      method: string;
      description: string;
      documentation: string;
    };
  };
  authentication: {
    type: string;
    description: string;
    obtain_keys: string;
  };
}

// Supported file types
export const SUPPORTED_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/bmp",
  "image/gif",
  "image/webp",
  "image/svg+xml",
] as const;

export type SupportedMimeType = typeof SUPPORTED_MIME_TYPES[number];

// Error types
export class ImagicError extends Error {
  public readonly statusCode?: number;
  public readonly errorType?: string;

  constructor(message: string, statusCode?: number, errorType?: string) {
    super(message);
    this.name = "ImagicError";
    this.statusCode = statusCode;
    this.errorType = errorType;
  }
}

export class ValidationError extends ImagicError {
  constructor(message: string) {
    super(message, 400, "validation_error");
    this.name = "ValidationError";
  }
}

export class AuthenticationError extends ImagicError {
  constructor(message: string) {
    super(message, 401, "authentication_error");
    this.name = "AuthenticationError";
  }
}

export class NetworkError extends ImagicError {
  constructor(message: string) {
    super(message, 0, "network_error");
    this.name = "NetworkError";
  }
}
