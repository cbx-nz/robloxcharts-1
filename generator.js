import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

const GAMES = [
  { name: "Nuclear Blast Testing Facility (radios!)", id: "27761886" },
  { name: "Squid Game Infinity Roleplay (tug of war!)", id: "2940826531" }
];

async function getVisitCount(gameId) {
  const url = `https://games.roblox.com/v1/games?universeIds=${gameId}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch game info");
  const data = await res.json();
  return data.data[0]?.visits || 0;
}

async function main() {
  try {
    const [visits1, visits2] = await Promise.all([
      getVisitCount(GAMES[0].id),
      getVisitCount(GAMES[1].id)
    ]);
    const timestamp = new Date().toISOString();
    const result = {
      timestamp,
      games: [
        { name: GAMES[0].name, visits: visits1 },
        { name: GAMES[1].name, visits: visits2 }
      ]
    };
    fs.writeFileSync(path.join(process.cwd(), 'visit-data.json'), JSON.stringify(result, null, 2));
    console.log('Visit data updated:', result);
  } catch (e) {
    console.error('Error generating data:', e);
    process.exit(1);
  }
}

main();