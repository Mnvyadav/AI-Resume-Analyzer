const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const fs = require("fs");

const router = express.Router();

const upload = multer({
  dest: "uploads/",
});

router.post(
  "/extract-text",
  upload.single("resume"),
  async (req, res) => {
    try {
      console.log(req.file);

      const dataBuffer = fs.readFileSync(
        req.file.path
      );

      const pdfData = await pdfParse(dataBuffer);

      console.log(pdfData.text);

      res.json({
        extractedText: pdfData.text,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        error: "Failed to extract text",
      });
    }
  }
);

module.exports = router;