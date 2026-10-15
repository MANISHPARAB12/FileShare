
require("dotenv").config({
  path: require("path").join(__dirname, ".env.production"),
});

const express = require("express");
const cors = require("cors");
const uploadRoutes = require("./routes/uploadRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

const allowedOrigin = (process.env.FRONTEND_URL || "").replace(/\/+$/, "");

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

app.get("/", (_req, res) => {
  res.json({ message: "ShareBox API is running" });
});

app.use("/api", uploadRoutes);
app.use(errorHandler);

const PORT = Number(process.env.PORT) || 8956;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`ShareBox API listening on port ${PORT}`);
});
