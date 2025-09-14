const request = require("supertest");
const { app, server } = require("../backend/server");

describe("Server API", () => {
    afterAll((done) => {
        server.close(done);
    });

    test("GET / should return welcome message", async () => {
        const response = await request(app).get("/");
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("KODEON Cloud IDE API Server");
    });

    test("GET /health should return status OK", async () => {
        const response = await request(app).get("/health");
        expect(response.status).toBe(200);
        expect(response.body.status).toBe("OK");
    });
});
