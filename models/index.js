const db = require("../db/connection");

exports.selectCategories = async () => {
  const result = await db.query("SELECT * FROM categories;");
  return result.rows;
};
exports.selectReviews = async () => {
  const query = `
    SELECT reviews.*, COUNT(comments.review_id)::INT AS comment_count
    FROM reviews 
    LEFT JOIN comments ON comments.review_id = reviews.review_id
    GROUP BY reviews.review_id
    ORDER BY reviews.created_at DESC;`;
  const result = await db.query(query);
  return result.rows;
};
exports.selectReviewById = async (review_id) => {
  const queryStr = `SELECT reviews.*, COUNT(comments.review_id)::INT AS comment_count
  FROM reviews 
  LEFT JOIN comments ON comments.review_id = reviews.review_id
  WHERE reviews.review_id = $1
  GROUP BY reviews.review_id
  ORDER BY reviews.created_at DESC;`;
  const result = await db.query(queryStr, [review_id]);
  return result.rows[0];
};

exports.selectCommentsByReviewId = async (review_id, queries) => {
  const query = `SELECT * FROM comments
  WHERE review_id = $1 ORDER BY created_at DESC;`;
  const result = await db.query(query, [review_id]);
  return result.rows;
};

exports.selectUsers = async () => {
  const result = await db.query("SELECT * FROM users;");
  return result.rows;
};
exports.insertComment = async (review_id, newComment) => {
  const { username, body } = newComment;
  const { rows } = await db
    .query(
      "INSERT INTO comments (body, votes, review_id, created_at, author) VALUES ($1, $2, $3, $4, $5) RETURNING *;",
      [body, 0, review_id, new Date(), username]
    );
  return rows[0];
};
exports.updateReviewById = async (review_id, votesChange) => {
  const review = await db
    .query(
      `UPDATE reviews SET votes = votes + $1 WHERE review_id = $2 RETURNING *;`,
      [votesChange, review_id]
    );
  return review.rows[0];
};
