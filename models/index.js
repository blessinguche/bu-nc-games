const db = require("../db/connection");

exports.selectCategories = () => {
    return db.query("SELECT * FROM categories;")
    .then((result) => result.rows)
    .catch((err) => {
        console.log(err)
    });
}