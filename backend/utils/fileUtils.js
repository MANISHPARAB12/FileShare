
const crypto = require("crypto");
const path = require("path");

function generateShareCode() {
  return crypto.randomBytes(3).toString("hex").toUpperCase();
}

function safeFilename(input) {
  const filename = path.basename(String(input || "download"));

  if (path.extname(filename).toLowerCase() === ".exe") {
    throw new Error("EXE files are not allowed.");
  }

  return filename.replace(/[\\/\r\n\0]/g, "_") || "download";
}

function getResourceType(file) {
  const name = String(file.originalname || "").toLowerCase();

  if (path.extname(name) === ".exe") {
    throw new Error("EXE files are not allowed.");
  }

  if (file.mimetype?.startsWith("image/")) {
    return "image";
  }

  if (file.mimetype?.startsWith("video/")) {
    return "video";
  }

  return "raw";
}

module.exports = {
  generateShareCode,
  safeFilename,
  getResourceType,
};
