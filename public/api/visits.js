import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

export default async function handler(req, res) {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  // read from /public for Vercel compatibility
  const dataPath = path.join(__dirname, '../public/visit-data.json');
  try {
    const json = await fs.readFile(dataPath, 'utf8');
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(json);
  } catch (e) {
    res.status(404).json({ error: "No data available." });
  }
}