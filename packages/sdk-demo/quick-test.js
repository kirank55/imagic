// Quick connection test
const { ImagicClient } = require("@imagic/sdk");

async function quickTest() {
  console.log("🚀 Quick Connection Test...\n");

  const client = new ImagicClient({
    apiKey: "invalid-key",
    baseUrl: "http://localhost:3000",
  });

  try {
    console.log("🔌 Testing connection to API...");
    const isConnected = await client.testConnection();

    if (isConnected) {
      console.log("✅ API is responding!");
      console.log("📝 Server is ready for authenticated requests");
    } else {
      console.log("❌ No response from API");
    }
  } catch (error) {
    if (error.message.includes("not valid")) {
      console.log("✅ API is responding correctly!");
      console.log("🔑 Authentication is working as expected");
      console.log(
        "📝 To test uploads, get a valid API key from the profile page at:"
      );
      console.log("   http://localhost:3000/profile");
    } else {
      console.error("❌ Unexpected error:", error.message);
    }
  }
}

quickTest();
