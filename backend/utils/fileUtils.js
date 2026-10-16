
const crypto = require("crypto");
const path = require("path");

function generateShareCode(existingFiles) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code;

  do {
    code = Array.from(crypto.randomBytes(6))
      .map((byte) => chars[byte % chars.length])
      .join("");
  } while (existingFiles.has(code));

  return code;
}

function safeFilename(input) {
  return (
    path
      .basename(String(input || "download"))
      .replace(/[\\/\r\n\0]/g, "_") || "download"
  );
}

function getResourceType(file) {
  const name = String(file.originalname || "").toLowerCase();

  if (
    file.mimetype?.startsWith("image/") &&
    !name.endsWith(".pdf")
  ) {
    return "image";
  }

  if (file.mimetype?.startsWith("video/")) {
    return "video";
  }

  return "raw";
}

function contentDisposition(filename) {
  const safe = safeFilename(filename);

  const ascii = safe
    .replace(/[^\x20-\x7E]/g, "_")
    .replace(/["\\]/g, "_");

  return `attachment; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(safe)}`;
}

module.exports = {
  generateShareCode,
  safeFilename,
  getResourceType,
  contentDisposition,
};
