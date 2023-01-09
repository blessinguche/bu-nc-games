const express = require("express");
const { getCategories, postCategory } = require("../controllers/index");
const categoriesRouter = express.Router();

categoriesRouter.route("/").get(getCategories)
.post(postCategory);

module.exports = categoriesRouter;