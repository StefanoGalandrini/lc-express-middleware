module.exports = function (req, res, next) {

  // res.status(404).send("<h1>404 Not Found</h1>");

  res.format({
    json: () => {
      res.status(404).json({
        message: "Oops, mi sa che ti sei perso"
      });
    },
    default: () => {
      res.status(404).send("<h1>Oops, mi sa che ti sei perso</h1>");
    },
  })
}