
const crypto = require("crypto");
const path = require("path");

const File = require("../models/File");

const {
  generateShareCode,
  safeFilename,
  getResourceType,
} = require("../utils/fileUtils");

const {
  uploadBuffer,
  deleteFromCloudinary,
} = require("../services/cloudinaryService");

// Testing: 1 minute
// Production: 15 * 60 * 1000
const FILE_EXPIRY_TIME = 1 * 60 * 1000;

const MAX_FILES = 10;

// Generate unique PIN
async function createUniqueShareCode() {
  for (let attempt = 0; attempt < 20; attempt++) {
    const code = generateShareCode();

    const existing = await File.exists({
      shareCode: code,
    });

    if (!existing) {
      return code;
    }
  }

  throw new Error("Unable to generate unique share code.");
}

// Upload files
async function uploadFile(req, res, next) {
  console.log("\n========== UPLOAD REQUEST RECEIVED ==========");

  const uploadedCloudinaryFiles = [];
  let shareCode;

  try {
    console.log("MongoDB ready state:", File.db.readyState);
    console.log("Database:", File.db.name);
    console.log("Collection:", File.collection.name);

    const uploadedFiles = req.files;

    console.log("Files received:", uploadedFiles?.length || 0);

    if (!uploadedFiles || uploadedFiles.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please select at least one file.",
      });
    }

    if (uploadedFiles.length > MAX_FILES) {
      return res.status(400).json({
        success: false,
        message: "Maximum 10 files allowed.",
      });
    }

    // Reject EXE files
    const executableFile = uploadedFiles.find(
      (file) =>
        path.extname(file.originalname || "").toLowerCase() === ".exe"
    );

    if (executableFile) {
      return res.status(400).json({
        success: false,
        message: "EXE files are not allowed.",
      });
    }

    // Generate PIN
    shareCode = await createUniqueShareCode();

    console.log("Generated PIN:", shareCode);

    const frontendUrl = (
      process.env.FRONTEND_URL || "http://localhost:5173"
    ).replace(/\/+$/, "");

    const createdAt = new Date();

    const expiresAt = new Date(
      createdAt.getTime() + FILE_EXPIRY_TIME
    );

    console.log("Created at:", createdAt);
    console.log("Expires at:", expiresAt);

    const fileRecords = [];

    // Upload files to Cloudinary
    for (let index = 0; index < uploadedFiles.length; index++) {
      const uploadedFile = uploadedFiles[index];

      const originalName = safeFilename(
        uploadedFile.originalname
      );

      const resourceType = getResourceType({
        ...uploadedFile,
        originalname: originalName,
      });

      const uniqueId = crypto.randomUUID();

      const publicId =
        resourceType === "raw"
          ? `${uniqueId}${path.extname(originalName)}`
          : uniqueId;

      console.log("Uploading to Cloudinary:", originalName);

      const result = await uploadBuffer(
        {
          ...uploadedFile,
          originalname: originalName,
        },
        resourceType,
        publicId
      );

      console.log("Cloudinary upload successful:", result.public_id);

      uploadedCloudinaryFiles.push({
        publicId: result.public_id,
        resourceType,
        originalName,
      });

      fileRecords.push({
        fileName: originalName,
        fileUrl: result.secure_url,
        publicId: result.public_id,
        resourceType,
        shareCode,
        fileIndex: index,
        size: uploadedFile.size,
        type: uploadedFile.mimetype || "application/octet-stream",
        expiresAt,
      });
    }

    // Save records in MongoDB
    console.log("\nSaving files to MongoDB...");
    console.log("Records to insert:", fileRecords.length);

    const savedFiles = await File.insertMany(fileRecords);

    console.log("MongoDB insertion successful!");
    console.log("Saved documents:", savedFiles.length);

    // Verify records
    const verifiedFiles = await File.find({
      shareCode,
    }).lean();

    console.log("Verified documents:", verifiedFiles.length);

    if (verifiedFiles.length !== fileRecords.length) {
      throw new Error("MongoDB verification failed.");
    }

    console.log("PIN:", shareCode);
    console.log("Expiry:", expiresAt);

    const shareUrl =
      `${frontendUrl}/download?pin=${encodeURIComponent(shareCode)}`;

    console.log("========== UPLOAD COMPLETED ==========\n");

    return res.status(201).json({
      success: true,
      message: "Files uploaded successfully.",
      shareCode,
      shareUrl,
      fileCount: savedFiles.length,
      expiresAt: expiresAt.toISOString(),

      files: savedFiles.map((file) => ({
        id: String(file.fileIndex),
        originalName: file.fileName,
        size: file.size,
        type: file.type,
        downloadUrl:
          `/api/files/download/${encodeURIComponent(shareCode)}/${file.fileIndex}`,
      })),
    });

  } catch (error) {
    console.error("\n========== UPLOAD FAILED ==========");
    console.error("Error:", error.message);
    console.error("Stack:", error.stack);

    // Roll back MongoDB records
    if (shareCode) {
      try {
        await File.deleteMany({ shareCode });
        console.log("MongoDB rollback completed.");
      } catch (dbError) {
        console.error("MongoDB rollback failed:", dbError.message);
      }
    }

    // Roll back Cloudinary files
    for (const file of uploadedCloudinaryFiles) {
      try {
        await deleteFromCloudinary(
          file.publicId,
          file.resourceType
        );

        console.log("Cloudinary rollback:", file.originalName);

      } catch (deleteError) {
        console.error(
          "Cloudinary rollback failed:",
          deleteError.message
        );
      }
    }

    next(error);
  }
}

// Get shared files
async function getSharedFile(req, res, next) {
  try {
    const code = String(req.params.code || "")
      .trim()
      .toUpperCase();

    const files = await File.find({
      shareCode: code,
      expiresAt: { $gt: new Date() },
    }).sort({ fileIndex: 1 });

    if (!files.length) {
      return res.status(410).json({
        success: false,
        message: "Files not found or sharing link expired.",
      });
    }

    const frontendUrl = (
      process.env.FRONTEND_URL || "http://localhost:5173"
    ).replace(/\/+$/, "");

    return res.status(200).json({
      success: true,
      shareCode: code,
      shareUrl:
        `${frontendUrl}/download?pin=${encodeURIComponent(code)}`,
      fileCount: files.length,
      expiresAt: files[0].expiresAt,

      files: files.map((file) => ({
        id: String(file.fileIndex),
        originalName: file.fileName,
        size: file.size,
        type: file.type,
        downloadUrl:
          `/api/files/download/${encodeURIComponent(code)}/${file.fileIndex}`,
      })),
    });

  } catch (error) {
    next(error);
  }
}

module.exports = {
  uploadFile,
  getSharedFile,
};
