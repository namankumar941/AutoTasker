const path = require("path");
const multer = require("multer");

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// File filter for PDFs and Images
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = {
    pdf: ["application/pdf"],
    image: ["image/jpeg", "image/png", "image/gif", "image/webp"],
    text: ["text/plain"],
  };

  const isAllowedType = Object.values(allowedFileTypes)
    .flat()
    .includes(file.mimetype);
  if (isAllowedType) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid file type: ${file.mimetype}. Only PDF and image files (JPEG, PNG, GIF, WebP) are allowed.`
      ),
      false
    );
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

module.exports = upload;
