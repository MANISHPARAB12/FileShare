
const { Readable } = require("stream");
const { pipeline } = require("stream/promises");

const File = require("../models/File");

async function downloadFile(req, res, next) {
  try {
    const code = String(req.params.code || "")
      .trim()
      .toUpperCase();

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

    // Find active file in MongoDB
    const file = await File.findOne({
      shareCode: code,
      fileIndex: index,
      expiresAt: { $gt: new Date() },
    });

    if (!file) {
      return res.status(410).json({
        success: false,
        message: "File not found or sharing link has expired.",
      });
    }

    if (!file.fileUrl) {
      return res.status(500).json({
        success: false,
        message: "File URL is missing.",
      });
    }

    const originalName = String(
      file.fileName || "download"
    ).replace(/[\/\\\r\n\0]/g, "_");

    const asciiName = originalName
      .replace(/[^\x20-\x7E]/g, "_")
      .replace(/["\\]/g, "_");

    const encodedName = encodeURIComponent(originalName);

    const cloudinaryResponse = await fetch(file.fileUrl);

    if (!cloudinaryResponse.ok || !cloudinaryResponse.body) {
      return res.status(502).json({
        success: false,
        message: "Unable to retrieve file from Cloudinary.",
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
    console.error("Download error:", error.message);

    if (res.headersSent) {
      res.destroy(error);
      return;
    }

    next(error);
  }
}

module.exports = {
  downloadFile,
};
