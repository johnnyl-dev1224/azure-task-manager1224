const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

async function initializeDatabase() {
    const db = await open({
        filename: "./tasks.db",
        driver: sqlite3.Database
    });

    await db.exec(`
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            completed INTEGER DEFAULT 0
        )
    `);

    return db;
}

module.exports = initializeDatabase;