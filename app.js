const express = require("express");
const app = express();
const {
  getCategories,
  getReviews,
  getReviewById,
  getCommentsByReviewId,
  postComment,
  getUsers,
  patchReview,
} = require("./controllers");
const { handle404Paths, handleCustomErrors, handlePsqlErrors, handle500s } = require("./errors");

app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id", getReviewById);
app.get("/api/reviews/:review_id/comments", getCommentsByReviewId);
app.get("/api/reviews/:review_id/comments", postComment);

app.all('*', handle404Paths);
app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handle500s);

module.exports = app;
