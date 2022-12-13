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
        const { categories } = body;
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

describe("GET /api/reviews", () => {
  test("returns an array of review objects that includes comment_count properties", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toHaveLength(13);
        reviews.forEach((review) => {
          expect(review).toEqual(
            expect.objectContaining({
              owner: expect.any(String),
              title: expect.any(String),
              review_id: expect.any(Number),
              category: expect.any(String),
              review_img_url: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              designer: expect.any(String),
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });
});

describe("GET /api/reviews/:review_id", () => {
  test("returns coreect array of an review object that matches review ID ", () => {
    const expected = {
      review_id: 2,
      title: "Jenga",
      designer: "Leslie Scott",
      owner: "philippaclaire9",
      review_img_url:
        "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
      review_body: "Fiddly fun for all the family",
      category: "dexterity",
      created_at: "2021-01-18T10:01:41.251Z",
      votes: 5,
    };
    return request(app)
      .get("/api/reviews/2")
      .expect(200)
      .then(({ body }) => {
        const { review } = body;
        expect(review).toMatchObject(expected);
      });
  });
  test("status:404, responds with an error message when passed a review ID that doesnt exist", () => {
    return request(app)
      .get("/api/reviews/55")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("ID not found");
      });
  });
  test("status:400, responds with an error message when passed a bad review ID", () => {
    return request(app)
      .get("/api/reviews/gggg")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("GET /api/reviews/:review_id/comments", () => {
  test("returns an array of category objects, with slug and description properties", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toHaveLength(3);

        comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              body: expect.any(String),
              author: expect.any(String),
              votes: expect.any(Number),
              created_at: expect.any(String),
              review_id: 2,
            })
          );
        });
      });
  });
  test("status:404, responds with an error message when passed a review ID that doesnt exist", () => {
    return request(app)
      .get("/api/reviews/678788/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("ID not found");
      });
  });
  test("status:400, responds with an error message when passed a bad review ID", () => {
    return request(app)
      .get("/api/reviews/ihgy/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});
describe("PATCH api/reviews/:review", () => {
  test("returns review object with updated votes", () => {
    const input = {
      inc_votes: 10,
    };
    return request(app)
      .patch("/api/reviews/2/comments")
      .send(input)
      .expect(200)
      .then(({ body }) => {
        const { review } = body;
        expect(review.votes).toBe(15);
        expect(review).toEqual(
          expect.objectContaining({
            owner: expect.any(String),
            title: expect.any(String),
            review_id: expect.any(Number),
            category: expect.any(String),
            review_img_url: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            designer: expect.any(String),
          })
        );
      });
  });
  test("status:404, responds with an error message when passed a upject with wrong propreties", () => {
    const input = {
      voting_change: 12,
    };
    return request(app)
      .patch("/api/reviews/2/comments")
      .send(input)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("status:400, responds with an error message when passed an empty object", () => {
    const input = {};
    return request(app)
      .patch("/api/reviews/2/comments")
      .send(input)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});
