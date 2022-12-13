const { selectCategories, selectReviews } = require("../models");

exports.getCategories = (req, res) => {
  selectCategories()
    .then((categories) => {
      res.status(200).send({ categories });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getReviews = (req, res) => {
  selectReviews()
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch((err, next) => {
      console.log(err);
      next();
    });
};
