
require("dotenv").config({
  path: require("path").join(__dirname, ".env.production"),
});

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const uploadRoutes = require("./routes/uploadRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

const allowedOrigin = (
  process.env.FRONTEND_URL || ""
).replace(/\/+$/, "");

app.use(
  cors({
    origin(origin, callback) {
      if (
        !origin ||
        !allowedOrigin ||
        origin === allowedOrigin ||
        (process.env.NODE_ENV !== "production" &&
          /^http:\/\/localhost:\d+$/.test(origin))
      ) {
        return callback(null, true);
      }

      return callback(new Error("Origin is not allowed by CORS."));
    },
  })
);

app.use(express.json({ limit: "1mb" }));

// Health check
app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "File Sharing API is running",
  });
});

// API routes
app.use("/api", uploadRoutes);

// Error handler
app.use(errorHandler);

const PORT = Number(process.env.PORT) || 8956;

async function startServer() {
  try {
    // 1. Connect MongoDB
    await connectDB();

    // 2. Start automatic cleanup
    require("./utils/cleanupExpiredFiles");

    // 3. Start Express
    app.listen(PORT, "0.0.0.0", () => {
      console.log("--------------------------------");
      console.log("File Sharing Backend Started");
      console.log("MongoDB: Connected");
      console.log("Cloudinary cleanup: Enabled");
      console.log(`Port: ${PORT}`);
      console.log("--------------------------------");
    });

  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
}

startServer();
