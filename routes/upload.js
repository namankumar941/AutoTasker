const express = require("express");
const router = express.Router();

const UploadClass = require("../class/UploadClass");
const upload = require("../middleware/multer");

const uploadClass = new UploadClass();

//----------------------------------------------routes----------------------------------------------
// Single file upload route
router.post(
  "/single",
  upload.single("file"),
  uploadClass.singleUpload.bind(uploadClass)
);

// Multiple files upload route (max 2 files)
router.post(
  "/multiple",
  upload.array("files", 2),
  uploadClass.multipleUpload.bind(uploadClass)
);

module.exports = router;
