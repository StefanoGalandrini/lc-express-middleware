const express = require("express");
const dotenv = require("dotenv");
const { log } = require("console");
const homeController = require("./controllers/home");
const pizzeRouter = require("./routers/pizze");
const uploadsRouter = require("./routers/uploads");

dotenv.config();

// istanza di express
const app = express();

// configuro express per leggere i dati in formato json
app.use(express.json());

// configuro express per leggere i dati in formato x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// configuro i file statici
app.use(express.static("public"));

// Definiamo le rotte
app.get("/", homeController.index);
app.get("/about", homeController.about);
app.get("/contacts", homeController.contacts);

// Rotte relative all'entità pizze
app.use("/pizze", pizzeRouter)

app.use("/uploads", uploadsRouter)

// Avviamo il server
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
