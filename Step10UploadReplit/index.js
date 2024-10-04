import express from "express";
import bodyParser from "body-parser";
import { runQuery } from "./queryService.js"; // Use relative path with file extension

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// GET /start endpoint for server check
app.get("/start", (req, res) => {
  res.json({ message: "Server is running!" });
});

// POST /query endpoint to process user queries
app.post("/query", async (req, res) => {
  try {
    const { query } = req.body; // Get the user's query from the request body
    const answer = await runQuery(query); // Call the runQuery function with the user's query
    res.json({ answer }); // Return the answer to Voiceflow
  } catch (error) {
    console.error("Error processing query:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
