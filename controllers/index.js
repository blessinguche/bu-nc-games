const {
    selectCategories
} = require("../models");

exports.getCategories = (req, res) => {
    
  selectCategories().then((categories) => {
    res.status(200).send({ categories });
  });
};
