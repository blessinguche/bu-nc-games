const request = require("supertest");
const db = require("../db/connection");
const app = require("../app");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");

afterAll(() => {
  if (db.end) db.end();
});
beforeEach(() => {
  return seed(testData);
});
describe("GET /api/categories", () => {
  test("returns an array of category objects, with slug and description properties", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Object);
        expect(Object.keys(body)).toEqual(["categories"]);

        const { categories } = body;
        expect(categories).toBeInstanceOf(Array);
        expect(categories).toHaveLength(4);

        categories.forEach((category) => {
          expect(category).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
});
describe("GET /api/reviews/:review_id/comments", () => {
  test("returns an array of category objects, with slug and description properties", () => {
    const expected = [
      {
        comment_id: 1,
        body: "I loved this game too!",
        votes: 16,
        author: "bainesface",
        review_id: 2,
        created_at: "2017-11-22T12:43:33.389Z",
      },
      {
        comment_id: 4,
        body: "EPIC board game!",
        votes: 16,
        author: "bainesface",
        review_id: 2,
        created_at: "2017-11-22T12:36:03.389Z",
      },
      {
        comment_id: 5,
        body: "Now this is a story all about how, board games turned my life upside down",
        votes: 13,
        author: "mallionaire",
        review_id: 2,
        created_at: "2021-01-18T10:24:05.410Z",
      },
    ];
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Object);
        expect(Object.keys(body)).toEqual(["comments"]);

        const { comments } = body;
        expect(comments).toBeInstanceOf(Array);
        expect(comments).toHaveLength(3);

        comments.forEach((category) => {
          expect(category).toEqual(
            expect.objectContaining({
              body: expect.any(String),
              author: expect.any(String),
              votes: expect.any(Number),
              created_at: expect.any(String),
              review_id: 2,
            })
          );
        });
        expect(comments).toEqual(expected);
      });
  });
});
