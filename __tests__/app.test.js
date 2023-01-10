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
        expect(body.msg).toBe("Not found");
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
        expect(body.msg).toBe("Not found");
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
describe("GET /api/users", () => {
  test("returns an array of users object", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
});
describe("POST /api/reviews/:review_id/comments", () => {
  test("returns poseted comment", () => {
    const newComment = {
      username: "philippaclaire9",
      body: "cool game 10/10",
    };
    return request(app)
      .post("/api/reviews/6/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toEqual(
          expect.objectContaining({
            body: expect.any(String),
            author: expect.any(String),
            votes: expect.any(Number),
            created_at: expect.any(String),
            review_id: 6,
          })
        );
      });
  });
  test("returns poseted comment, ignoring extra", () => {
    const newComment = {
      username: "philippaclaire9",
      body: "cool game 10/10",
      review_id: 7,
    };
    return request(app)
      .post("/api/reviews/6/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toEqual(
          expect.objectContaining({
            body: expect.any(String),
            author: expect.any(String),
            votes: expect.any(Number),
            created_at: expect.any(String),
            review_id: 6,
          })
        );
      });
  });
  test("status:400, responds with an error message when missing or having wrong properties in body", () => {
    const newComment = {
      userame: "philippaclaire9",
      body: "cool game 10/10",
    };
    return request(app)
      .post("/api/reviews/6/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("status:400, responds with an error message when body has no properties", () => {
    const newComment = {};
    return request(app)
      .post("/api/reviews/6/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("status:400, responds with an error message when passed a none exsitent user", () => {
    const newComment = {
      username: "philippaclaire",
      body: "cool game 10/10",
    };
    return request(app)
      .post("/api/reviews/6/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("status:400, responds with an error message when passed a no user", () => {
    const newComment = {
      username: "",
      body: "cool game 10/10",
    };
    return request(app)
      .post("/api/reviews/6/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});
describe("PATCH /api/reviews/:review_id", () => {
  test("returns review object with updated votes", () => {
    const input = {
      inc_votes: 10,
    };
    return request(app)
      .patch("/api/reviews/2")
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
  test("status:404, responds with an error message when passed a review ID that doesnt exist", () => {
    const input = {
      inc_votes: 10,
    };
    return request(app)
      .patch("/api/reviews/2000000")
      .send(input)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
  test("status:400, responds with an error message when passed a bad review ID", () => {
    const input = {
      inc_votes: 10,
    };
    return request(app)
      .patch("/api/reviews/hgvcvgh")
      .send(input)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("status:400, responds with an error message when passed a object with wrong propreties", () => {
    const input = {
      voting_change: 12,
    };
    return request(app)
      .patch("/api/reviews/2")
      .send(input)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("status:400, responds with an error message when passed an object with no/wrong value type", () => {
    const input = {
      inc_votes: "",
    };
    return request(app)
      .patch("/api/reviews/2")
      .send(input)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("status:400, responds with an error message when passed an empty object", () => {
    const input = {};
    return request(app)
      .patch("/api/reviews/2")
      .send(input)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});
describe("GET api/reviews/(queries)", () => {
  test("returns objects of specified category sorted by date ain descing order", () => {
    return request(app)
      .get("/api/reviews?sort_by=review_id")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        reviews.forEach((review) => {
          expect(review).toEqual(
            expect.objectContaining({
              owner: expect.any(String),
              title: expect.any(String),
              review_id: expect.any(Number),
              category: expect.any(String),
              review_body: expect.any(String),
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
  test("returns sorted objects by date in specifed order", () => {
    return request(app)
      .get("/api/reviews?order=asc")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        reviews.forEach((review) => {
          expect(review).toEqual(
            expect.objectContaining({
              owner: expect.any(String),
              title: expect.any(String),
              review_id: expect.any(Number),
              category: expect.any(String),
              review_body: expect.any(String),
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
  test("returns objects sorted by date in descing order when only queried catergory", () => {
    return request(app)
      .get("/api/reviews?category=social deduction")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        reviews.forEach((review) => {
          expect(review).toEqual(
            expect.objectContaining({
              owner: expect.any(String),
              title: expect.any(String),
              review_id: expect.any(Number),
              category: "social deduction",
              review_body: expect.any(String),
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
  test("returns sorted objected when query category, sort_by and order", () => {
    return request(app)
      .get("/api/reviews?category=social deduction&sort_by=review_id&rder=asc")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        reviews.forEach((review) => {
          expect(review).toEqual(
            expect.objectContaining({
              owner: expect.any(String),
              title: expect.any(String),
              review_id: expect.any(Number),
              category: "social deduction",
              review_body: expect.any(String),
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
  test("status:400, responds with an error message when passed an object with no/wrong value type", () => {
    const input = {
      inc_votes: "",
    };
    return request(app)
      .patch("/api/reviews/2")
      .send(input)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("status:400, responds with an error message when passed an empty object", () => {
    const input = {};
    return request(app)
      .patch("/api/reviews/2")
      .send(input)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("status:400, responds with an error message when passed none valid category", () => {
    return request(app)
      .get("/api/reviews?category=999999")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("status:200, responds with an empty array when passed a category that exsist but has no reviews", () => {
    return request(app)
      .get("/api/reviews?category=children's games")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toMatchObject([]);
      });
  });
  test("status:400, responds with an error message when passed none valid category", () => {
    return request(app)
      .get("/api/reviews?category=banana")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("status:400, responds with an error message when passed none valid order", () => {
    return request(app)
      .get("/api/reviews?order=banana")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("status:400, responds with an error message when passed none valid sort_by", () => {
    return request(app)
      .get("/api/reviews?sort_by=banana")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("GET /api/reviews/:review_id (comment count)", () => {
  test("returns review object with comment count for that review_id", () => {
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
      comment_count: 3,
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
        expect(body.msg).toBe("Not found");
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

describe("DELETE /api/comments/:comment_id", () => {
  test("returns a status 204 no content and the deleted comemnt", () => {
    return request(app).delete("/api/comments/2").expect(204);
  });

  test("status:404, responds with an error message when passed a comment_id that doesnt exist", () => {
    return request(app)
      .delete("/api/comments/2000000")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
  test("status:400, responds with an error message when passed a bad comment_id", () => {
    return request(app)
      .delete("/api/comments/hgvcvgh")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});
describe("GET /api", () => {
  test("returns objects of endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        const { endpoints } = body;
        expect(endpoints).toEqual(
          expect.objectContaining({
            "GET /api": expect.any(Object),
          })
        );
      });
  });
});
describe("GET /api/users/:username", () => {
  test("returns a user oject with properties of username, avatar_url and name", () => {
    return request(app)
      .get("/api/users/mallionaire")
      .expect(200)
      .then(({ body }) => {
        const { user } = body;
        expect(user).toEqual(
          expect.objectContaining({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          })
        );
      });
  });
  test("status:404, responds with an error message when passed a username that doesnt exist", () => {
    return request(app)
      .get("/api/reviews/55")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
});

describe("POST /api/categories", () => {
  test("returns poseted comment", () => {
    const newCategory = {
      slug: "survival",
      description: "SSurvival of the fitess",
    };
    return request(app)
      .post("/api/categories")
      .send(newCategory)
      .expect(201)
      .then(({ body }) => {
        const { category } = body;
        expect(category).toEqual(
          expect.objectContaining({
            slug: expect.any(String),
            description: expect.any(String),
          })
        );
      });
  });
  test("status:400, responds with an error message when missing or having wrong properties in body", () => {
    const newCategory = {
      userame: "philippaclaire9",
      body: "cool game 10/10",
    };
    return request(app)
      .post("/api/categories")
      .send(newCategory)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("POST /api/reviews", () => {
  test("returns poseted comment", () => {
    const newReview = {
      title: "Karma Karma Chameleon",
      category: "dexterity",
      designer: "Kyouko Honda",
      owner: "mallionaire",
      review_body: "I love Kyo Sohmach",
      review_img_url:
        "https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    };
    return request(app)
      .post("/api/reviews")
      .send(newReview)
      .expect(201)
      .then(({ body }) => {
        const { review } = body;
        expect(review).toEqual(
          expect.objectContaining({
            comment_count: expect.any(Number),
            title: "Karma Karma Chameleon",
            designer: "Kyouko Honda",
            owner: "mallionaire",
            review_body: "I love Kyo Sohmach",
            review_img_url:
              "https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
            category: "dexterity",
            votes: expect.any(Number),
            created_at: expect.any(String),
            review_id: expect.any(Number),
          })
        );
      });
  });

  test("status:400, responds with an error message when missing or having wrong properties in body", () => {
    const newComment = {
      designer: "Kyouko Honda",
      owner: "mallionaire",
      review_body: "I love Kyo Sohmach",
    };
    return request(app)
      .post("/api/reviews")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});
