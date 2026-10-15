
const crypto = require("crypto");
const { uploadBuffer } = require("../services/cloudinaryService");
const {
  safeFilename,
  getResourceType,
} = require("../utils/fileUtils");

// Demo-only storage. Share codes disappear when the server restarts.
const sharedFiles = new Map();

async function uploadFile(req, res, next) {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please select at least one file.",
      });
    }

    const files = [];

    for (const file of req.files) {
      const originalName = safeFilename(file.originalname);
      const resourceType = getResourceType(file);

      const result = await uploadBuffer(
        { ...file, originalname: originalName },
        resourceType
      );

      let shareCode;

      do {
        shareCode = crypto.randomBytes(3).toString("hex");
      } while (sharedFiles.has(shareCode));

      const fileData = {
        id: crypto.randomUUID(),
        originalName,
        size: file.size,
        type: file.mimetype || "application/octet-stream",
        resourceType,
        url: result.secure_url,
        publicId: result.public_id,
        shareCode,
      };

      sharedFiles.set(shareCode, fileData);

      const frontendUrl = (
        process.env.FRONTEND_URL || "http://localhost:5173"
      ).replace(/\/+$/, "");

      files.push({
        ...fileData,
        shareUrl: `${frontendUrl}/share/${shareCode}`,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Files uploaded successfully.",
      files,
    });
  } catch (error) {
    next(error);
  }
}

function getSharedFile(req, res) {
  const file = sharedFiles.get(req.params.code);

  if (!file) {
    return res.status(404).json({
      success: false,
      message:
        "File not found. Upload the file again if the backend has restarted.",
    });
  }

  return res.json({
    success: true,
    file: {
      originalName: file.originalName,
      size: file.size,
      type: file.type,
      shareCode: file.shareCode,
    },
  });
}

function findSharedFile(code) {
  return sharedFiles.get(code);
}

module.exports = {
  uploadFile,
  getSharedFile,
  findSharedFile,
};
