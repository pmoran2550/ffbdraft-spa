const fs = require('fs');
const path = require('path');

const buildFile = path.join(__dirname, 'assets/version.json');
let Major = 1;
let Minor = 0;
let Patch = 0;

if (fs.existsSync(buildFile)) {
  const data = JSON.parse(fs.readFileSync(buildFile));
  Major = data.Major;
  Minor = data.Minor;
  Patch = data.Patch;
}

const Build = process.env.GITHUB_RUN_NUMBER || '0';

fs.writeFileSync(buildFile, JSON.stringify({ Major, Minor, Patch, Build }, null, 2));
console.log(`Build number: ${Build}`);
