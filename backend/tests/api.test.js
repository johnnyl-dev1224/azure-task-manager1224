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

    test("GET /api/tasks should return tasks", async () => {

        const response = await request(app)
            .get("/api/tasks");

        expect(response.statusCode).toBe(200);

        expect(Array.isArray(response.body))
            .toBe(true);

    });

    test("PUT /api/tasks/:id should update a task", async () => {

        const createResponse = await request(app)
            .post("/api/tasks")
            .send({
                title: "Task to complete"
            });

        expect(createResponse.statusCode).toBe(201);

        const taskId = createResponse.body.id;

        const updateResponse = await request(app)
            .put(`/api/tasks/${taskId}`)
            .send({
                completed: true
            });

        expect(updateResponse.statusCode).toBe(200);

        expect(updateResponse.body.completed)
            .toBe(true);

    });

    test("DELETE /api/tasks/:id should delete a task", async () => {

        const createResponse = await request(app)
            .post("/api/tasks")
            .send({
                title: "Task to delete"
            });

        expect(createResponse.statusCode).toBe(201);

        const taskId = createResponse.body.id;

        const deleteResponse = await request(app)
            .delete(`/api/tasks/${taskId}`);

        expect(deleteResponse.statusCode).toBe(200);

        const getResponse = await request(app)
            .get(`/api/tasks/${taskId}`);

        expect(getResponse.statusCode).toBe(404);

    });

    test("POST /api/tasks should reject an empty title", async () => {

        const response = await request(app)
            .post("/api/tasks")
            .send({
                title: ""
            });

        expect(response.statusCode).toBe(400);

        expect(response.body.error)
            .toBe("Title is required");

    });

});