import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());

// Algorithm engine base URL
const ALGO_ENGINE_URL = "http://127.0.0.1:8000"; // later replace with Docker URL

// Test SBERT similarity
app.post("/api/sbert", async (req, res) => {
  try {
    const response = await axios.post(`${ALGO_ENGINE_URL}/sbert`, req.body);
    res.json(response.data);
  } catch (err) {
    console.error("SBERT error:", err.message);
    res.status(500).json({ error: "SBERT request failed" });
  }
});

// Agreement score
app.post("/api/agreement", async (req, res) => {
  try {
    const response = await axios.post(`${ALGO_ENGINE_URL}/agreement`, req.body);
    res.json(response.data);
  } catch (err) {
    console.error("Agreement error:", err.message);
    res.status(500).json({ error: "Agreement request failed" });
  }
});

// Trust score
app.post("/api/trust", async (req, res) => {
  try {
    const response = await axios.post(`${ALGO_ENGINE_URL}/trust`, req.body);
    res.json(response.data);
  } catch (err) {
    console.error("Trust error:", err.message);
    res.status(500).json({ error: "Trust request failed" });
  }
});

// Safest route (OSM)
app.post("/api/route", async (req, res) => {
  try {
    const response = await axios.post(`${ALGO_ENGINE_URL}/route-osm`, req.body);
    res.json(response.data);
  } catch (err) {
    console.error("Route error:", err.message);
    res.status(500).json({ error: "Route request failed" });
  }
});

// Root
app.get("/", (req, res) => {
  res.json({ message: "Node backend running and proxying algorithm engine!" });
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Node server running at http://localhost:${PORT}`);
});
