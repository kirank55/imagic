import { getCurrentUser } from "auth/currentUser";
import ApiKeyManager from "../../components/ApiKeyManager";

export default async function Profile() {
  const currentUser = await getCurrentUser({ redirectIfNotFound: true });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: "2rem",
          }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome, {currentUser.username}!
          </h1>
          <p className="text-gray-600">
            Manage your account settings and API keys
          </p>
        </div>

        <div className="space-y-6">
          <ApiKeyManager />
        </div>
      </div>
    </div>
  );
}
