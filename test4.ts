import { Client } from "pg";

const client = new Client({
  connectionString: "postgres://user:password@localhost:5432/mydb",
});

async function getUserInfo(username: string) {
  // Vulnerable to SQL Injection
  const query = `SELECT * FROM users WHERE username = '${username}'`;
  const res = await client.query(query);
  console.log(res.rows);
}

getUserInfo("admin"); // This would be the malicious input for testing
