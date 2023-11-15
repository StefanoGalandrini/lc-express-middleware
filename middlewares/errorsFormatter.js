const fs = require("fs");
const path = require("path");

/**
 * Questo middleware ha 4 argomenti, 
 * quindi express lo riconosce come middleware degli errori
 * 
 * @param {*} err 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
module.exports = function (err, req, res, next) {
  // se req ha un file, allora lo elimino
  if (req.file) {
    fs.unlinkSync(req.file.path);
  }

  res.format({
    json: () => {
      res.status(500).json({
        message: "Oops, mi sa che qualcosa è andato storto",
        error: err.message,
        errorInstance: err.name,
        // stack: err.stack
      });
    },
    default: () => {
      res.status(500).send("<h1>Oops, mi sa che qualcosa è andato storto</h1>");
    },
  });
};
