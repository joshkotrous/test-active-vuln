import express from "express";
import { exec } from "child_process";

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Vulnerable endpoint
app.post("/execute", (req, res) => {
  const { command } = req.body;
  const allowedCommands = ['ls', 'pwd', 'echo', 'date'];

  // Extract the base command without arguments
  const baseCommand = command.split(' ')[0];

  // Validate if the command is in the allowed list
  if (!allowedCommands.includes(baseCommand)) {
    return res.status(403).json({ error: "Command not allowed" });
  }

  // Execute command with shell disabled to prevent command injection
  exec(command, { shell: false }, (error, stdout, stderr) => {
    if (error) {
      console.error(`Execution error: ${error.message}`);
      return res.status(500).json({ error: "Command execution failed" });
    }

    if (stderr) {
      return res.status(400).json({ error: stderr });
    }

    res.json({ output: stdout });
  });
});

// Start the server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
