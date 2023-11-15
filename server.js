const express = require("express");
const dotenv = require("dotenv");
const { log } = require("console");

const homeController = require("./controllers/home");

const pizzeRouter = require("./routers/pizze");
const uploadsRouter = require("./routers/uploads");
const adminRouter = require("./routers/admin");
const authRouter = require("./routers/auth");

const errorsFormatterMiddleware = require("./middlewares/errorsFormatter");
const routesLoggerMiddleware = require("./middlewares/routesLogger");
const routeNotFoundMiddleware = require("./middlewares/routeNotFound");

dotenv.config();

// istanza di express
const app = express();

// configuro express per leggere i dati in formato json
app.use(express.json());

// configuro express per leggere i dati in formato x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// configuro i file statici
app.use(express.static("public"));

// Middleware che stampa un log sulle rotte richieste dagli utenti
// app.use(routesLoggerMiddleware);

// Definiamo le rotte
app.get("/", homeController.index);
app.get("/about", routesLoggerMiddleware, homeController.about);
app.get("/contacts", homeController.contacts);

// Rotte relative all'entità pizze
app.use("/pizze", pizzeRouter)

app.use("/uploads", uploadsRouter)

// Rotte relative all'entità admin che saranno protette
app.use("/admin", adminRouter)

// rotte relative all'entità auth
app.use("/", authRouter)

// Gestione degli errori
app.use(errorsFormatterMiddleware)

// Gestione delle rotte non trovate
// Siccome questo middleware NON invoca la funzione next() 
// per far proseguire la Request, allora la dobbiamo registrare 
// per ultima, dopo TUTTE le altre rotte
// in modo che venga eseguito solo se nessuna delle rotte precedenti
// ha risposto alla Request
app.use(routeNotFoundMiddleware)

// Avviamo il server
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
