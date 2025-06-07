const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  const dataPath = path.join(__dirname, '../visit-data.json');
  if (fs.existsSync(dataPath)) {
    res.sendFile(dataPath);
  } else {
    res.status(404).json({ error: "No data available." });
  }
};