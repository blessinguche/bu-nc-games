const express = require("express");
const app = express();
const { getCategories, getReviews } = require("./controllers");

app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews);

app.use((err, req, res, next) => {
  if (err.msg !== undefined) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});
app.use((err, req, res, next) => {
  console.log(err);
  res.sendStatus(500);
});

module.exports = app;
