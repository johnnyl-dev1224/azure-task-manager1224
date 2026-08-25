const request = require("supertest");
const { app, initializeApp } = require("../server");

describe("Task Manager API", () => {

    beforeAll(async () => {
        await initializeApp();
    });

    test("GET / should return API status", async () => {

        const response = await request(app)
            .get("/");

        expect(response.statusCode).toBe(200);

        expect(response.body.message)
            .toBe("Azure Task Manager API is running!");

    });


    test("POST /api/tasks should create a task", async () => {

        const response = await request(app)
            .post("/api/tasks")
            .send({
                title: "Automated test task"
            });

        expect(response.statusCode).toBe(201);

        expect(response.body.title)
            .toBe("Automated test task");

        expect(response.body.completed)
            .toBe(false);

    });

});