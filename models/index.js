const db = require("../db/connection");

exports.selectCategories = () => {
  return db.query("SELECT * FROM categories;").then((result) => result.rows);
};

exports.selectCommentsByReviewId = (review_id) => {
  const query = `SELECT * FROM comments
  WHERE review_id = $1`;
  return db.query(query, [review_id]).then((result) => result.rows);
};
