const db = require("../db/connection");
const fs = require("fs/promises");
const { checkExists } = require("../utils");
const format = require("pg-format");

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
  const result = await db.query(
    `DELETE FROM comments WHERE comment_id = $1 RETURNING *`,
    [comment_id]
  );
  return result.rows;
};
exports.readEndpoints = async () => {
  const result = await fs.readFile(`${__dirname}/../endpoints.json`, "utf-8");

  return result;
};

exports.insertCategory = (newCategory) => {
  const categoryData = [newCategory.slug, newCategory.description];
  return db
    .query(
      "INSERT INTO categories (slug, description) VALUES ($1, $2) RETURNING *",
      categoryData
    )
    .then(({ rows: [insertedCategory] }) => {
      if (!insertedCategory) {
        return Promise.reject({ status: 404, msg: "not found" });
      } else {
        return insertedCategory;
      }
    });
};

exports.insertCommentByReviewId = (newComment, reviewId) => {
  const newCommentData = [newComment.username, newComment.body, reviewId];
  return db
    .query(
      "INSERT INTO comments (author, body, review_id) VALUES ($1, $2, $3) RETURNING *",
      newCommentData
    )
    .then(({ rows: [comment] }) => {
      return comment;
    });
};

exports.updateComment = (patchData, commentId) => {
  const { inc_votes, body } = patchData;
  let edited;
  if (body) {
    edited = true;
  }
  return db
    .query(
      `UPDATE comments SET 
      votes = votes + COALESCE($1, 0),
      edited = CASE WHEN body <> $2 THEN COALESCE(edited, $3) ELSE edited END,
      body = CASE WHEN body <> $2 THEN COALESCE($2, body) ELSE body END
      WHERE comment_id = $4
      RETURNING *`,
      [inc_votes, body, edited, commentId]
    )
    .then(({ rows: [comment] }) => {
      if (!comment) {
        return Promise.reject({ status: 404, msg: "not found" });
      } else {
        return comment;
      }
    });
};

exports.insertReview = (newReview) => {
  const newReviewData = [
    newReview.owner,
    newReview.title,
    newReview.review_body,
    newReview.designer,
    newReview.category,
  ];
  return db
    .query(
      "INSERT INTO reviews (owner, title, review_body, designer, category) VALUES ($1, $2, $3, $4, $5) RETURNING *, 0 AS comment_count",
      newReviewData
    )
    .then(({ rows: [review] }) => {
      return review;
    });
};

exports.removeReview = (reviewId) => {
  return db
    .query("DELETE FROM reviews WHERE review_id = $1 RETURNING *", [reviewId])
    .then(({ rows: [review] }) => {
      if (!review) {
        return Promise.reject({ status: 404, msg: "not found" });
      }
    });
};

exports.selectUserByUsername = (username) => {
  return db
    .query("SELECT username, name, avatar_url FROM users WHERE username = $1", [
      username,
    ])
    .then(({ rows: [user] }) => {
      if (!user) {
        return Promise.reject({ status: 404, msg: "not found" });
      } else return user;
    });
};

exports.checkValueExists = (table, column, value) => {
  let sqlString;
  if (typeof value === "number") {
    sqlString = format("SELECT * FROM %I WHERE %I = %L", table, column, value);
  } else if (typeof value === "string") {
    sqlString = format(
      "SELECT * FROM %I WHERE %I ILIKE %L",
      table,
      column,
      value
    );
  }
  return db.query(sqlString).then(({ rows: values }) => {
    if (!values.length) {
      return Promise.reject({ status: 404, msg: "not found" });
    }
  });
};
