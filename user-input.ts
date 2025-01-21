import express from "express";
import { exec } from "child_process";

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Vulnerable endpoint
app.post("/execute", (req, res) => {
  const { command } = req.body;

  // Directly using user input in the shell command (vulnerable to command injection)
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Execution error: ${error.message}`);
      return res.status(500).json({ error: "Command execution failed" });
    }

    if (stderr) {
      console.error(`Command error: ${stderr}`);
    }

    res.json({ output: stdout });
  });
});

// Start the server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
