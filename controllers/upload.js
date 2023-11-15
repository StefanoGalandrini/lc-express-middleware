const express = require('express');
const fs = require("fs")
const path = require("path")

/**
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
function upload (req, res) {
  storeUploadFile(req.file)

  res.json(req.file)
}

function storeUploadFile(file) {
  const tableFile = require("../db/files.json")

  // aggiungo i dati del file all'array tableFile
  tableFile.push(file)

  // Scrivo i dati sul file json
  fs.writeFileSync(path.join(__dirname, "../db/files.json"), JSON.stringify(tableFile, null, 2))

  return file.filename
}

module.exports = {
  upload,
  storeUploadFile
};