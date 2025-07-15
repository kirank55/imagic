import fetch from "node-fetch";
import FormData from "form-data";
import {
  ImagicClientConfig,
  UploadOptions,
  ApiResponse,
  ApiInfo,
  ImagicError,
  AuthenticationError,
  NetworkError,
  ValidationError,
} from "./types";
import {
  validateApiKey,
  validateUrl,
  readFileFromPath,
  extractFilename,
  detectMimeTypeFromExtension,
  isValidMimeType,
  validateFileSize,
} from "./utils";

/**
 * Official Imagic Node.js SDK Client
 */
export class ImagicClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly timeout: number;

  constructor(config: ImagicClientConfig) {
    validateApiKey(config.apiKey);

    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || "http://localhost:3000";
    this.timeout = config.timeout || 30000; // 30 seconds default

    // Validate base URL
    validateUrl(this.baseUrl);
  }

  /**
   * Upload an image file to Imagic
   * @param input - File path (string) or Buffer
   * @param options - Upload options
   * @returns Promise<ApiResponse>
   */
  async upload(
    input: string | Buffer,
    options: UploadOptions = {}
  ): Promise<ApiResponse> {
    try {
      let buffer: Buffer;
      let filename: string;
      let contentType: string;

      // Handle different input types
      if (typeof input === "string") {
        // File path
        buffer = await readFileFromPath(input);
        filename = options.filename || extractFilename(input);
        contentType =
          options.contentType || detectMimeTypeFromExtension(filename);
      } else {
        // Buffer
        buffer = input;
        filename = options.filename || "image.jpg";
        contentType =
          options.contentType || detectMimeTypeFromExtension(filename);
      }

      // Validate file size
      validateFileSize(buffer.length);

      // Validate content type
      if (!isValidMimeType(contentType)) {
        throw new ValidationError(`Unsupported file type: ${contentType}`);
      }

      // Create form data
      const formData = new FormData();
      formData.append("image", buffer, {
        filename,
        contentType,
      });
      formData.append("api_key", this.apiKey);

      // Make request
      const response = await this.makeRequest("/api/v1/upload", {
        method: "POST",
        body: formData,
        headers: formData.getHeaders(),
      });

      const data = (await response.json()) as ApiResponse;

      if (!response.ok) {
        this.handleErrorResponse(response.status, data);
      }

      return data;
    } catch (error) {
      if (error instanceof ImagicError) {
        throw error;
      }

      throw new ImagicError(
        `Upload failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        500,
        "upload_error"
      );
    }
  }

  /**
   * Upload multiple images
   * @param inputs - Array of file paths or buffers
   * @param options - Upload options
   * @returns Promise<ApiResponse[]>
   */
  async uploadMultiple(
    inputs: Array<string | Buffer>,
    options: UploadOptions = {}
  ): Promise<ApiResponse[]> {
    const uploadPromises = inputs.map((input, index) => {
      const indexedOptions = {
        ...options,
        filename: options.filename ? `${index}_${options.filename}` : undefined,
      };
      return this.upload(input, indexedOptions);
    });

    return Promise.all(uploadPromises);
  }

  /**
   * Get API information
   * @returns Promise<ApiInfo>
   */
  async getApiInfo(): Promise<ApiInfo> {
    try {
      const response = await this.makeRequest("/api/v1");

      if (!response.ok) {
        throw new NetworkError(
          `Failed to get API info: ${response.status} ${response.statusText}`
        );
      }

      return (await response.json()) as ApiInfo;
    } catch (error) {
      if (error instanceof ImagicError) {
        throw error;
      }

      throw new NetworkError(
        `Failed to get API info: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Test the API connection and authentication
   * @returns Promise<boolean>
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.getApiInfo();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Make HTTP request to the API
   */
  private async makeRequest(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const url = new URL(endpoint, this.baseUrl).toString();

    const requestOptions: RequestInit = {
      ...options,
      timeout: this.timeout,
    };

    try {
      const response = await fetch(url, requestOptions);
      return response as Response;
    } catch (error) {
      throw new NetworkError(
        `Network request failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Handle error responses from the API
   */
  private handleErrorResponse(status: number, data: any): never {
    const message = data?.message || "Unknown error";
    const errorType = data?.error || "unknown_error";

    switch (status) {
      case 400:
        throw new ValidationError(message);
      case 401:
        throw new AuthenticationError(message);
      case 404:
        throw new ImagicError(message, 404, "not_found");
      case 429:
        throw new ImagicError(message, 429, "rate_limit_exceeded");
      case 500:
        throw new ImagicError(message, 500, "server_error");
      default:
        throw new ImagicError(message, status, errorType);
    }
  }
}

// Type declarations for node-fetch compatibility
interface RequestInit {
  method?: string;
  body?: any;
  headers?: any;
  timeout?: number;
}

interface Response {
  ok: boolean;
  status: number;
  statusText: string;
  json(): Promise<any>;
}
