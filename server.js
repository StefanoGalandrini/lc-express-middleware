const express = require("express");
const dotenv = require("dotenv");
const { log } = require("console");
const pizzeController = require("./controllers/pizze");
const homeController = require("./controllers/home");

dotenv.config();

// istanza di express
const app = express();

// configuro i file statici
app.use(express.static("public"));

// Definiamo le rotte
app.get("/", homeController.index);
app.get("/about", homeController.about);
app.get("/contacts", homeController.contacts);

app.get("/pizze", pizzeController.index)

// Avviamo il server
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
