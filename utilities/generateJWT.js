const jwt = require('jsonwebtoken');

module.exports = function (user) {
  // Estraggo i dati che voglio salvare all'interno del token
  // E' importante estrarre SOLO i dati che davvero mi servono
  // per evitare di esporre dati sensibili
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email
  }

  // sign() richiede 3 argomenti:
  // - payload (dati da salvare all'interno del token)
  // - secretKey (chiave segreta presa dal file .env)
  // - opzioni (oggetto che permette di configurare il token)
  // https://www.npmjs.com/package/jsonwebtoken#usage
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '1h'
  })
}