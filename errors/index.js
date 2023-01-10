const errCodes = ["22P02", "23502", "23503", "42703", "42601", "23505"];

const handle404Paths = (req, res, next) => {
  res.status(404).send({ msg: "Bad path" });
};

const handleCustomErrors = (err, req, res, next) => {
  if (err.msg && err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

const handlePsqlErrors = (err, req, res, next) => {
  if (errCodes.includes(err.code)) {
    res.status(400).send({ msg: "Bad Request" });
  } else next(err);
};

const handle500s = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal Server Error" });
};
module.exports = {
  handle404Paths,
  handlePsqlErrors,
  handleCustomErrors,
  handle500s,
};
