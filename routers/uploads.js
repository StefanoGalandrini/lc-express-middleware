const express = require('express');
const multer = require('multer');
const router = express.Router();
const uploadController = require("../controllers/upload");

router.post("/", multer({dest: "storage/uploads"}).single("attachment"), uploadController.upload);

module.exports = router;