// Import necessary modules
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
// import dotenv from 'dotenv'; // Import dotenv for loading environment variables
// dotenv.config(); // Load environment variables from .env file into process.env
import { fileURLToPath } from "url";
import path from "path";
import jwt from 'jsonwebtoken';

// Import OpenAI class from the 'openai' modulenano app.js  
import { OpenAI } from "openai";

// Initialize Express application
const app = express();
const port = 3000;

// Use CORS middleware for cross-origin requests
app.use(cors());

// Define secret key for JWT authentication
const secretKeyJWT = process.env.JWT_SECRET_KEY;

// Create HTTP server
const httpServer = createServer(app);

// Create Socket.IO server instance
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Allow requests from any origin
    methods: ["GET", "POST"], // Allow GET and POST requests
    credentials: true, // Allow credentials (cookies, headers)
  },
});  

// Define __dirname using fileURLToPath and path modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Define routes and middleware

// Root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "home.html"));
});

app.get("/data", (req, res) => {
  res.sendFile(path.join(__dirname, "data.html"));
});

// Route for login
app.get("/login", (req, res) => {
  // Create JWT token and send it as a cookie
  const token = jwt.sign({ _id: "#" }, secretKeyJWT);
  res.cookie("token", token, { httpOnly: true, secure: true }).json({
    message: "Welcome to the login page"
  });
});

// Socket.IO connection event handler
io.on("connection", (socket) => {
  console.log("a user connected", socket.id);
  socket.emit("mukul", " is connected"); // Emit "mukul" event

  // Socket.IO event handler for "message" event
  socket.on("message", ({ room, message }) => {
    console.log({ room, message });
    io.to(room).emit("broaddata", message); // Emit "broaddata" event to all clients in the room
  });

  // Socket.IO event handler for "disconnect" event
  socket.on("disconnect", () => {
    console.log("a user disconnected", socket.id);
  });
});

// Start HTTP server and listen on specified port
httpServer.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});

// Main function for interacting with OpenAI
async function main() {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: "Hello, world!" }],
    model: "gpt-3.5-turbo",
  });

  console.log(completion.choices[0].message.content);
}

// Call main function
main();
