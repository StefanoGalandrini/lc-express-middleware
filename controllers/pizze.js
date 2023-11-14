const { log } = require("console");
const menu = require("../db/pizze.json");
const path = require("path");
const fs = require("fs");
const { kebabCase } = require("lodash");

function index(req, res) {
  res.format({
    html: () => {
      const html = [
        `<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
      <h1>Lista delle pizze</h1>`,
      ];

      html.push("<ul>");

      // Modifichiamo l'src dell'immagine in modo che utilizzi la rotta /pizze/:id/image
      for (const pizza of menu) {
        html.push(`<li>
          <h3>${pizza.name}</h3>
          <img src="/pizze/${pizza.id}/image" alt="" style="width: 100px">
        </li>`);
      }

      html.push("</ul>");

      res.send(html.join(""));
    },
    json: () => {
      res.type("json").send({
        totalElements: menu.length,
        list: menu.map((pizza) => {
          // aggiungo la proprietà image_url per permettere la visualizzazione
          // dell'immagine uploadata
          pizza.image_url = `/pizze/${pizza.id}/image`;

          return pizza;
        }),
      });
    },
  });
}

/**
 *
 * @param {import("express").Request} req
 * @param {*} res
 */
function show(req, res) {
  const pizza = findOrFail(req, res);

  // pizza.image_url =
  //   `${req.protocol}://${req.hostname}:${process.env.PORT}` +
  //   "/imgs/pizze/" +
  //   pizza.image;

  pizza.image_url = `/pizze/${pizza.id}/image`;

  pizza.attachment = pizza.attachment?.map((attachment) => {
    attachment = encodeURIComponent(attachment);

    return `/pizze/${pizza.id}/download-attachment/${attachment}`;
  });

  res.json(pizza);
}

function store(req, res) {
  console.log(req.body);
  console.log(req.file);

  // leggo il DB
  const pizze = require("../db/pizze.json");

  // recupero gli id delle pizze
  /**
   * @type {number[]}
   */
  let idList = pizze.map((pizza) => pizza.id);

  // ordino gli id in ordine decrescente
  idList.sort((a, b) => b - a);

  // idList = pizze.sort((a, b) => {
  //   if (b.slug > a.slug) {
  //     return -1;
  //   } else if (b.slug < a.slug) {
  //     return 1;
  //   }

  //   return 0;
  // });

  // const {name, ingredients} = req.body;

  // Metodo che recupera l'estensione e rinomina il file
  // salvato da multer aggiunge l'estensione
  /* 
  const fileExtension = path.extname(req.file.originalname);
  const newName = req.file.filename + fileExtension;

  fs.renameSync(req.file.path, path.resolve(__dirname, "..", "public", "imgs", "pizze", newName)); 
  */

  // aggiungo la pizza al DB
  pizze.push({
    ...req.body,
    id: idList[0] + 1,
    slug: kebabCase(req.body.name),
    updatedAt: new Date().toISOString(),
    image: req.file,
  });

  // converto il DB in JSON
  const json = JSON.stringify(pizze, null, 2);

  // scrivo il JSON su file
  fs.writeFileSync(path.resolve(__dirname, "..", "db", "pizze.json"), json);

  res.json(pizze[pizze.length - 1]);
}

function destroy(req, res) {
  const pizza = findOrFail(req, res);

  // Leggo il DB
  const listaPizze = require("../db/pizze.json");

  // trovo l'indice della pizza da eliminare
  const pizzaIndex = listaPizze.findIndex((_pizza) => _pizza.id == pizza.id);

  // rimuovo la pizza dall'array
  listaPizze.splice(pizzaIndex, 1);

  // converto il DB in JSON
  const json = JSON.stringify(listaPizze, null, 2);

  if (pizza.image) {
    if (typeof pizza.image === "string") {
      const filePath = path.resolve(
        __dirname,
        "..",
        "public",
        "imgs",
        "pizze",
        pizza.image
      );

      fs.unlinkSync(filePath);
    } else {
      const filePath = path.resolve(__dirname, "..", pizza.image.path);

      fs.unlinkSync(filePath);
    }
  }

  // scrivo il JSON su file
  fs.writeFileSync(path.resolve(__dirname, "..", "db", "pizze.json"), json);

  res.send("Pizza eliminata correttamente");
}

function showImage(req, res) {
  const pizza = findOrFail(req, res);

  if (typeof pizza.image === "string") {
    const filePath = path.resolve(
      __dirname,
      "../public/imgs/pizze",
      pizza.image
    );

    res.sendFile(filePath);

    return;
  }

  const filePath = path.resolve(__dirname, "..", pizza.image.path);

  log(filePath);

  res.append("Content-Type", pizza.image.mimetype);

  res.sendFile(filePath);
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
  store,
  destroy,
  downloadImage,
  downloadAttachment,
  downloadAttachment2,
  showImage,
};
