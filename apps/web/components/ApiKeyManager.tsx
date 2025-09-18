"use client";

import { useState, useEffect } from "react";

interface ApiKeys {
  publicKey: string | null;
  privateKey: string | null;
  createdAt: string | null;
  hasKeys: boolean;
}

import { UserDetailsForCookieType } from "../types/userTypes";

interface ApiKeyManagerProps {
  currentUser: UserDetailsForCookieType;
}

export default function ApiKeyManager({ currentUser }: ApiKeyManagerProps) {
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
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 overflow-hidden">
        <div className="animate-pulse">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-16 h-16 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="space-y-3">
              <div className="h-7 bg-gray-200 rounded-lg w-48 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-72 animate-pulse"></div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="h-16 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="h-16 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="flex justify-center mt-8">
              <div className="h-12 w-48 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-black p-8 relative overflow-hidden">
        {/* Content */}
        <div className="relative flex items-center space-x-4">
          <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">API Keys</h2>
            <p className="text-gray-300">
              Secure access to your image optimization API
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        {!apiKeys.hasKeys ? (
          <div className="text-center py-16">
            <div className="mb-8">
              <div className="w-28 h-28 bg-black rounded-lg flex items-center justify-center mx-auto">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-black mb-3">
              No API Keys Yet
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
              Generate your first set of API keys to start integrating with our
              powerful image optimization API
            </p>
            <button
              onClick={generateApiKeys}
              disabled={generating}
              className="inline-flex items-center px-8 py-4 bg-black text-white font-bold rounded-xl hover:from-blue-700 hover:via-violet-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-2xl relative overflow-hidden group"
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
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Copied
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                        Copy
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
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Regenerate Keys
                  </>
                )}
              </button>
            </div>

            {/* Warning */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-amber-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
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
              <div className="flex items-center text-sm font-medium text-gray-900 mb-2">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Quick Start
              </div>
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
