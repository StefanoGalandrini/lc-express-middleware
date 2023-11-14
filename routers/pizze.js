const express = require("express");
const multer = require("multer")
const router = express.Router();
const pizzeController = require("../controllers/pizze");

// index
router.get("/", pizzeController.index)

// show
router.get("/:id", pizzeController.show)

// Store
router.post("/", multer({dest: "public/imgs/pizze"}).single("image"), pizzeController.store)

// destroy
router.delete("/:id", pizzeController.destroy)

// esegue il download dell'immagine di una pizza
router.get("/:id/download-img", pizzeController.downloadImage)

// router.get("/:id/download-attachment/:fileFolder/:fileName", pizzeController.downloadAttachment)
router.get("/:id/download-attachment/:filePath", pizzeController.downloadAttachment2)

// Rotta che ritorna l'immagine di una pizza
router.get("/:id/image", pizzeController.showImage)

module.exports = router;