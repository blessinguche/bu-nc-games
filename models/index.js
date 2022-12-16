const db = require("../db/connection");
const { checkExists } = require("../utils");

exports.selectCategories = async () => {
  const result = await db.query("SELECT * FROM categories;");
  return result.rows;
};
exports.selectReviews = async (
  category,
  sort_by = "created_at",
  order = "DESC"
) => {
  const queryArray = [];
  let queryStr = `SELECT reviews.*, COUNT(comments.review_id)::INT AS comment_count FROM reviews LEFT JOIN comments ON comments.review_id = reviews.review_id
  `;
  if (category !== undefined) {
    queryStr += ` WHERE category = $1`;
    queryArray.push(category);
  }
  queryStr += ` GROUP BY reviews.review_id ORDER BY ${sort_by} ${order}`;
  if (category === undefined) {
    return await db.query(queryStr, queryArray).then((result) => result.rows);
  }
  return await checkExists("categories", "slug", category)
    .then((results) => {
      if (results && category !== undefined) {
        return db.query(queryStr, queryArray);
      }
    })
    .then((result) => result.rows);
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

exports.selectCommentsByReviewId = async (review_id) => {
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
  const { rows } = await db.query(
    "INSERT INTO comments (body, votes, review_id, created_at, author) VALUES ($1, $2, $3, $4, $5) RETURNING *;",
    [body, 0, review_id, new Date(), username]
  );
  return rows[0];
};
exports.updateReviewById = async (review_id, votesChange) => {
  const review = await db.query(
    `UPDATE reviews SET votes = votes + $1 WHERE review_id = $2 RETURNING *;`,
    [votesChange, review_id]
  );
  return review.rows[0];
};
exports.removeComment = async (comment_id) => {
  const result = await db.query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *`, [
    comment_id,
  ]);
  return result.rows;
};
