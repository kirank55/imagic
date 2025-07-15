import { getCurrentUser } from "auth/currentUser";
import ApiKeyManager from "../../components/ApiKeyManager";
import Link from "next/link";

export default async function Profile() {
  const currentUser = await getCurrentUser({
    redirectIfNotFound: true,
    withFullUser: true,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Main gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-200/30 via-violet-100/30 to-purple-200/30 opacity-70"></div>

        {/* Enhanced mesh gradients with blur */}
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-pink-300/20 via-blue-300/20 to-transparent rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-indigo-300/20 via-purple-300/20 to-transparent rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/4"></div>

        {/* Additional decorative elements */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-tr from-blue-200/10 to-transparent rounded-full blur-2xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-bl from-purple-200/10 to-transparent rounded-full blur-2xl"></div>
      </div>

      {/* Header Section */}
      <div className="relative bg-white/40 backdrop-blur-2xl shadow-xl border-b border-white/30">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100/20 to-purple-100/20 opacity-70"></div>
        <div className="max-w-7xl mx-auto px-6 py-10 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="absolute -inset-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse opacity-50 blur-md"></div>
                <div className="relative inline-flex items-center justify-center w-28 h-28 bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 rounded-full shadow-2xl">
                  <span className="text-4xl font-bold text-white drop-shadow-lg">
                    {currentUser.username.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="space-y-2 text-center md:text-left">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent drop-shadow-sm">
                  Welcome, {currentUser.username}!
                </h1>
                <p className="text-lg text-gray-700">{currentUser.email}</p>
                <div className="flex items-center justify-center md:justify-start space-x-3 pt-1">
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full border border-green-200 shadow-sm">
                    Online
                  </span>
                  <span className="text-gray-500 text-sm">
                    Joined on: {new Date().toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button className="w-full sm:w-auto px-6 py-3 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl font-semibold text-gray-800 hover:bg-white transition-all duration-300 shadow-md hover:shadow-xl hover:scale-105">
                Edit Profile
              </button>
              <button className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:via-violet-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-xl hover:scale-105">
                Upgrade Plan
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 transform hover:scale-[1.01] transition-all duration-500">
            <ApiKeyManager key="api-key-manager-1" />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* User Details */}
            <div className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-xl border border-white/30 p-8 transform transition-all duration-500 hover:bg-white/70 hover:shadow-2xl relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/30 to-transparent opacity-70"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-200/20 rounded-full -mr-16 -mt-16 blur-xl"></div>

              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                    <span className="text-white text-xl">👤</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">
                    User Details
                  </h3>
                </div>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between items-center p-2 rounded-lg hover:bg-white/50 transition-all duration-300">
                    <span className="text-gray-600 font-medium">Username:</span>
                    <span className="font-semibold text-gray-900 bg-white/70 px-3 py-1 rounded-md shadow-sm">
                      {currentUser.username}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg hover:bg-white/50 transition-all duration-300">
                    <span className="text-gray-600 font-medium">Email:</span>
                    <span className="font-semibold text-gray-900 bg-white/70 px-3 py-1 rounded-md shadow-sm">
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

            {/* Quick Stats */}
            <div className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-xl border border-white/30 p-8 transform transition-all duration-500 hover:bg-white/70 hover:shadow-2xl relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 to-transparent opacity-70"></div>
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-emerald-200/20 rounded-full -mr-20 -mb-20 blur-xl"></div>

              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                    <span className="text-white text-xl">📊</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Quick Stats
                  </h3>
                </div>
                <div className="space-y-6">
                  <div className="group">
                    <div className="flex justify-between text-sm mb-2 items-center">
                      <span className="font-medium text-gray-700 group-hover:text-blue-700 transition-colors duration-300">
                        Images Processed
                      </span>
                      <span className="text-blue-600 font-bold px-3 py-1 bg-blue-50 rounded-full text-xs shadow-sm group-hover:bg-blue-100 transition-colors duration-300">
                        0 / 1000
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3 shadow-inner overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transform transition-all duration-500 group-hover:scale-x-110 origin-left"
                        style={{ width: "5%" }}
                      ></div>
                    </div>
                  </div>
                  <div className="group">
                    <div className="flex justify-between text-sm mb-2 items-center">
                      <span className="font-medium text-gray-700 group-hover:text-purple-700 transition-colors duration-300">
                        Storage Used
                      </span>
                      <span className="text-purple-600 font-bold px-3 py-1 bg-purple-50 rounded-full text-xs shadow-sm group-hover:bg-purple-100 transition-colors duration-300">
                        0 / 5 GB
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3 shadow-inner overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-600 h-3 rounded-full transform transition-all duration-500 group-hover:scale-x-110 origin-left"
                        style={{ width: "2%" }}
                      ></div>
                    </div>
                  </div>
                  <div className="group">
                    <div className="flex justify-between text-sm mb-2 items-center">
                      <span className="font-medium text-gray-700 group-hover:text-green-700 transition-colors duration-300">
                        API Calls
                      </span>
                      <span className="text-green-600 font-bold px-3 py-1 bg-green-50 rounded-full text-xs shadow-sm group-hover:bg-green-100 transition-colors duration-300">
                        0 / 10,000
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3 shadow-inner overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transform transition-all duration-500 group-hover:scale-x-110 origin-left"
                        style={{ width: "1%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-xl border border-white/30 p-8 transform transition-all duration-500 hover:bg-white/70 hover:shadow-2xl relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-100/30 to-transparent opacity-70"></div>
              <div className="absolute top-0 left-0 w-40 h-40 bg-orange-200/20 rounded-full -ml-20 -mt-20 blur-xl"></div>

              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                    <span className="text-white text-xl">⚡</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Quick Actions
                  </h3>
                </div>
                <div className="space-y-4">
                  <Link
                    href="/tools/upload"
                    className="flex items-center p-4 rounded-xl bg-gradient-to-r from-blue-600 to-violet-700 text-white hover:from-blue-700 hover:to-violet-800 transition-all duration-500 transform hover:scale-[1.02] hover:shadow-xl group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-white/10 w-full transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-700 ease-out"></div>
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mr-4 shadow-lg group-hover:bg-white/30 transition-all duration-300">
                      <span className="text-2xl">📤</span>
                    </div>
                    <div>
                      <div className="font-bold text-lg">Upload Images</div>
                      <div className="text-blue-100 text-sm">
                        Add new images to optimize
                      </div>
                    </div>
                  </Link>
                  <Link
                    href="/tools/my-images"
                    className="flex items-center p-4 rounded-xl bg-gradient-to-r from-green-600 to-emerald-700 text-white hover:from-green-700 hover:to-emerald-800 transition-all duration-500 transform hover:scale-[1.02] hover:shadow-xl group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-white/10 w-full transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-700 ease-out"></div>
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mr-4 shadow-lg group-hover:bg-white/30 transition-all duration-300">
                      <span className="text-2xl">🖼️</span>
                    </div>
                    <div>
                      <div className="font-bold text-lg">My Images</div>
                      <div className="text-green-100 text-sm">
                        View and manage images
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
