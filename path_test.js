
const path = require("path")

console.log(path.resolve(__dirname, "./index.html"))
console.log(path.resolve("./index.html"))

console.log(path.join(__dirname, "./index.html"))
console.log(path.join("./index.html"))
console.log(path.join("db", "../test", "./index.html"))
