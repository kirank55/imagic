"use client";
import Link from "next/link";

const ToolsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50">
      {/* Hero Section */}
      <section className="py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-black mb-6">Image Tools</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Transform and optimize your images with our powerful suite of
              tools. Built with simplicity and performance in mind.
            </p>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {/* Upload Tool */}
            <Link
              href="/tools/upload"
              className="group bg-white p-8 rounded-2xl border border-gray-200 hover:border-black transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-black mb-3">
                Upload & Optimize
              </h2>
              <p className="text-gray-600 mb-4">
                Upload and automatically optimize your images. Supports JPEG,
                PNG, and WebP formats with intelligent compression.
              </p>
              <div className="flex items-center text-black font-medium group-hover:translate-x-1 transition-transform">
                Try now
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Link>

            {/* My Images */}
            <Link
              href="/tools/my-images"
              className="group bg-white p-8 rounded-2xl border border-gray-200 hover:border-black transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-black mb-3">My Images</h2>
              <p className="text-gray-600 mb-4">
                View, manage, and further optimize your uploaded images. Access
                your image history and optimization settings.
              </p>
              <div className="flex items-center text-black font-medium group-hover:translate-x-1 transition-transform">
                View gallery
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Link>

            {/* API Integration */}
            {/* <Link
              href="/tools/api"
              className="group bg-white p-8 rounded-2xl border border-gray-200 hover:border-black transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-black mb-3">API Access</h2>
              <p className="text-gray-600 mb-4">
                Generate API keys and integrate image optimization directly into
                your applications with our SDK.
              </p>
              <div className="flex items-center text-black font-medium group-hover:translate-x-1 transition-transform">
                View documentation
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Link> */}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ToolsPage;
