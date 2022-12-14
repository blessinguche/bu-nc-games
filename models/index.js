const { query } = require("express");
const db = require("../db/connection");

exports.selectCategories = () => {
  return db.query("SELECT * FROM categories;").then((result) => result.rows);
};
exports.selectReviews = (category, sort_by = "created_at", order = "DESC") => {
  // const dbOutput = db.query(`SELECT * FROM categories WHERE slug = $1;`, [
  //   category,
  // ]).catch((err) => {
  //   console(err)
  // });
  // console.log(dbOutput)
  // if (dbOutput.rows.length === 0) {
  //   return Promise.reject({ status: 404, msg: "Species not found" });
  // }

  const queryArray = [];
  let queryStr = `SELECT reviews.*, COUNT(comments.review_id)::INT AS comment_count FROM reviews LEFT JOIN comments ON comments.review_id = reviews.review_id
  `;
  if (category !== undefined) {
    queryStr += ` WHERE category = $1`;
    queryArray.push(category);
  }
  queryStr += ` GROUP BY reviews.review_id ORDER BY ${sort_by} ${order}`;
  return db.query(queryStr, queryArray).then((result) => result.rows);
};

exports.selectReviewById = (review_id) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id = $1`, [review_id])
    .then((result) => result.rows[0]);
};

exports.selectCommentsByReviewId = (review_id) => {
  const query = `SELECT * FROM comments
  WHERE review_id = $1 ORDER BY created_at DESC;`;
  return db.query(query, [review_id]).then((result) => result.rows);
};

exports.insertComment = (review_id, newComment) => {
  const { username, body } = newComment;
  return db
    .query(
      "INSERT INTO comments (body, votes, review_id, created_at, author) VALUES ($1, $2, $3, $4, $5) RETURNING *;",
      [body, 0, review_id, new Date(), username]
    )
    .then(({ rows }) => rows[0]);
};
