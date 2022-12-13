const db = require("../db/connection");

exports.selectCategories = () => {
    return db.query("SELECT * FROM categories;")
    .then((result) => result.rows)
}
exports.selectReviews = () => {
    const query = `
    SELECT reviews.*, COUNT(comments.review_id)::INT AS comment_count
    FROM reviews 
    LEFT JOIN comments ON comments.review_id = reviews.review_id
    GROUP BY reviews.review_id
    ORDER BY reviews.created_at DESC;`
    return db.query(query)
    .then((result) => {return result.rows})
    
}