const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");
require("dotenv").config();

async function migrate() {
  const adminPool = new Pool({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    database: "postgres",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
  });

  try {
    const dbName = process.env.DB_NAME || "rsvp_db";

    const checkDb = await adminPool.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [dbName]
    );

    if (checkDb.rows.length === 0) {
      console.log(`Creating database '${dbName}'...`);
      await adminPool.query(`CREATE DATABASE ${dbName}`);
      console.log(`Database '${dbName}' created`);
    } else {
      console.log(`Database '${dbName}' already exists`);
    }

    await adminPool.end();

    const pool = new Pool({
      host: process.env.DB_HOST || "localhost",
      port: process.env.DB_PORT || 5432,
      database: dbName,
      user: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "postgres",
    });

    const schemaPath = path.join(__dirname, "schema.sql");
    let schema = fs.readFileSync(schemaPath, "utf8");

    const updateTimestampFunction = `
    CREATE OR REPLACE FUNCTION update_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
    `;

    schema = updateTimestampFunction + "\n" + schema;

    console.log("Running database migrations...");
    await pool.query(schema);
    console.log("Database migration completed successfully");

    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error.message);
    if (error.code === "ECONNREFUSED") {
      console.error("\nError: Could not connect to PostgreSQL.");
      console.error(
        "Please ensure PostgreSQL is running and credentials in .env are correct."
      );
    } else if (error.code === "28P01") {
      console.error("\nError: Authentication failed.");
      console.error("Please check DB_USER and DB_PASSWORD in .env file.");
    }
    await adminPool.end().catch(() => {});
    process.exit(1);
  }
}

migrate();
