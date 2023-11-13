const fs = require("fs");
const listaPizze = require("./db/pizze.json");
const { log } = require("console");
const { kebabCase } = require("lodash");

let id = 100;

const generateSlug = (text) => {
  const slug = kebabCase(text);

  // controllo che questo NON sia già presente nella lista delle pizze

  // se è già presente, aggiungo un numero alla fine

  return slug;
};

// ciclo la lista delle pizze
const nuovaLista = listaPizze.map((pizza) => {
  // pizza.id = id;
  // id++;

  // return pizza

  return {
    id: id++,
    slug: generateSlug(pizza.name),
    ...pizza,
    updatedAt: new Date(),
  };
});

// salviamo i dati dentro il json
fs.writeFileSync("./db/pizze.json", JSON.stringify(nuovaLista, null, 2));

// fs.writeFileSync("./db/pizze.json", JSON.stringify(nuovaLista, function(key, value){
//   if(key === "updatedAt") {
//     return new Date(value).toDateString();
//   }

//   return value;
// }, 2));
