const request = require('supertest');
const server = require('../server');
const db = require('../data/db-config');

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

beforeEach(async () => {
  await db.seed.run();
});

afterAll(async (done) => {
  await db.destroy();
  done();
});

it('sanity check', () => {
  expect(true).not.toBe(false);
});

describe('recipes/recipes-router.js', () => {
  it('is the correct testing environment', async () => {
    expect(process.env.NODE_ENV).toBe('testing');
  });
  
  describe('[GET] /recipes', () => {

  });
  
  describe('[GET] /recipes/:recipe_id', () => {
    it('on SUCCESS responds with status 200', async () => {
      const recipe_id = 1;
      const res = await request(server).get(`/api/recipes/${recipe_id}`);
      expect(res.status).toEqual(200);
    });
  });

});
