
const { Readable } = require("stream");
const { pipeline } = require("stream/promises");

// Must reference the same uploadController module.
const { findSharedFile } = require("./uploadController");

async function downloadFile(req, res, next) {
  try {
    const code = req.params.code;

    const index =
      req.params.index === undefined
        ? 0
        : Number.parseInt(req.params.index, 10);

    if (!Number.isInteger(index) || index < 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid file index.",
      });
    }

    const file = findSharedFile(code, index);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found. Please upload the files again.",
      });
    }

    if (!file.url) {
      return res.status(500).json({
        success: false,
        message: "The file URL is missing.",
      });
    }

    const originalName = String(
      file.originalName || "download"
    ).replace(/[\/\\\r\n\0]/g, "_");

    const asciiName = originalName
      .replace(/[^\x20-\x7E]/g, "_")
      .replace(/["\\]/g, "_");

    const encodedName = encodeURIComponent(originalName);

    const cloudinaryResponse = await fetch(file.url);

    if (!cloudinaryResponse.ok || !cloudinaryResponse.body) {
      console.error(
        "Cloudinary download failed:",
        cloudinaryResponse.status,
        cloudinaryResponse.statusText
      );

      return res.status(502).json({
        success: false,
        message: "Unable to retrieve the file from Cloudinary.",
      });
    }

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
    console.error("Download controller error:", error);

    if (res.headersSent) {
      res.destroy(error);
      return;
    }

    next(error);
  }
}

module.exports = { downloadFile };
