// Simple test to verify SDK functionality
const {
  ImagicClient,
  ValidationError,
  AuthenticationError,
} = require("../dist");

describe("ImagicClient", () => {
  describe("Constructor", () => {
    test("should create client with valid config", () => {
      const client = new ImagicClient({
        apiKey: "test-api-key",
        baseUrl: "http://localhost:3000",
      });
      expect(client).toBeInstanceOf(ImagicClient);
    });

    test("should throw ValidationError with empty API key", () => {
      expect(() => {
        new ImagicClient({ apiKey: "" });
      }).toThrow(ValidationError);
    });

    test("should throw ValidationError with invalid URL", () => {
      expect(() => {
        new ImagicClient({
          apiKey: "test-key",
          baseUrl: "invalid-url",
        });
      }).toThrow(ValidationError);
    });
  });

  describe("Upload method", () => {
    let client;

    beforeEach(() => {
      client = new ImagicClient({
        apiKey: "test-api-key",
        baseUrl: "http://localhost:3000",
      });
    });

    test("should throw ValidationError for non-existent file", async () => {
      await expect(client.upload("/non/existent/file.jpg")).rejects.toThrow(
        ValidationError
      );
    });

    test("should throw ValidationError for invalid buffer size", async () => {
      const largeBuffer = Buffer.alloc(11 * 1024 * 1024); // 11MB

      await expect(client.upload(largeBuffer)).rejects.toThrow(ValidationError);
    });
  });
});

// Integration test (requires running API)
describe("Integration Tests", () => {
  const apiKey = process.env.IMAGIC_API_KEY;
  const baseUrl = process.env.IMAGIC_BASE_URL || "http://localhost:3000";

  if (!apiKey) {
    console.log("Skipping integration tests - IMAGIC_API_KEY not set");
    return;
  }

  let client;

  beforeEach(() => {
    client = new ImagicClient({ apiKey, baseUrl });
  });

  test("should connect to API", async () => {
    const isConnected = await client.testConnection();
    expect(isConnected).toBe(true);
  });

  test("should get API info", async () => {
    const info = await client.getApiInfo();
    expect(info).toHaveProperty("name");
    expect(info).toHaveProperty("version");
    expect(info).toHaveProperty("endpoints");
  });
});
