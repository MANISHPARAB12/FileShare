const { generateShareCode, safeFilename, getResourceType } = require('../utils/fileUtils');
const { uploadBuffer } = require('../services/cloudinaryService');

// Temporary demo storage. Replace with a MongoDB model for durable share links.
const sharedFiles = new Map();

async function uploadFile(req, res, next) {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Please select a file.' });
  }

  try {
    const originalName = safeFilename(req.file.originalname);
    const resourceType = getResourceType(req.file);
    const result = await uploadBuffer({ ...req.file, originalname: originalName }, resourceType);
    const shareCode = generateShareCode(sharedFiles);
    const frontendUrl = (process.env.FRONTEND_URL || '').replace(/\/+$/, '');

    const fileData = {
      originalName,
      size: req.file.size,
      type: req.file.mimetype || 'application/octet-stream',
      resourceType,
      url: result.secure_url,
      publicId: result.public_id,
      shareCode,
      shareUrl: frontendUrl ? `${frontendUrl}/share/${shareCode}` : null,
    };

    sharedFiles.set(shareCode, fileData);
    return res.status(201).json({
      success: true,
      message: 'File uploaded successfully.',
      file: { ...fileData, downloadUrl: `/api/download/${encodeURIComponent(shareCode)}` },
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
      message: 'File not found. This demo stores share codes in memory; the server may have restarted.',
    });
  }
  return res.json({ success: true, file });
}

function findSharedFile(code) {
  return sharedFiles.get(code);
}

module.exports = { uploadFile, getSharedFile, findSharedFile };
