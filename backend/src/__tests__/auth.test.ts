import request from "supertest";
import app from "../app";
import { Prisma } from "../../prisma/library/prisma";
import bcrypt from "bcrypt";

describe("authentication", () => {
  beforeAll(async () => {
    try{
    const hashed = await bcrypt.hash(process.env.TEST_PASS as string, 10);
    await Prisma.user.upsert({
      where: { email: process.env.TEST_USER as string },
      update: {},
      create: {
        email: process.env.TEST_USER as string,
        password: hashed,
        name: "Test User",
      },
    });
    console.log('Test user created successfully');
  }catch(err){
    console.error('Error creating test user:', err);
  }
  });
  afterAll(async () => {
    await Prisma.user.deleteMany({
      where: { email: process.env.TEST_USER as string },
    });
  });
  describe("sign in", () => {
    it("signs in with valid credentials", async () => {
      const res = await request(app)
        .post("/users/signIn")
        .send({
          email: process.env.TEST_USER as string,
          password: process.env.TEST_PASS as string,
        });
      console.log('Sign in response:', res.body);
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Sign in successful");
      expect(res.headers["set-cookie"]).toBeDefined();
    });
    it("reject invalid password", async () => {
      const res = await request(app)
        .post("/users/signIn")
        .send({
          email: process.env.TEST_USER as string,
          password: "Wrong!Password",
        });
      console.log('Sign in response:', res.body);
      expect(res.status).toBe(401);
      expect(res.body.error).toBe("Invalid password");
    });
    it("rejects non-existent user", async () => {
      const res = await request(app).post("/users/signIn").send({
        email: "nobody@nowhere.com",
        password: "somepassword",
      });

      expect(res.status).toBe(404);
      expect(res.body.error).toBe("User not found");
    });
  });
  describe("sign up", () => {
    const testEmail = "JT@test.com";
    afterEach(async () => {
      await Prisma.user.deleteMany({ where: { email: testEmail } });
    });

    it("sign up a new user", async () => {
      const res = await request(app)
        .post("/users/signup")
        .send({
          email: testEmail,
          name: "John Test",
          password: process.env.TEST_PASS as string,
        });
      expect(res.status).toBe(201);
      expect(res.body.message).toBe("User created successfully");
    });

    it("reject duplicate emails", async () => {
      await request(app)
        .post("/users/signup")
        .send({ email: testEmail, password: "Testing11", name: "Test" });

      const res = await request(app)
        .post("/users/signup")
        .send({ email: testEmail, password: "Testing", name: "Test" });
      expect(res.status).toBe(500);
    });
  });
  describe("logged in check", () => {
    it("returns authenticated false with no cookie", async () => {
      const res = await request(app).get("/users/loggedIn");

      expect(res.status).toBe(200);
      expect(res.body.authenticated).toBe(false);
    });
    it('returns authenticated true with valid cookie', async () => {
        const signInRes = await request(app).post("/users/signIn").send({email:process.env.TEST_USER as string, password: process.env.TEST_PASS as string});
        const cookie = signInRes.headers['set-cookie'];
        const res = await request(app).get("/users/loggedIn").set('Cookie', cookie);
        expect(res.status).toBe(200);
        expect(res.body.authenticated).toBe(true);
    });
  });
});
