
const { Readable } = require("stream");
const { pipeline } = require("stream/promises");
const { findSharedFile } = require("../controller/upload.controller");

async function downloadFile(req, res, next) {
  try {
    const file = findSharedFile(req.params.code);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found. Please upload the file again.",
      });
    }

    if (!file.url) {
      return res.status(500).json({
        success: false,
        message: "Cloudinary file URL is missing.",
      });
    }

    const originalName = String(file.originalName || "download")
      .replace(/[\r\n\\/]/g, "_");

    const asciiName = originalName
      .replace(/[^\x20-\x7E]/g, "_")
      .replace(/["\\]/g, "_");

    const encodedName = encodeURIComponent(originalName);

    // Download the file from Cloudinary.
    const cloudinaryResponse = await fetch(file.url);

    if (!cloudinaryResponse.ok || !cloudinaryResponse.body) {
      return res.status(502).json({
        success: false,
        message: "Failed to retrieve the file from Cloudinary.",
      });
    }

    // Force the original filename in the browser's Save As dialog.
    res.status(200);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${asciiName}"; filename*=UTF-8''${encodedName}`
    );

    res.setHeader(
      "Content-Type",
      file.type || "application/octet-stream"
    );

    const contentLength =
      cloudinaryResponse.headers.get("content-length");

    if (contentLength) {
      res.setHeader("Content-Length", contentLength);
    }

    await pipeline(
      Readable.fromWeb(cloudinaryResponse.body),
      res
    );
  } catch (error) {
    if (res.headersSent) {
      res.destroy(error);
      return;
    }

    next(error);
  }
}

module.exports = { downloadFile };
