const express = require("express");
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

const app = express();

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.get("/", (req, res) => {
  res.render("index");
});

// File upload routes
app.post("/upload/single", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    res.json({
      message: "File uploaded successfully",
      file: {
        filename: req.file.filename,
        path: req.file.path,
        size: req.file.size,
        mimetype: req.file.mimetype,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Multiple files upload route (max 2 files)
app.post("/upload/multiple", upload.array("files", 2), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    // Group files by type
    const groupedFiles = req.files.reduce((acc, file) => {
      const type = file.mimetype.startsWith("image/") ? "images" : "pdfs";
      if (!acc[type]) acc[type] = [];
      acc[type].push({
        filename: file.filename,
        originalname: file.originalname,
        path: file.path,
        size: file.size,
        mimetype: file.mimetype,
        url: `/uploads/${file.filename}`,
      });
      return acc;
    }, {});

    res.json({
      message: `Successfully uploaded ${req.files.length} file(s)`,
      totalFiles: req.files.length,
      ...groupedFiles,
    });
  } catch (error) {
    console.error("File upload error:", error);
    res.status(500).json({
      error: error.message,
      details: "Failed to process file upload",
    });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
