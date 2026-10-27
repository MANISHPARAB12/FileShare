const express = require("express");
const multer = require("multer");
const upload = require("../middleware/upload");

const {
  uploadFile,
  getSharedFile,
} = require("../controllers/uploadController");

const { downloadFile } = require("../controllers/downloadController");

const router = express.Router();

// 1. Upload up to 10 files using FormData field name "files".
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

        return res.status(400).json({
          success: false,
          message: err.message,
        });
      }

      // Custom fileFilter error, including .exe rejection.
      return res.status(400).json({
        success: false,
        message: err.message || "File upload failed.",
      });
    }

    return uploadFile(req, res, next);
  });
});

// 2. Find shared files using a PIN.
router.get("/files/share/:code", getSharedFile);

// 3. Download a specific file in a batch.
router.get("/files/download/:code/:index", downloadFile);

// 4. Backward-compatible download route for the first file.
router.get("/files/download/:code", downloadFile);

module.exports = router;
