import { getCurrentUser } from "auth/currentUser";
import ApiKeyManager from "../../components/ApiKeyManager";
import Link from "next/link";

export default async function Profile() {
  const currentUser = await getCurrentUser({
    redirectIfNotFound: true,
    withFullUser: true,
  });

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Header Section */}
      <div className="relative bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-10 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="relative inline-flex items-center justify-center w-28 h-28 bg-black rounded-full shadow-lg">
                  <span className="text-4xl font-bold text-white">
                    {currentUser.username.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="space-y-2 text-center md:text-left">
                <h1 className="text-4xl font-bold text-black">
                  Welcome, {currentUser.username}!
                </h1>
                <p className="text-lg text-gray-600">{currentUser.email}</p>
                {/* <div className="flex items-center justify-center md:justify-start space-x-3 pt-1">
                  <span className="px-3 py-1 bg-black text-white text-xs font-bold rounded-full">
                    Online
                  </span>
                  <span className="text-gray-500 text-sm">
                    Joined on: {new Date().toLocaleDateString()}
                  </span>
                </div> */}
              </div>
            </div>
            {/* <div className="flex flex-col sm:flex-row items-center gap-3">
              <Link
                href="/tools"
                className="w-full sm:w-auto px-6 py-3 bg-black text-white rounded-md font-medium hover:bg-gray-800 transition-all duration-300"
              >
                Try Image Tools
              </Link>
              <Link
                href="/api/logout"
                className="w-full sm:w-auto px-6 py-3 bg-white text-black border border-gray-200 rounded-md font-medium hover:bg-gray-50 transition-all duration-300"
              >
                Sign Out
              </Link>
            </div> */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Sidebar */}
          <div className="space-y-6">
            {/* User Details */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mr-4">
                    <span className="text-white text-xl">👤</span>
                  </div>
                  <h3 className="text-xl font-bold text-black">User Details</h3>
                </div>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50 transition-all duration-300">
                    <span className="text-gray-600 font-medium">Username:</span>
                    <span className="font-semibold text-black bg-white px-3 py-1 rounded-md border border-gray-200">
                      {currentUser.username}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50 transition-all duration-300">
                    <span className="text-gray-600 font-medium">Email:</span>
                    <span className="font-semibold text-black bg-white px-3 py-1 rounded-md border border-gray-200">
                      {currentUser.email}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg hover:bg-white/50 transition-all duration-300">
                    <span className="text-gray-600 font-medium">Joined:</span>
                    <span className="font-semibold text-gray-900 bg-white/70 px-3 py-1 rounded-md shadow-sm">
                      {new Date().toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}

            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
              <div className="relative z-10">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mr-4">
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
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-black">
                    Quick Actions
                  </h3>
                </div>
                <div className="space-y-4">
                  <Link
                    href="/tools/upload"
                    className="flex items-center p-4 rounded-md bg-black text-white hover:bg-gray-800 transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mr-4">
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
                    <div>
                      <div className="font-bold text-lg">Upload Images</div>
                      <div className="text-gray-300 text-sm">
                        Add new images to optimize
                      </div>
                    </div>
                  </Link>
                  <Link
                    href="/tools/my-images"
                    className="flex items-center p-4 rounded-md bg-white text-black border border-gray-200 hover:bg-gray-50 transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 bg-black/5 rounded-lg flex items-center justify-center mr-4">
                      <svg
                        className="w-6 h-6 text-black"
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
                    <div>
                      <div className="font-bold text-lg">My Images</div>
                      <div className="text-gray-600 text-sm">
                        View and manage images
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2 transform hover:scale-[1.01] transition-all duration-500">
            <ApiKeyManager currentUser={currentUser} />
          </div>
        </div>
      </div>
    </div>
  );
}
