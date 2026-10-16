const express = require("express");
const upload = require("../middleware/upload");

const {
  uploadFile,
  getSharedFile,
} = require("../controllers/uploadController");

const {
  downloadFile,
} = require("../controllers/downloadController");

const router = express.Router();

// ============================================
// 1. UPLOAD MULTIPLE FILES
// ============================================
// Accepts up to 10 files in a single request.
// The frontend must append every file using
// the FormData field name "files".

router.post(
  "/files/upload",
  upload.array("files", 10),
  uploadFile
);

// ============================================
// 2. FIND SHARED FILES USING THE PIN
// ============================================
// Example:
// GET /api/files/share/A7K2P9

router.get(
  "/files/share/:code",
  getSharedFile
);

// ============================================
// 3. DOWNLOAD A SPECIFIC FILE
// ============================================
// Example:
// GET /api/files/download/A7K2P9/0
// GET /api/files/download/A7K2P9/1
//
// The index identifies the file in the batch.
// Index 0 = first file, index 1 = second file.

router.get(
  "/files/download/:code/:index",
  downloadFile
);

// ============================================
// 4. BACKWARD-COMPATIBLE DOWNLOAD ROUTE
// ============================================
// Example:
// GET /api/files/download/A7K2P9
//
// Downloads the first file when no index is given.

router.get(
  "/files/download/:code",
  downloadFile
);

// Export routes for server.js
module.exports = router;
