//----------------------------------------------class----------------------------------------------
class UploadClass {
  singleUpload(req, res) {
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
  }
  multipleUpload(req, res) {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
      }

      // Group files by type
      let groupedFiles = {};
      for (const file of req.files) {
        const type = file.mimetype.startsWith("image/")
          ? "images"
          : file.mimetype.startsWith("text/")
          ? "text"
          : "pdfs";

        if (!groupedFiles[type]) groupedFiles[type] = [];
        groupedFiles[type].push({
          filename: file.filename,
          originalname: file.originalname,
          path: file.path,
          size: file.size,
          mimetype: file.mimetype,
          url: `/uploads/${file.filename}`,
        });
      }
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
  }
}

module.exports = UploadClass;
