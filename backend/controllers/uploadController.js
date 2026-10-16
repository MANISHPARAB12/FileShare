
const {
  generateShareCode,
  safeFilename,
  getResourceType,
} = require("../utils/fileUtils");

const { uploadBuffer } = require("../services/cloudinaryService");

// Temporary in-memory storage for uploaded batches.
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

    const shareCode = generateShareCode(sharedFiles);

    const frontendUrl = (
      process.env.FRONTEND_URL || "http://localhost:5173"
    ).replace(/\/+$/, "");

    const files = [];

    // Upload each file to Cloudinary.
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

    // Store all files under the same PIN.
    sharedFiles.set(shareCode, batch);

    return res.status(201).json({
      success: true,
      message: "Files uploaded successfully.",
      shareCode: batch.shareCode,
      shareUrl: batch.shareUrl,
      fileCount: batch.files.length,

      // Return download URLs matching uploadRoutes.js.
      files: batch.files.map((file, index) => ({
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
  const batch = sharedFiles.get(req.params.code);

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
function findSharedFile(code, index = 0) {
  const batch = sharedFiles.get(code);

  if (!batch) {
    return null;
  }

  return batch.files[index] || null;
}

module.exports = {
  uploadFile,
  getSharedFile,
  findSharedFile,
};
