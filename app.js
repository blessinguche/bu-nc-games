const express = require("express");
const cors = require("cors");
const app = express();
const {
  handle404Paths,
  handleCustomErrors,
  handlePsqlErrors,
  handle500s,
} = require("./errors");

const apiRouter = require('./routes/api-router');

app.use(express.json());
app.use(cors());

app.use("/api", apiRouter);

app.all("*", handle404Paths);
app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handle500s);

module.exports = app;
