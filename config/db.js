const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
  // Enable SSL for managed Postgres providers that require encrypted connections
  ssl: { rejectUnauthorized: false },
});

// Verify initial connection on startup and log status
pool
  .connect()
  .then((client) => {
    console.log("Database connected successfully");
    client.release();
  })
  .catch((error) => {
    console.error("Database connection error:", error.message);
  });

module.exports = pool;