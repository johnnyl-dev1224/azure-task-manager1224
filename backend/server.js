const express = require("express");
const cors = require("cors");
const initializeDatabase = require("./database");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let db;

// Health check
app.get("/", (req, res) => {
    res.json({
        message: "Azure Task Manager API is running!"
    });
});

// Get all tasks
app.get("/api/tasks", async (req, res) => {
    try {
        const tasks = await db.all(`
            SELECT
                id,
                title,
                completed
            FROM tasks
            ORDER BY id
        `);

        res.json(
            tasks.map(task => ({
                ...task,
                completed: Boolean(task.completed)
            }))
        );
    } catch (error) {
        res.status(500).json({
            error: "Failed to retrieve tasks"
        });
    }
});

// Get one task
app.get("/api/tasks/:id", async (req, res) => {
    try {
        const task = await db.get(
            "SELECT * FROM tasks WHERE id = ?",
            req.params.id
        );

        if (!task) {
            return res.status(404).json({
                error: "Task not found"
            });
        }

        task.completed = Boolean(task.completed);

        res.json(task);
    } catch (error) {
        res.status(500).json({
            error: "Failed to retrieve task"
        });
    }
});

// Create a task
app.post("/api/tasks", async (req, res) => {
    try {
        const { title } = req.body;

        if (!title) {
            return res.status(400).json({
                error: "Title is required"
            });
        }

        const result = await db.run(
            "INSERT INTO tasks (title, completed) VALUES (?, ?)",
            title,
            0
        );

        const newTask = await db.get(
            "SELECT * FROM tasks WHERE id = ?",
            result.lastID
        );

        newTask.completed = Boolean(newTask.completed);

        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({
            error: "Failed to create task"
        });
    }
});

// Update a task
app.put("/api/tasks/:id", async (req, res) => {
    try {
        const { title, completed } = req.body;

        const existingTask = await db.get(
            "SELECT * FROM tasks WHERE id = ?",
            req.params.id
        );

        if (!existingTask) {
            return res.status(404).json({
                error: "Task not found"
            });
        }

        await db.run(
            `
            UPDATE tasks
            SET title = COALESCE(?, title),
                completed = COALESCE(?, completed)
            WHERE id = ?
            `,
            title ?? null,
            completed === undefined ? null : completed ? 1 : 0,
            req.params.id
        );

        const updatedTask = await db.get(
            "SELECT * FROM tasks WHERE id = ?",
            req.params.id
        );

        updatedTask.completed = Boolean(updatedTask.completed);

        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({
            error: "Failed to update task"
        });
    }
});

// Delete a task
app.delete("/api/tasks/:id", async (req, res) => {
    try {
        const result = await db.run(
            "DELETE FROM tasks WHERE id = ?",
            req.params.id
        );

        if (result.changes === 0) {
            return res.status(404).json({
                error: "Task not found"
            });
        }

        res.json({
            message: "Task deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            error: "Failed to delete task"
        });
    }
});

// Start server
async function startServer() {
    try {
        db = await initializeDatabase();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log("Database connected successfully");
        });
    } catch (error) {
        console.error("Failed to start server:", error);
    }
}

startServer();