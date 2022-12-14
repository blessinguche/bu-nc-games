
const db = require("../db/connection");

exports.selectCategories = () => {
  return db.query("SELECT * FROM categories;").then((result) => result.rows);
};
exports.selectReviews = () => {
  const query = `
    SELECT reviews.*, COUNT(comments.review_id)::INT AS comment_count
    FROM reviews 
    LEFT JOIN comments ON comments.review_id = reviews.review_id
    GROUP BY reviews.review_id
    ORDER BY reviews.created_at DESC;`;
  return db.query(query).then((result) => result.rows);
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

exports.selectUsers = () => {
  return db.query("SELECT * FROM users;").then((result) => result.rows);
}
exports.insertComment = (review_id, newComment) => {
  const { username, body } = newComment;
  return db
    .query(
      "INSERT INTO comments (body, votes, review_id, created_at, author) VALUES ($1, $2, $3, $4, $5) RETURNING *;",
      [body, 0, review_id, new Date(), username]
    )
    .then(({ rows }) => rows[0])
    

};
exports.updateReviewById = (review_id, votesChange) => {
  return db 
  .query(`UPDATE reviews SET votes = votes + $1 WHERE review_id = $2 RETURNING *;`, [votesChange, review_id])
  .then((review) => review.rows[0])
}