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
        expect(body).toBeInstanceOf(Object);
        expect(Object.keys(body)).toEqual(["review"]);

        const { review } = body;
        expect(review).toBeInstanceOf(Object);

        expect(review).toMatchObject(expected);
      });
  });
  test('status:404, responds with an error message when passed a review ID that doesnt exist', () => {
    return request(app)
      .get('/api/reviews/55')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('No review found for review_id: 55');
      });
  });
  test('status:400, responds with an error message when passed a bad review ID', () => {
    return request(app)
      .get('/api/reviews/gggg')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request');
      });
  });
});
