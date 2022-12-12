const e = require("express");
const { selectCategories, selectCommentsByReviewId } = require("../models");

exports.getCategories = (req, res) => {
  selectCategories()
    .then((categories) => {
      res.status(200).send({ categories });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCommentsByReviewId = (req, res) => {
    const {review_id} = req.params
    selectCommentsByReviewId(review_id)
    .then((comments) => {
        res.status(200).send({ comments });
    })
    .catch((err) => {
        console.log(err)
    })
}