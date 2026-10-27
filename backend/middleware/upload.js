const multer = require("multer");
const path = require("path");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const originalName = String(file.originalname || "");
  const extension = path.extname(originalName).toLowerCase();

  // Reject .exe files before Multer buffers them or applies size validation.
  if (extension === ".exe") {
    return cb(
      new Error(`${originalName} is not uploadable. EXE files are not allowed.`)
    );
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB per file
    files: 10, // Maximum 10 files per request
  },
});

module.exports = upload;
