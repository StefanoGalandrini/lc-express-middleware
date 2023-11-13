const express = require("express");
const router = express.Router();
const pizzeController = require("../controllers/pizze");

// index
router.get("/", pizzeController.index)

// show
router.get("/:id", pizzeController.show)

// esegue il download dell'immagine di una pizza
router.get("/:id/download-img", pizzeController.downloadImage)

// router.get("/:id/download-attachment/:fileFolder/:fileName", pizzeController.downloadAttachment)
router.get("/:id/download-attachment/:filePath", pizzeController.downloadAttachment2)

module.exports = router;