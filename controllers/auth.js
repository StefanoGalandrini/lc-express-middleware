const generateJWT = require("../utilities/generateJWT");

function login(req, res) {
  // leggo username e password da req.body
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).send("username e password sono obbligatori");
    return;
  }

  // leggo il file users.json
  const users = require("../db/users.json");

  // controllo se c'è una corrispondenza tra username e password
  const user = users.find(
    (user) => user.username === username && user.password === password
  );

  if (!user) {
    res.status(401).send("username e/o password errati");
    return;
  }

  // una volta trovato un utente con quell'username e password,
  // possiamo generare un token JWT e inviarlo al client
  const token = generateJWT(user);

  res.json({
    token
  });
}

module.exports = {
  login,
};
