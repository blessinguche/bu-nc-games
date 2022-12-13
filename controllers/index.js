const reviews = require("../db/data/test-data/reviews");
const {
  selectCategories,
  selectReviews,
  selectReviewById,
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
