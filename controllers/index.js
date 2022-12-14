const reviews = require("../db/data/test-data/reviews");
const {
  selectCategories,
  selectReviews,
  selectCommentsByReviewId,
  selectReviewById,
  insertComment,
  selectUsers,
  updateReviewById,
} = require("../models");

exports.getCategories = (req, res, next) => {
  selectCategories()
    .then((categories) => {
      res.status(200).send({ categories });
    })
    .catch(next);
};
exports.getReviews = (req, res, next) => {
  selectReviews()
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
          msg: `ID not found`,
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
          msg: `ID not found`,
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
          msg: `ID not found`,
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
          msg: `ID not found`,
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
          msg: `ID not found`,
        });
      } else {
        res.status(200).send({ review });
      }
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
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
}