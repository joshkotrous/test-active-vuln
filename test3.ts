import { Request, Response } from "express";
import { Client } from "pg";

const client = new Client({
  user: "myuser",
  host: "localhost",
  database: "mydatabase",
  password: "mypassword",
  port: 5432,
});

client.connect();

const getUserData = (req: Request, res: Response) => {
  const { userId } = req.params;

  // Vulnerable code: Directly injecting user input into the SQL query
  const query = `SELECT * FROM users WHERE id = ${userId};`;

  client.query(query, (err, result) => {
    if (err) {
      res.status(500).send("Error querying database");
      return;
    }
    res.json(result.rows);
  });
};

export { getUserData };
