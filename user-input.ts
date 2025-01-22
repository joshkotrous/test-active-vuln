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

  // Validate command exists and is a string
  if (!command || typeof command !== 'string') {
    return res.status(400).json({ error: "Invalid command format" });
  }

  // Safely split command and arguments handling quotes and spaces
  const parts = command.match(/^[a-zA-Z]+(\s+[-+][a-zA-Z0-9%:_-]+)*$/);
  if (!parts) {
    return res.status(400).json({ error: "Invalid command format" });
  }

  const commandParts = command.split(/\s+/);
  const baseCommand = commandParts[0];
  const args = commandParts.slice(1);

  // Validate if the command is in the allowed list
  if (!allowedCommands.includes(baseCommand)) {
    return res.status(403).json({ error: "Command not allowed" });
  }

  // Validate all arguments
  const validArgs = args.length === 0 || (
    allowedArgs[baseCommand].length > 0 &&
    args.every(arg =>
      allowedArgs[baseCommand].includes(arg) &&
      /^[-+][a-zA-Z0-9%:_-]+$/.test(arg)
    )
  );

  if (!validArgs) {
    return res.status(403).json({ error: "Command arguments not allowed" });
  }

  // Execute command with explicit array and strict validation
  exec(`${baseCommand} ${args.join(' ')}`, { shell: false }, (error, stdout, stderr) => {
    if (error) {
      console.error(`Execution error: ${error.message}`);
      return res.status(500).json({ error: "Command execution failed" });
});

// Start the server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
