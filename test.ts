import { Pool } from "pg";

// Example: PostgreSQL pool setup
const pool = new Pool({
  user: "your_username",
  host: "localhost",
  database: "your_database",
  password: "your_password",
  port: 5432,
});

async function getUserById(userId: string): Promise<void> {
  try {
    // Vulnerable SQL query: Directly concatenating user input into the query
    const query = `SELECT * FROM users WHERE id = '${userId}';`;

    console.log("Executing query:", query);

    const result = await pool.query(query);
    console.log("User:", result.rows);
  } catch (error) {
    console.error("Error executing query:", error);
  }
}

// Simulating an attacker providing malicious input
const maliciousInput = "1'; DROP TABLE users; --";
getUserById(maliciousInput);
