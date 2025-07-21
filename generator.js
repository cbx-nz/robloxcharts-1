import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

// Replace these with actual PLACE IDs (not universe IDs)
const GAMES = [
  { name: "Nuclear Blast Testing Facility ☢️💣 (radios!)", id: "27761886" },
  { name: "Squid Game Infinity Roleplay (⭐SKIP ROPE)", id: "2940826531" },
  { name: "Feudal Japan Roleplay [BETA!]", id: "17429125490" }
];

// Step 1: Convert placeId to universeId
async function getUniverseId(placeId) {
  const url = `https://apis.roblox.com/universes/v1/places/${placeId}/universe`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch universe ID for place ${placeId} - Status: ${res.status}`);
  }
  const data = await res.json();
  return data.universeId;
}

// Step 2: Get visit count from universeId
async function getVisitCount(universeId) {
  const url = `https://games.roblox.com/v1/games?universeIds=${universeId}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch game info for universe ${universeId} - Status: ${res.status}`);
  }
  const data = await res.json();
  return data.data[0]?.visits || 0;
}

// Main function to get all visit counts and save
async function main() {
  try {
    const results = await Promise.all(
      GAMES.map(async (game) => {
        const universeId = await getUniverseId(game.id);
        const visits = await getVisitCount(universeId);
        return { name: game.name, visits };
      })
    );

    const timestamp = new Date().toISOString();
    const output = {
      timestamp,
      games: results
    };

    const outputPath = path.join(process.cwd(), './public/visit-data.json');
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

    console.log('✅ Visit data updated:\n', output);
  } catch (err) {
    console.error('❌ Error generating data:', err);
    process.exit(1);
  }
}

main();
