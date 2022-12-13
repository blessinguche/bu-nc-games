const reviews = require("../db/data/test-data/reviews");
const { selectCategories, selectReviews, selectReviewById } = require("../models");

exports.getCategories = (req, res) => {
  selectCategories()
    .then((categories) => {
      res.status(200).send({ categories });
    })
    .catch((err) => {
      console.log(err);
    });
};
