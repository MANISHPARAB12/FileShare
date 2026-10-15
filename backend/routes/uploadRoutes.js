
const express = require("express");
const upload = require("../middleware/upload");

const {
  uploadFile,
  getSharedFile,
} = require("../controller/upload.controller");

const {
  downloadFile,
} = require("../controllers/downloadController");

const router = express.Router();

router.post("/files/upload", upload.array("files", 10), uploadFile);
router.get("/files/share/:code", getSharedFile);
router.get("/files/download/:code", downloadFile);

module.exports = router;
