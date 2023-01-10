const {
  selectCategories,
  selectReviews,
  selectCommentsByReviewId,
  selectReviewById,
  insertComment,
  selectUsers,
  updateReviewById,
  removeComment,
  readEndpoints,
  insertCategory,
  insertReview,
  selectUserByUsername,
} = require("../models");

exports.getCategories = (req, res, next) => {
  selectCategories()
    .then((categories) => {
      res.status(200).send({ categories });
    })
    .catch(next);
};
exports.getReviews = (req, res, next) => {
  const { category, sort_by, order } = req.query;
  selectReviews(category, sort_by, order)
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch(next);
};

exports.getReviewById = (req, res, next) => {
  const { review_id } = req.params;
  selectReviewById(review_id)
    .then((review) => {
      if (review === undefined) {
        return Promise.reject({
          status: 404,
          msg: `Not found`,
        });
      } else {
        res.status(200).send({ review });
      }
    })
    .catch(next);
};

exports.getCommentsByReviewId = (req, res, next) => {
  const { review_id } = req.params;
  selectCommentsByReviewId(review_id)
    .then((comments) => {
      if (comments.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `Not found`,
        });
      }
      res.status(200).send({ comments });
    })
    .catch(next);
};
exports.getReviewById = (req, res, next) => {
  const { review_id } = req.params;
  selectReviewById(review_id)
    .then((review) => {
      if (review === undefined) {
        return Promise.reject({
          status: 404,
          msg: `Not found`,
        });
      } else {
        res.status(200).send({ review });
      }
    })
    .catch(next);
};

exports.getCommentsByReviewId = (req, res, next) => {
  const { review_id } = req.params;
  selectCommentsByReviewId(review_id)
    .then((comments) => {
      if (comments.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `Not found`,
        });
      }
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.patchReview = (req, res, next) => {
  const { review_id } = req.params;
  updateReviewById(review_id, req.body.inc_votes)
    .then((review) => {
      if (review === undefined) {
        return Promise.reject({
          status: 404,
          msg: `Not found`,
        });
      } else {
        res.status(200).send({ review });
      }
    })
    .catch(next);
};

exports.postCommentByReviewId = (req, res, next) => {
  const { review_id } = req.params;
  insertComment(review_id, req.body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.getUsers = (req, res, next) => {
  selectUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  removeComment(comment_id)
    .then((commment) => {
      if (commment.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `Not found`,
        });
      } else {
        res.status(204).send({ commment });
      }
    })
    .catch(next);
};
exports.getApi = (req, res, next) => {
  readEndpoints()
    .then((endpoints) => {
      const parsedEndpoints = JSON.parse(endpoints);
      res.status(200).send({ endpoints: parsedEndpoints });
    })
    .catch(next);
};

exports.getUserByUsername = (req, res, next) => {
  selectUserByUsername(req.params.username)
    .then((user) => {
      if (user === undefined) {
        return Promise.reject({
          status: 404,
          msg: `Not found`,
        });
      } else {
      res.status(200).send({ user });
      }
    })
    .catch(next);
};

exports.postCategory = (req, res, next) => {
  insertCategory(req.body)
    .then((category) => {
      res.status(201).send({ category });
    })
    .catch(next);
};

exports.postReview = (req, res, next) => {
  insertReview(req.body)
    .then((review) => {
      res.status(201).send({ review });
    })
    .catch(next);
};

