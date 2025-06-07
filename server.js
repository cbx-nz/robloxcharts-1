const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = 4070;

// Replace with your target Roblox game IDs
const GAMES = [
{ name: "Nuclear Blast Testing Facility", id: "6153709" },
  { name: "Squid Game Infinity Roleplay", id: "7569392700" }
];

// Helper to get visit count for a Roblox game
async function getVisitCount(gameId) {
  // Roblox games endpoint (public API)
  const url = `https://games.roblox.com/v1/games?universeIds=${gameId}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch game info");
  const data = await res.json();
  return data.data[0]?.visits || 0;
}

// Serve frontend
app.use(express.static('public'));

// API for frontend to get latest histogram data
app.get('/api/visits', async (req, res) => {
  try {
    const [visits1, visits2] = await Promise.all([
      getVisitCount(GAMES[0].id),
      getVisitCount(GAMES[1].id)
    ]);
    const now = new Date();
    const label = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    res.json({
      labels: [label],
      datasets: [
        { label: GAMES[0].name, data: [visits1] },
        { label: GAMES[1].name, data: [visits2] }
      ]
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});