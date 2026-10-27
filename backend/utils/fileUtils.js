const crypto = require("crypto");
const path = require("path");

function generateShareCode(existingFiles) {
  let code;

  do {
    code = crypto.randomBytes(3).toString("hex").toUpperCase();
  } while (existingFiles.has(code));

  return code;
}

function safeFilename(input) {
  const filename = path.basename(String(input || "download"));

  if (path.extname(filename).toLowerCase() === ".exe") {
    throw new Error("EXE files are not allowed to be uploaded.");
  }

  return filename.replace(/[\\/\r\n\0]/g, "_") || "download";
}

function getResourceType(file) {
  const name = String(file.originalname || "").toLowerCase();

  if (path.extname(name) === ".exe") {
    throw new Error("EXE files are not allowed to be uploaded.");
  }

  if (file.mimetype?.startsWith("image/") && !name.endsWith(".pdf")) {
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
