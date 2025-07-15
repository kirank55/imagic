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
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

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

  const copyToClipboard = async (text: string, type: "public" | "private") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyFeedback(type);
      setTimeout(() => setCopyFeedback(null), 2000);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }
  };

  if (loading) {
    return (
      <div className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-xl border border-white/30 p-8 overflow-hidden">
        <div className="animate-pulse">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-300/70 to-purple-300/70 rounded-xl animate-pulse shadow-md"></div>
            <div className="space-y-3">
              <div className="h-7 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-48 animate-pulse"></div>
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-72 animate-pulse"></div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="h-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl animate-pulse shadow-sm"></div>
            <div className="h-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl animate-pulse shadow-sm"></div>
            <div className="flex justify-center mt-8">
              <div className="h-12 w-48 bg-gradient-to-r from-blue-200/70 to-purple-200/70 rounded-lg animate-pulse shadow-sm"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-xl border border-white/30 overflow-hidden transform transition-all duration-500 hover:shadow-2xl relative">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 p-8 relative overflow-hidden">
        {/* Enhanced decorative elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-16 -mt-16 blur-md"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-12 -mb-12 blur-md"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/5 rounded-full transform -translate-y-1/2 blur-sm"></div>
        <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-white/5 rounded-full transform translate-y-1/2 blur-sm"></div>

        {/* Content */}
        <div className="relative flex items-center space-x-4">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg border border-white/30">
            <span className="text-white font-bold text-2xl">🔑</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">API Keys</h2>
            <p className="text-blue-100">
              Secure access to your image optimization API
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        {!apiKeys.hasKeys ? (
          <div className="text-center py-16">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full animate-ping opacity-10"></div>
              <div className="relative w-28 h-28 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full flex items-center justify-center mx-auto shadow-lg border border-blue-100/50 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-100/30 to-purple-100/30 blur-md"></div>
                <span className="text-4xl relative z-10">🔐</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              No API Keys Yet
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
              Generate your first set of API keys to start integrating with our
              powerful image optimization API
            </p>
            <button
              onClick={generateApiKeys}
              disabled={generating}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 text-white font-bold rounded-xl hover:from-blue-700 hover:via-violet-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-2xl relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/10 w-full transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-700 ease-out"></div>
              {generating ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span className="relative">Generating Keys...</span>
                </>
              ) : (
                <>
                  <span className="mr-2 relative">✨</span>
                  <span className="relative">Generate API Keys</span>
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Public Key */}
            <div className="space-y-3">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Public Key
                <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                  Safe to expose
                </span>
              </label>
              <div className="relative">
                <input
                  value={apiKeys.publicKey || ""}
                  readOnly
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={() =>
                    copyToClipboard(apiKeys.publicKey || "", "public")
                  }
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                    copyFeedback === "public"
                      ? "bg-green-100 text-green-700"
                      : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {copyFeedback === "public" ? (
                    <span className="flex items-center">
                      <span className="mr-1">✓</span> Copied
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <span className="mr-1">📋</span> Copy
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Private Key */}
            <div className="space-y-3">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                Private Key
                <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                  Keep secret
                </span>
              </label>
              <div className="relative">
                <input
                  type={showPrivateKey ? "text" : "password"}
                  value={apiKeys.privateKey || ""}
                  readOnly
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                  <button
                    onClick={() => setShowPrivateKey(!showPrivateKey)}
                    className="px-2 py-1.5 text-gray-500 hover:text-gray-700 transition-colors"
                    title={showPrivateKey ? "Hide" : "Show"}
                  >
                    {showPrivateKey ? "👁️" : "🔒"}
                  </button>
                  <button
                    onClick={() =>
                      copyToClipboard(apiKeys.privateKey || "", "private")
                    }
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                      copyFeedback === "private"
                        ? "bg-green-100 text-green-700"
                        : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {copyFeedback === "private" ? (
                      <span className="flex items-center">
                        <span className="mr-1">✓</span> Copied
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <span className="mr-1">📋</span> Copy
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Key Info */}
            {apiKeys.createdAt && (
              <div className="flex items-center justify-between text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
                <span>
                  Generated on: {new Date(apiKeys.createdAt).toLocaleString()}
                </span>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                  Active
                </span>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={generateApiKeys}
                disabled={generating}
                className="flex-1 inline-flex items-center justify-center px-4 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {generating ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Regenerating...
                  </>
                ) : (
                  <>
                    <span className="mr-2">🔄</span>
                    Regenerate Keys
                  </>
                )}
              </button>
            </div>

            {/* Warning */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start">
                <span className="text-amber-600 mr-3 mt-0.5">⚠️</span>
                <div>
                  <h4 className="text-sm font-medium text-amber-800 mb-1">
                    Security Notice
                  </h4>
                  <p className="text-sm text-amber-700">
                    Keep your private key secure and never share it publicly. If
                    you regenerate your keys, the old ones will stop working
                    immediately and any applications using them will need to be
                    updated.
                  </p>
                </div>
              </div>
            </div>

            {/* Usage Example */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                📖 Quick Start
              </h4>
              <div className="space-y-2 text-sm text-gray-600">
                <p>Use these keys to access the image optimization API:</p>
                <code className="block bg-white p-2 rounded border text-xs">
                  Authorization: Bearer{" "}
                  {apiKeys.privateKey
                    ? `${apiKeys.privateKey.substring(0, 20)}...`
                    : "your_private_key"}
                </code>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
