const express = require("express");
const app = express();
const morgan = require("morgan");
const apiRouter = require("./api");
const path = require('path')
const PORT = process.env.PORT || 8080


const { db } = require("./db/db");
app.use(morgan("dev"));
app.use(express.json());
app.use("/api", apiRouter);

app.use(express.static(path.join(__dirname, '/public')))
app.use("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});
// Send index.html for any other requests

// error handling middleware
app.use((err, req, res, next) => {
  if (process.env.NODE_ENV !== "test") console.error(err.message, err.stack);
  res.status(err.status || 500).send(err.message || "Internal server error");
});

// db.sync();
db.sync() // if you update your db schemas, make sure you drop the tables first and then recreate them
  .then(() => {
    console.log('db synced')
    app.listen(PORT, () => console.log(`studiously serving silly sounds on port ${PORT}`))
  })
