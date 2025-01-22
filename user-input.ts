import express from "express";
import { exec } from "child_process";

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Vulnerable endpoint
app.post("/execute", (req, res) => {
 const { command } = req.body;
 const allowedCommands = ['ls', 'pwd', 'echo', 'date'];
  const allowedArgs = {
    'ls': ['-l', '-a', '-h', '-r'],
    'pwd': [],
    'echo': ['-n', '-e'],
    'date': ['+%Y-%m-%d', '+%H:%M:%S', '-u']
  };

  // Split command and arguments
  const parts = command.split(' ');
  const baseCommand = parts[0];
  const args = parts.slice(1);

  // Validate if the command is in the allowed list
  if (!allowedCommands.includes(baseCommand)) {
    return res.status(403).json({ error: "Command not allowed" });
  }

  // Validate all arguments
  if (!args.every(arg => allowedArgs[baseCommand].includes(arg))) {
    return res.status(403).json({ error: "Command arguments not allowed" });
  }

  // Execute command with shell disabled to prevent command injection
  exec(command, { shell: false }, (error, stdout, stderr) => {
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
