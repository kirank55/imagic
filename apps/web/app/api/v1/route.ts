import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    name: "Imagic API",
    version: "1.0.0",
    description: "Image processing and upload API",
    endpoints: {
      upload: {
        path: "/api/v1/upload",
        method: "POST",
        description: "Upload images to R2 storage with API key authentication",
        documentation: "/api/v1/README.md",
      },
    },
    authentication: {
      type: "API Key",
      description:
        "Use your public or private API key in the api_key parameter",
      obtain_keys: "Generate API keys from your profile page",
    },
    support: {
      documentation: "/api/v1/README.md",
      contact: "Visit your profile page for API key management",
    },
  });
}
