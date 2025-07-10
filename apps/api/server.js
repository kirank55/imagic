require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3001;

// Add CORS middleware for all routes
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
    return;
  }

  next();
});

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

// Import and use the image optimization route
const optimizeRoute = require("./routes/optimize");
app.use(optimizeRoute);

app.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}`);
});
