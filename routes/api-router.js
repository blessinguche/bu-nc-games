const express = require("express");

const { getApi } = require("../controllers/index");

const apiRouter = express.Router();
const categoriesRouter = require('./categories-router');
const reviewsRouter = require('./reviews-router');
const usersRouter = require('./users-router');
const commmentsRouter = require('./comments-router');

apiRouter.use(express.json());

apiRouter.route("/").get(getApi);

apiRouter.use("/categories", categoriesRouter);
apiRouter.use("/reviews", reviewsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/comments", commmentsRouter);

module.exports = apiRouter;