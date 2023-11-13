const { log } = require("console");
const menu = require("../db/pizze.json");
const path = require("path");
const fs = require("fs");

function index(req, res) {
  res.format({
    html: () => {
      const html = [
        `<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
      <h1>Lista delle pizze</h1>`,
      ];

      html.push("<ul>");

      for (const pizza of menu) {
        html.push(`<li>
          <h3>${pizza.name}</h3>
          <img src="/imgs/pizze/${pizza.image}" alt="" style="width: 100px">
        </li>`);
      }

      html.push("</ul>");

      res.send(html.join(""));
    },
    json: () => {
      res.type("json").send({
        totalElements: menu.length,
        list: menu,
      });
    },
  });
}

function show(req, res) {
  const pizza = findOrFail(req, res);

  pizza.attachment = pizza.attachment?.map((attachment) => {
    attachment = encodeURIComponent(attachment);

    return `/pizze/${pizza.id}/download-attachment/${attachment}`
  })

  res.json(pizza);
}

/**
 * Deve eseguire il download dell'immagine
 * della pizza richiesta
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
function downloadImage(req, res) {
  const pizza = findOrFail(req, res);

  const filePath = path.resolve(
    __dirname,
    "..",
    "public",
    "imgs",
    "pizze",
    pizza.image
  );

  // res.sendFile(filePath)

  // Aggiunge un header "Content-Disposition"
  // che indica al browser che vogliamo scaricare il file
  res.download(filePath, "nome custom.jpeg");
}

function downloadAttachment(req, res) {
  // recupero la pizza in base all'id
  const pizza = findOrFail(req, res);
  const fileName = req.params.fileName;
  const fileFolder = req.params.fileFolder;

  const attachmentExists = pizza.attachment?.find(
    (attachment) => attachment === fileFolder + "/" + fileName
  );

  // controllo che l'allegato sia associato alla pizza corrente
  if (!attachmentExists) {
    res.status(404).send(`Allegato ${fileName} non trovato`);
    return;
  }

  const finalFilePath = path.resolve(__dirname, "..", fileFolder, fileName);

  // Controllo che il file esista fisicamente sul server
  if (!fs.existsSync(finalFilePath)) {
    res.status(404).send(`File ${fileName} non presente sul server`);
    return;
  }

  res.sendFile(finalFilePath);
}

function downloadAttachment2(req, res) {
  // recupero la pizza in base all'id
  const pizza = findOrFail(req, res);
  const filePath = req.params.filePath;
  
  const attachmentExists = pizza.attachment?.find(
    (attachment) => attachment === filePath
  );

  // controllo che l'allegato sia associato alla pizza corrente
  if (!attachmentExists) {
    res.status(404).send(`Allegato ${filePath} non trovato`);
    return;
  }

  const finalFilePath = path.resolve(__dirname, "..", filePath);

  // Controllo che il file esista fisicamente sul server
  if (!fs.existsSync(finalFilePath)) {
    res.status(404).send(`File ${filePath} non presente sul server`);
    return;
  }

  res.sendFile(finalFilePath);
}

function findOrFail(req, res) {
  // recupero l'id dalla richiesta
  const pizzaId = req.params.id;

  // recupero la pizza dal menu
  const pizza = menu.find((pizza) => pizza.id == pizzaId);

  // Nel caso in cui non sia stata trovata la pizza ritorno un 404
  if (!pizza) {
    res.status(404).send(`Pizza con id ${pizzaId} non trovata`);
    return; // interrompo l'esecuzione della funzione
  }

  return pizza;
}

module.exports = {
  index,
  show,
  downloadImage,
  downloadAttachment,
  downloadAttachment2,
  
};
