
const crypto = require("crypto");

const {
  generateShareCode,
  safeFilename,
  getResourceType,
} = require("../utils/fileUtils");

const { uploadBuffer } = require("../services/cloudinaryService");

// Temporary storage shared by uploadController and downloadController.
// Share codes are lost when the backend restarts.
const sharedFiles = new Map();

async function uploadFile(req, res, next) {
  try {
    const uploadedFiles = req.files;

    if (!uploadedFiles || uploadedFiles.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please select at least one file.",
      });
    }

    if (uploadedFiles.length > 10) {
      return res.status(400).json({
        success: false,
        message: "You can upload a maximum of 10 files.",
      });
    }

    // Generate ONE unique PIN for the entire upload batch.
    const shareCode = generateShareCode(sharedFiles).toUpperCase();

    const frontendUrl = (
      process.env.FRONTEND_URL || "http://localhost:5173"
    ).replace(/\/+$/, "");

    const files = [];

    // Upload every selected file to Cloudinary.
    for (const uploadedFile of uploadedFiles) {
      const originalName = safeFilename(uploadedFile.originalname);
      const resourceType = getResourceType(uploadedFile);

      const result = await uploadBuffer(
        {
          ...uploadedFile,
          originalname: originalName,
        },
        resourceType
      );

      files.push({
        id: crypto.randomUUID(),
        originalName,
        size: uploadedFile.size,
        type: uploadedFile.mimetype || "application/octet-stream",
        resourceType,
        url: result.secure_url,
        publicId: result.public_id,
      });
    }

    const batch = {
      shareCode,
      shareUrl: `${frontendUrl}/download?pin=${encodeURIComponent(
        shareCode
      )}`,
      files,
      createdAt: new Date().toISOString(),
    };

    // Save the complete batch under one PIN.
    sharedFiles.set(shareCode, batch);

    return res.status(201).json({
      success: true,
      message: "Files uploaded successfully.",
      shareCode: batch.shareCode,
      shareUrl: batch.shareUrl,
      fileCount: batch.files.length,
      files: batch.files.map((file, index) => ({
        id: file.id,
        originalName: file.originalName,
        size: file.size,
        type: file.type,
        downloadUrl: `/api/files/download/${encodeURIComponent(
          batch.shareCode
        )}/${index}`,
      })),
    });
  } catch (error) {
    next(error);
  }
}

function getSharedFile(req, res) {
  const code = String(req.params.code || "")
    .trim()
    .toUpperCase();

  const batch = sharedFiles.get(code);

  if (!batch) {
    return res.status(404).json({
      success: false,
      message:
        "Files not found. The link may have expired or the server may have restarted.",
    });
  }

  return res.status(200).json({
    success: true,
    shareCode: batch.shareCode,
    shareUrl: batch.shareUrl,
    fileCount: batch.files.length,
    files: batch.files.map((file, index) => ({
      id: file.id,
      originalName: file.originalName,
      size: file.size,
      type: file.type,
      downloadUrl: `/api/files/download/${encodeURIComponent(
        batch.shareCode
      )}/${index}`,
    })),
  });
}

// Used by downloadController.js.
// The index identifies a file within the batch.
function findSharedFile(code, index = 0) {
  const normalizedCode = String(code || "")
    .trim()
    .toUpperCase();

  const batch = sharedFiles.get(normalizedCode);

  if (!batch || !Number.isInteger(index) || index < 0) {
    return null;
  }

  return batch.files[index] || null;
}

module.exports = {
  uploadFile,
  getSharedFile,
  findSharedFile,
};