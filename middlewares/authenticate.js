const express = require("express");
const jwt = require("jsonwebtoken");

/**
 * @param {express.Request} req
 * @param {*} res
 * @param {*} next
 */
module.exports = function (req, res, next) {
  // leggo il JWT ricevuto
  const bearerToken = req.header("Authorization");

  if (!bearerToken) {
    return res.status(401).send("Token mancante");
  }

  // Estraggo solo la parte del codice del token
  // il codice ricevuto conterrà la parola Bearer seguita da uno spazio
  const token = bearerToken.split(" ")[1];
  // const token = bearerToken.slice(bearerToken.indexOf(" ") + 1);

  // controllo che sia valido
  // decide se lasciar passare o meno la richiesta

  // Funzione verify richiede 3 parametri:
  // 1. Il token da verificare
  // 2. La chiave segreta con cui è stato firmato
  // 3. eventuali opzioni (es. algoritmo di cifratura)

  // Se il token non è valido verrà lanciata un errore che verrà catturato 
  // dal middleware che gestisce gli errori
  // Se è valido ritorna il payload del token
  const jwtPayload = jwt.verify(token, process.env.JWT_SECRET);

  // Aggiungo il payload del token alla richiesta
  // siccome il payload contiene i dati dell'utente,
  // la proprietà che aggiungo sarà user.
  req["user"] = jwtPayload

  next();
};
