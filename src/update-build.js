const fs = require('fs');
const path = require('path');

const buildFile = path.join(__dirname, 'app/version.json');
let Major = 1;
let Minor = 0;
let Patch = 0;
let Build = 1;

if (fs.existsSync(buildFile)) {
  const data = JSON.parse(fs.readFileSync(buildFile));
  Major = data.Major;
  Minor = data.Minor;
  Patch = data.Patch;
  Build = data.Build + 1;
}

fs.writeFileSync(buildFile, JSON.stringify({ Major, Minor, Patch, Build }, null, 2));
console.log(`Build number: ${Build}`);
