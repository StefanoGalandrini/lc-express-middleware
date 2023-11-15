const { log } = require("console");
const express = require("express");
const fs = require("fs");
const path = require("path");

/**
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
function index (req, res) {

  log("richiesta arrivata al controller home");
  /* const acceptType = req.accepts();

  log(acceptType);
  log(req.accepts("application/json")); */

  /* if (req.accepts("text")) {
    res.type("text").send("Hello World!");
  } else if (req.accepts("html")) {
    res.type("html").send("<h1>Hello World!</h1>");
  } else if (req.accepts("application/json")) {
    res.type("json").send({
      message: "Hello World!",
    });
  } */

  adsadas

  res.format({
    text: () => {
      res.type("text").send("Hello World!");
    },
    html: () => {
      let htmlContent = fs.readFileSync(path.resolve(__dirname, "../index.html"), "utf-8");
      let headContent = fs.readFileSync(path.resolve(__dirname, "../head.html"), "utf-8");
      const sottitolo = "Questa è la pizzeria più buona che ci  sia!"
      
      htmlContent = htmlContent.replace("{{ sottotitolo }}", sottitolo);
      htmlContent = htmlContent.replace("@head", headContent);

      res.type("html").send(htmlContent);
    },
    json: () => {
      res.type("json").send({
        message: "Hello World!",
      });
    },
    default: () => {
      res.status(406).send("Not Acceptable");
    },
  })
}

/**
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
function about(req, res) {
  res.send("<h1>About page</h1>");
}

/**
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
function contacts(req, res){
  res.send("<h1>Contacts page</h1>");
}

module.exports = {
  index,
  about,
  contacts
}