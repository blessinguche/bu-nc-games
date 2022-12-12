const request = require("supertest");
const db = require("../db/connection");
const app = require("../app");
const seed = require("../db/seeds/seed")
const testData = require("../db/data/test-data/index")

afterAll(() => {
  if (db.end) db.end();
});
beforeEach(() => {
    return seed(testData)
})
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
