
const express = require("express");
const multer = require("multer");

const upload = require("../middleware/upload");

const {
  uploadFile,
  getSharedFile,
} = require("../controllers/uploadController");

const {
  downloadFile,
} = require("../controllers/downloadController");

const router = express.Router();

// Upload up to 10 files
router.post("/files/upload", (req, res, next) => {
  upload.array("files", 10)(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            success: false,
            message: "File exceeds the 10 MB file size limit.",
          });
        }

        if (err.code === "LIMIT_FILE_COUNT") {
          return res.status(400).json({
            success: false,
            message: "You can upload a maximum of 10 files.",
          });
        }
      }

      return res.status(400).json({
        success: false,
        message: err.message || "File upload failed.",
      });
    }

    return uploadFile(req, res, next);
  });
});

// Get shared files using PIN
router.get("/files/share/:code", getSharedFile);

// Download a specific file
router.get("/files/download/:code/:index", downloadFile);

// Download first file (backward compatibility)
router.get("/files/download/:code", downloadFile);

module.exports = router;
