import { Pool } from "pg";
import * as dotenv from 'dotenv';

dotenv.config();

// Example: PostgreSQL pool setup
const pool = new Pool({
  user: process.env.DB_USER,
  host: "localhost",
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
});
async function getUserById(userId: string): Promise<void> {
  try {
    // Use parameterized query to prevent SQL injection
    const query = 'SELECT * FROM users WHERE id = $1';
    console.log("Executing query:", query);

    const result = await pool.query(query, [userId]);
    console.log("User:", result.rows);
console.log("User:", result.rows);
  } catch (error) {
    console.error("Error executing database query");
  }
}
getUserById(maliciousInput);
