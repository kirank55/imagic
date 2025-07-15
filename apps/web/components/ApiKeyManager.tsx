"use client";

import { useState, useEffect } from "react";

interface ApiKeys {
  publicKey: string | null;
  privateKey: string | null;
  createdAt: string | null;
  hasKeys: boolean;
}

export default function ApiKeyManager() {
  const [apiKeys, setApiKeys] = useState<ApiKeys>({
    publicKey: null,
    privateKey: null,
    createdAt: null,
    hasKeys: false,
  });
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showPrivateKey, setShowPrivateKey] = useState(false);

  // Fetch existing API keys on component mount
  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    try {
      const response = await fetch("/api/profile/api-keys");
      if (response.ok) {
        const data = await response.json();
        setApiKeys(data);
      }
    } catch (error) {
      console.error("Error fetching API keys:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateApiKeys = async () => {
    setGenerating(true);
    try {
      const response = await fetch("/api/profile/generate-keys", {
        method: "POST",
      });

      if (response.ok) {
        const data = await response.json();
        setApiKeys({
          publicKey: data.publicKey,
          privateKey: data.privateKey,
          createdAt: data.createdAt,
          hasKeys: true,
        });
      } else {
        console.error("Failed to generate API keys");
      }
    } catch (error) {
      console.error("Error generating API keys:", error);
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-2">API Keys</h2>
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-2">API Keys</h2>
      <p className="text-gray-600 mb-6">
        Generate and manage your API keys for programmatic access to your
        images.
      </p>

      {!apiKeys.hasKeys ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">
            You don&apos;t have any API keys yet. Generate them to get started.
          </p>
          <button
            onClick={generateApiKeys}
            disabled={generating}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generating ? "Generating..." : "Generate API Keys"}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="public-key"
              className="block text-sm font-medium text-gray-700"
            >
              Public Key
            </label>
            <div className="flex gap-2">
              <input
                id="public-key"
                value={apiKeys.publicKey || ""}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 font-mono text-sm"
              />
              <button
                onClick={() => copyToClipboard(apiKeys.publicKey || "")}
                className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                title="Copy to clipboard"
              >
                📋
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="private-key"
              className="block text-sm font-medium text-gray-700"
            >
              Private Key
            </label>
            <div className="flex gap-2">
              <input
                id="private-key"
                type={showPrivateKey ? "text" : "password"}
                value={apiKeys.privateKey || ""}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 font-mono text-sm"
              />
              <button
                onClick={() => setShowPrivateKey(!showPrivateKey)}
                className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                title={showPrivateKey ? "Hide" : "Show"}
              >
                {showPrivateKey ? "👁️" : "🔒"}
              </button>
              <button
                onClick={() => copyToClipboard(apiKeys.privateKey || "")}
                className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                title="Copy to clipboard"
              >
                📋
              </button>
            </div>
          </div>

          {apiKeys.createdAt && (
            <p className="text-sm text-gray-500">
              Generated on: {new Date(apiKeys.createdAt).toLocaleString()}
            </p>
          )}

          <div className="flex gap-2 pt-4">
            <button
              onClick={generateApiKeys}
              disabled={generating}
              className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generating ? "Generating..." : "Regenerate Keys"}
            </button>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Warning:</strong> Keep your private key secure and never
              share it publicly. If you regenerate your keys, the old ones will
              stop working immediately.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
