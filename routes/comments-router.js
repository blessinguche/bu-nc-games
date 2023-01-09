const express = require("express");
const { deleteComment, patchComment } = require("../controllers/index");
const commmentsRouter = express.Router();

commmentsRouter.route("/:comment_id")
.patch(patchComment)
.delete(deleteComment)

module.exports = commmentsRouter;